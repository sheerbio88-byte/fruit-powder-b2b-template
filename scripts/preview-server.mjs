/**
 * Local static preview for dist/.
 *
 * `astro preview` removes user Vite plugins, then answers an extensionless URL
 * without a trailing slash with its own 404 before the built page or 404.html.
 * This server matches the worker: 308 those URLs to the slash form, serve the
 * page when it exists, and serve dist/404.html when it does not.
 *
 *   npm run preview -- --host 127.0.0.1 --port 4322
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../dist', import.meta.url)));

function flag(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1];
  const hit = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : fallback;
}

const host = flag('--host', '127.0.0.1');
const port = Number(flag('--port', '4321'));

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.map': 'application/json; charset=utf-8',
};

function fileFor(pathname) {
  let decoded = '/';
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const relative = decoded.replace(/^[/\\]+/, '');
  const full = normalize(resolve(root, relative));
  if (full !== root && !full.startsWith(root + sep)) return null;
  return full;
}

function send(res, method, file, status) {
  res.writeHead(status, {
    'Content-Type': types[extname(file).toLowerCase()] || 'application/octet-stream',
  });
  if (method === 'HEAD') {
    res.end();
    return;
  }
  createReadStream(file).pipe(res);
}

function sendMissing(res, method) {
  const file = join(root, '404.html');
  if (existsSync(file)) {
    send(res, method, file, 404);
    return;
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}

if (!existsSync(join(root, 'index.html'))) {
  console.error('dist/index.html is missing. Run npm run build first.');
  process.exit(1);
}

const server = createServer((req, res) => {
  const method = req.method || 'GET';
  let url;
  try {
    url = new URL(req.url || '/', 'http://127.0.0.1');
  } catch {
    sendMissing(res, method);
    return;
  }
  const { pathname, search } = url;
  const leaf = pathname.split('/').pop() || '';
  if (
    pathname !== '/' &&
    !pathname.endsWith('/') &&
    !pathname.startsWith('/_') &&
    !pathname.startsWith('/@') &&
    !/\.[a-z0-9]{1,8}$/i.test(leaf)
  ) {
    res.writeHead(308, { Location: `${pathname}/${search}` });
    res.end();
    return;
  }

  const file = fileFor(pathname);
  if (!file) {
    sendMissing(res, method);
    return;
  }
  if (existsSync(file) && statSync(file).isFile()) {
    send(res, method, file, 200);
    return;
  }
  if (pathname.endsWith('/')) {
    const index = join(file, 'index.html');
    if (existsSync(index)) {
      send(res, method, index, 200);
      return;
    }
  }
  sendMissing(res, method);
});

server.listen(port, host, () => {
  console.log(`preview http://${host}:${port}/`);
});
