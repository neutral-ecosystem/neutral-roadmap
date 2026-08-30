import { readFile, readdir } from 'node:fs/promises';
import { dirname, extname, normalize, relative, resolve, sep } from 'node:path';
import { marked } from 'marked';
import { ignoredDirectories, sectionPrefixes, sourceRoots } from '../../docs.config';

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
    if (ignoredDirectories.has(entry.name)) continue;
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
  const routeIndex = new Map(files.map((sourcePath) => [sourcePath, routeFor(sourcePath)]));
  const pages = await Promise.all(files.map(async (sourcePath) => {
    const source = await readFile(resolve(repositoryRoot, sourcePath), 'utf8');
    const renderedSource = rewriteLinks(source, sourcePath, routeIndex);
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
  return pages.sort((a, b) => a.route.localeCompare(b.route));
}

export function relativeSource(from: string, to: string) {
  return relative(dirname(from), to).split(sep).join('/');
}
