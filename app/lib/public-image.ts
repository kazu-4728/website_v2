export function withPublicBasePath(src: string): string {
  if (!src.startsWith('/')) return src;

  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
  if (!basePath || src === basePath || src.startsWith(`${basePath}/`)) return src;

  return `${basePath}${src}`;
}
