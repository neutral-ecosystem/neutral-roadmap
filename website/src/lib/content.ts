import { readFile, readdir } from 'node:fs/promises';
import { dirname, extname, normalize, relative, resolve, sep } from 'node:path';
import { marked } from 'marked';
import { isIgnoredDirectory, isPublishedProjectSource, projects, sectionPrefixes, sourceRoots } from '../../docs.config';

// Astro executes this module from the website project root in dev and build.
const repositoryRoot = resolve(process.cwd(), '..');

export interface DocPage {
  sourcePath: string;
  route: string;
  title: string;
  description: string;
  status: string;
  html: string;
  view?: 'host' | 'portable';
  version?: string;
}

function kebab(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

function extractTitle(source: string, fallback: string) {
  return source.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? fallback;
}

function extractStatus(source: string) {
  return source.match(/^Status:\s*(.+)$/m)?.[1]?.trim() ?? 'published';
}

function removeDocumentTitle(source: string) {
  return source
    .replace(/^#\s+.+(?:\r?\n){1,2}/, '')
    .replace(/^Status:\s*.+(?:\r?\n){1,2}/m, '');
}

function routeFor(sourcePath: string) {
  if (sourcePath === 'README.md') return '/';
  const parts = sourcePath.split('/');
  const domain = parts.shift()!;
  const prefix = sectionPrefixes[domain] ?? kebab(domain);
  const file = parts.pop()!;
  const stem = file.slice(0, -extname(file).length);
  const isReadme = stem.toLowerCase() === 'readme';
  const portableIndex = parts.indexOf('portable');
  const versionIndex = parts.findIndex((part) => /^v\d+$/.test(part));
  const cleanParts = parts.filter((part) => part !== 'portable');
  const routeParts = [prefix, ...cleanParts];
  if (versionIndex >= 0 && domain === 'neutral-lang') {
    const portable = portableIndex >= 0;
    const insertAt = 1 + versionIndex + 1;
    routeParts.splice(insertAt, 0, portable ? 'portable' : 'host');
  }
  if (!isReadme) routeParts.push(kebab(stem));
  return `/${routeParts.filter(Boolean).map(kebab).join('/')}/`;
}

function rewriteLinks(source: string, currentPath: string, routes: Map<string, string>) {
  return source.replace(/\]\(([^)#]+)(#[^)]*)?\)/g, (match, target: string, fragment = '') => {
    if (/^(?:https?:|mailto:|\/)/.test(target)) return match;
    const normalized = normalize(resolve(dirname(currentPath), target)).split(sep).join('/');
    const route = routes.get(normalized);
    return route ? `](${route}${fragment})` : match;
  });
}

function classify(sourcePath: string) {
  if (!sourcePath.startsWith('neutral-lang/')) return {};
  const parts = sourcePath.split('/');
  const version = parts.find((part) => /^v\d+$/.test(part));
  if (!version) return {};
  return { view: parts.includes('portable') ? ('portable' as const) : ('host' as const), version };
}

async function markdownFiles(path: string, prefix = ''): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (isIgnoredDirectory(entry.name)) continue;
    const entryPath = resolve(path, entry.name);
    const sourcePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await markdownFiles(entryPath, sourcePath));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(sourcePath);
  }
  return files;
}

export async function loadDocs(): Promise<DocPage[]> {
  const files: string[] = [];
  for (const root of sourceRoots) {
    const path = resolve(repositoryRoot, root);
    if (root.endsWith('.md')) files.push(root);
    else files.push(...await markdownFiles(path, root));
  }
  const publishedFiles = files.filter((sourcePath) => sourcePath === 'README.md' || sourcePath.startsWith('rules/') || isPublishedProjectSource(sourcePath));
  const routeIndex = new Map(publishedFiles.map((sourcePath) => [sourcePath, routeFor(sourcePath)]));
  const pages = await Promise.all(publishedFiles.map(async (sourcePath) => {
    const source = await readFile(resolve(repositoryRoot, sourcePath), 'utf8');
    const renderedSource = rewriteLinks(removeDocumentTitle(source), sourcePath, routeIndex);
    const title = extractTitle(renderedSource, sourcePath.split('/').at(-1)?.replace(/\.md$/, '') ?? 'Document');
    const page: DocPage = {
      sourcePath,
      route: routeFor(sourcePath),
      title,
      description: `${title} — Neutral ecosystem documentation.`,
      status: extractStatus(renderedSource),
      html: await marked.parse(renderedSource),
      ...classify(sourcePath),
    };
    return page;
  }));
  const routes = new Set<string>();
  for (const page of pages) {
    if (routes.has(page.route)) throw new Error(`Duplicate documentation route: ${page.route}`);
    routes.add(page.route);
  }
  for (const project of projects) {
    const portableEntries = pages
      .filter((page) => new RegExp(`^${project.domain}/v\\d+/portable/README\\.md$`).test(page.sourcePath))
      .sort((a, b) => (Number(b.version?.slice(1)) || 0) - (Number(a.version?.slice(1)) || 0));
    const portableEntry = portableEntries[0];
    const portableVersion = portableEntry?.version;
    pages.push({
      sourcePath: `${project.domain}/${portableVersion ?? 'vN'}/project-index`,
      route: `/${project.prefix}/`,
      title: project.label,
      description: portableEntry ? `${project.label} ${portableVersion} portable documentation.` : `${project.label} documentation is still being built.`,
      status: portableEntry ? `${portableVersion} portable` : 'documentation in progress',
      html: portableEntry
        ? `<p class="doc-notice">The ${portableVersion} portable documentation is available.</p><p><a href="${portableEntry.route}">Open the ${portableVersion} portable documentation</a></p>`
        : '<p class="doc-notice">Documentation is still being built.</p><p>A portable versioned seed for this project is not available yet.</p>',
      view: portableEntry ? 'portable' : undefined,
      version: portableVersion,
    });
  }
  return pages.sort((a, b) => a.route.localeCompare(b.route));
}

export function relativeSource(from: string, to: string) {
  return relative(dirname(from), to).split(sep).join('/');
}
