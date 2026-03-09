import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import process from 'process';

const port = Number(process.env.PORT ?? 3000);
const basePath = '/website_v2';
const outDir = path.join(process.cwd(), 'out');

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.mjs', 'application/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

function resolveFilePath(urlPath) {
  if (urlPath === '/') {
    return { redirect: `${basePath}/` };
  }

  if (!urlPath.startsWith(basePath)) {
    return { notFound: true };
  }

  const relativePath = decodeURIComponent(urlPath.slice(basePath.length) || '/');
  const normalized = relativePath.replace(/^\/+/, '');

  if (!normalized) {
    return path.join(outDir, 'index.html');
  }

  return path.join(outDir, normalized);
}

async function getExistingPath(filePath) {
  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      return path.join(filePath, 'index.html');
    }
    return filePath;
  } catch {
    const htmlCandidate = `${filePath}.html`;
    try {
      await stat(htmlCandidate);
      return htmlCandidate;
    } catch {
      return path.join(outDir, '404.html');
    }
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? '127.0.0.1'}`);
  const resolved = resolveFilePath(url.pathname);

  if (typeof resolved === 'object' && 'redirect' in resolved) {
    res.writeHead(302, { Location: resolved.redirect });
    res.end();
    return;
  }

  if (typeof resolved === 'object' && 'notFound' in resolved) {
    send(res, 404, 'Not Found');
    return;
  }

  try {
    const existingPath = await getExistingPath(resolved);
    const contents = await readFile(existingPath);
    const ext = path.extname(existingPath).toLowerCase();
    const mimeType = mimeTypes.get(ext) ?? 'application/octet-stream';
    const status = existingPath.endsWith('404.html') ? 404 : 200;
    res.writeHead(status, { 'Content-Type': mimeType, 'Cache-Control': 'no-cache' });
    res.end(contents);
  } catch (error) {
    send(res, 500, `Preview server error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Preview ready: http://127.0.0.1:${port}${basePath}/`);
});
