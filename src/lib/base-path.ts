function inferBasePath(): string {
  if (typeof window !== 'undefined') {
    const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
    return firstSegment ? `/${firstSegment}` : '';
  }

  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }

  return process.env.NODE_ENV === 'production' ? '/website_v2' : '';
}

export function withBasePath(path: string): string {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const basePath = inferBasePath();
  if (basePath && path.startsWith(basePath)) return path;

  return `${basePath}${path}`;
}