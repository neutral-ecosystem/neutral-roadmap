import { readFile, readdir } from 'node:fs/promises';
import { dirname, extname, normalize, relative, resolve, sep } from 'node:path';
import { Marked } from 'marked';
import { isIgnoredDirectory, isPublishedProjectSource, projectDocuments, projects, sectionPrefixes, sourceRoots } from '../../docs.config';

// Astro executes this module from the website project root in dev and build.
const repositoryRoot = resolve(process.cwd(), '..');
const repositoryUrl = 'https://github.com/neutral-ecosystem/neutral-roadmap/blob/main';

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

function renderMarkdown(source: string) {
  const headingCounts = new Map<string, number>();
  const markdown = new Marked({
    renderer: {
      heading({ tokens, depth, text }) {
        const base = kebab(text) || 'section';
        const count = headingCounts.get(base) ?? 0;
        headingCounts.set(base, count + 1);
        const id = count === 0 ? base : `${base}-${count + 1}`;
        return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}<a class="heading-anchor" href="#${id}" aria-label="Link to this section">§</a></h${depth}>`;
      },
    },
  });
  return markdown.parse(source);
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
  const isProjectVersion = projects.some((project) => project.domain === domain);
  if (isReadme && portableIndex === parts.length - 1 && versionIndex >= 0 && isProjectVersion) {
    return `/${prefix}/${kebab(parts[versionIndex])}/`;
  }
  const cleanParts = parts.filter((part) => part !== 'portable');
  const routeParts = [prefix, ...cleanParts];
  if (versionIndex >= 0 && isProjectVersion) {
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
    const normalized = relative(
      repositoryRoot,
      normalize(resolve(repositoryRoot, dirname(currentPath), target)),
    ).split(sep).join('/');
    const route = routes.get(normalized);
    if (route) return `](${route}${fragment})`;
    const portableRoot = currentPath.match(/^(neutral-(?:lang|editor|flow)\/v\d+\/portable)\//)?.[1];
    if (portableRoot && normalized.startsWith(`${portableRoot}/`)) {
      return `](${repositoryUrl}/${normalized}${fragment})`;
    }
    if (/^neutral-(?:lang|editor|flow)\//.test(currentPath)) {
      throw new Error(`Published document ${currentPath} links to non-public source ${normalized}`);
    }
    return `](${repositoryUrl}/${normalized}${fragment})`;
  });
}

function classify(sourcePath: string) {
  if (!projects.some((project) => sourcePath.startsWith(`${project.domain}/`))) return {};
  const parts = sourcePath.split('/');
  const version = parts.find((part) => /^v\d+$/.test(part));
  if (!version) return {};
  return { view: parts.includes('portable') ? ('portable' as const) : ('host' as const), version };
}

function titleCase(value: string) {
  const minorWords = new Set(['a', 'an', 'and', 'or', 'the', 'of', 'to', 'in', 'on']);
  return value
    .replace(/[-_]+/g, ' ')
    .toLowerCase()
    .split(' ')
    .map((word, index) => /^v\d+$/.test(word) || (index > 0 && minorWords.has(word)) ? word : word.replace(/^\w/, (letter) => letter.toUpperCase()))
    .join(' ');
}

export function catalogTitle(page: DocPage, context: 'project' | 'version' = 'project') {
  if (page.sourcePath.endsWith('/project-index')) return 'Overview';
  if (page.sourcePath.endsWith('/version-index')) {
    const version = page.sourcePath.match(/\/(v\d+)\/version-index$/)?.[1];
    if (!version) return 'Version overview';
    return context === 'version' ? 'Version overview' : version;
  }
  const portableMarker = page.sourcePath.indexOf('/portable/');
  if (portableMarker >= 0) {
    const path = page.sourcePath.slice(portableMarker + '/portable/'.length).replace(/\.md$/, '').split('/');
    const file = path.pop() ?? '';
    if (file.toLowerCase() === 'readme') {
      if (path.length) return path.map(titleCase).join(' / ');
      return context === 'version' ? 'Version overview' : page.version ?? 'Version';
    }
    return [...path, file].map(titleCase).join(' / ');
  }
  const file = page.sourcePath.split('/').at(-1)?.replace(/\.md$/, '');
  if (file && projectDocuments.has(`${file}.md`)) return titleCase(file);
  return page.title;
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
    const title = extractTitle(source, sourcePath.split('/').at(-1)?.replace(/\.md$/, '') ?? 'Document');
    const page: DocPage = {
      sourcePath,
      route: routeFor(sourcePath),
      title,
      description: `${title} — Neutral ecosystem documentation.`,
      status: extractStatus(source),
      html: await renderMarkdown(renderedSource),
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
    const versions = [...new Set(
      files
        .filter((sourcePath) => sourcePath.startsWith(`${project.domain}/`))
        .map((sourcePath) => sourcePath.match(new RegExp(`^${project.domain}/(v\\d+)/`))?.[1])
        .filter((version): version is string => Boolean(version)),
    )].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
    for (const version of versions) {
      const portableEntry = pages.find((page) => page.sourcePath === `${project.domain}/${version}/portable/README.md`);
      if (portableEntry) continue;
      pages.push({
        sourcePath: `${project.domain}/${version}/version-index`,
        route: `/${project.prefix}/${version}/`,
        title: `${project.label} ${version}`,
        description: portableEntry ? `${project.label} ${version} portable documentation.` : `${project.label} ${version} documentation is still being built.`,
        status: portableEntry ? `${version} portable` : 'documentation in progress',
        html: portableEntry
          ? `<p class="doc-notice">This version publishes its portable documentation. Use the catalog to browse its sections.</p>`
          : `<p class="doc-notice">Documentation is still being built.</p><p>The ${version}/portable seed for this project is not available yet.</p>`,
        view: portableEntry ? 'portable' : undefined,
        version: portableEntry ? version : undefined,
      });
    }
  }
  for (const project of projects) {
    const portableEntries = pages
      .filter((page) => new RegExp(`^${project.domain}/v\\d+/portable/README\\.md$`).test(page.sourcePath))
      .sort((a, b) => (Number(b.version?.slice(1)) || 0) - (Number(a.version?.slice(1)) || 0));
    const portableVersion = portableEntries[0]?.version;
    const topDocuments = pages.filter((page) => page.sourcePath.startsWith(`${project.domain}/`) && projectDocuments.has(page.sourcePath.slice(project.domain.length + 1)));
    const versionPages = pages.filter((page) => new RegExp(`^/${project.prefix}/v\\d+/$`).test(page.route));
    const hasDocumentation = topDocuments.length > 0 || versionPages.length > 0;
    pages.push({
      sourcePath: `${project.domain}/${portableVersion ?? 'vN'}/project-index`,
      route: `/${project.prefix}/`,
      title: project.label,
      description: hasDocumentation ? `${project.label} documentation and version indexes.` : `${project.label} documentation is still being built.`,
      status: hasDocumentation ? 'documentation' : 'documentation in progress',
      html: hasDocumentation
        ? `<p class="project-summary">${project.summary}</p><p>Project contracts define the shared direction. Version pages expose only their matching <code>vN/portable/</code> implementation documentation.</p>`
        : '<p class="doc-notice">Documentation is still being built.</p><p>A portable versioned seed for this project is not available yet.</p>',
    });
  }
  return pages.sort((a, b) => a.route.localeCompare(b.route));
}

export function relativeSource(from: string, to: string) {
  return relative(dirname(from), to).split(sep).join('/');
}

export function sourceUrl(sourcePath: string) {
  return sourcePath.endsWith('/project-index') || sourcePath.endsWith('/version-index')
    ? undefined
    : `${repositoryUrl}/${sourcePath}`;
}
