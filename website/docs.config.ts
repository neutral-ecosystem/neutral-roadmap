export const sourceRoots = ['README.md', 'rules', 'neutral-lang', 'neutral-editor', 'neutral-flow', 'neux'];

export const projects = [
  { domain: 'neutral-lang', prefix: 'language', label: 'Neutral language' },
  { domain: 'neutral-editor', prefix: 'editor', label: 'Neutral Editor' },
  { domain: 'neutral-flow', prefix: 'flow', label: 'Neutral Flow' },
  { domain: 'neux', prefix: 'neux', label: 'Neux' },
] as const;

export const projectDocuments = new Set(['ARCHITECTURE.md', 'REQUIREMENTS.md', 'ROADMAP.md']);

export const sectionPrefixes: Record<string, string> = {
  'neutral-lang': 'language',
  'neutral-editor': 'editor',
  'neutral-flow': 'flow',
  neux: 'neux',
  rules: 'rules',
};

export const ignoredDirectories = new Set(['.agents', '.codex', '.git', '.astro', 'dist', 'node_modules']);

export function isIgnoredDirectory(name: string) {
  return name.startsWith('_') || ignoredDirectories.has(name);
}

export function isPublishedProjectSource(sourcePath: string) {
  return projects.some(({ domain }) => {
    if (sourcePath.startsWith(`${domain}/v`)) return new RegExp(`^${domain}/v\\d+/portable/`).test(sourcePath);
    return sourcePath.startsWith(`${domain}/`) && projectDocuments.has(sourcePath.slice(domain.length + 1));
  });
}

export const navOrder = ['README.md', 'ARCHITECTURE.md', 'REQUIREMENTS.md', 'choices.md', 'ROADMAP.md', 'DEVELOPMENT.md'];
