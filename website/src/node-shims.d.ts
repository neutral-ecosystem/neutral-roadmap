declare const process: { cwd(): string };

declare module 'node:path' {
  export const sep: string;
  export function dirname(path: string): string;
  export function extname(path: string): string;
  export function normalize(path: string): string;
  export function relative(from: string, to: string): string;
  export function resolve(...paths: string[]): string;
}

declare module 'node:fs/promises' {
  export interface Dirent {
    name: string;
    isDirectory(): boolean;
    isFile(): boolean;
  }
  export function readFile(path: string, encoding: 'utf8'): Promise<string>;
  export function readdir(path: string, options: { withFileTypes: true }): Promise<Dirent[]>;
}
