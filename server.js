const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', createProxyMiddleware({
  target: 'https://www.tiktok.com',
  changeOrigin: true,
  secure: false,
  autoRewrite: true,
  followRedirects: true,
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader('Origin', 'https://www.tiktok.com');
    },
    proxyRes: (proxyRes) => {
      if (proxyRes.headers['location']) {
        proxyRes.headers['location'] = proxyRes.headers['location'].replace('https://www.tiktok.com', '');
      }
    }
  }
}));

app.listen(PORT, () => {
  console.log(`Proxy activo en puerto ${PORT}`);
});
