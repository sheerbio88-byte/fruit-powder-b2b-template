import type { Connect, Plugin, PreviewServer, ViteDevServer } from 'vite';

function redirectTrailingSlash(req: Connect.IncomingMessage, res: Connect.ServerResponse, next: Connect.NextFunction) {
  const raw = req.url || '/';
  const queryAt = raw.indexOf('?');
  const path = queryAt === -1 ? raw : raw.slice(0, queryAt);
  const search = queryAt === -1 ? '' : raw.slice(queryAt);
  const leaf = path.split('/').pop() || '';
  if (
    path !== '/' &&
    !path.endsWith('/') &&
    !path.startsWith('/@') &&
    !path.startsWith('/_') &&
    !/\.[a-z0-9]{1,8}$/i.test(leaf)
  ) {
    res.statusCode = 308;
    res.setHeader('Location', `${path}/${search}`);
    res.end();
    return;
  }
  next();
}

function install(server: ViteDevServer | PreviewServer) {
  const stack = server.middlewares.stack;
  const index = stack.findIndex((layer) => layer.handle === redirectTrailingSlash);
  if (index === 0) return;
  if (index > 0) stack.splice(index, 1);
  stack.unshift({ route: '', handle: redirectTrailingSlash });
}

/**
 * Dev server only. `astro preview` drops user Vite plugins and still returns
 * its own trailing-slash 404, so `npm run preview` uses scripts/preview-server.mjs.
 */
export function trailingSlashRedirect(): Plugin {
  return {
    name: 'ssf-trailing-slash-redirect',
    configureServer(server) {
      return () => {
        install(server);
        queueMicrotask(() => install(server));
      };
    },
    configurePreviewServer(server) {
      return () => {
        install(server);
        queueMicrotask(() => install(server));
      };
    },
  };
}
