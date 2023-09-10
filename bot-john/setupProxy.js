let { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://en.wikipedia.org',
      changeOrigin: true,
      secure: false,
    })
  );
};