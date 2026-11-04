const APEX = 'sheersuperfood.com';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();
    if (host === `www.${APEX}`) {
      url.hostname = APEX;
      return Response.redirect(url.toString(), 301);
    }
    const leaf = url.pathname.split('/').pop() || '';
    if (url.pathname !== '/' && !url.pathname.endsWith('/') && !/\.[a-z0-9]{1,8}$/i.test(leaf)) {
      url.pathname = `${url.pathname}/`;
      return Response.redirect(url.toString(), 308);
    }
    return env.ASSETS.fetch(request);
  },
};
