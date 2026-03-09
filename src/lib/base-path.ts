export function withBasePath(path: string): string {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  if (basePath && path.startsWith(basePath)) return path;

  return `${basePath}${path}`;
}
