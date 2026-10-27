const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', createProxyMiddleware({
  target: 'https://www.tiktok.com',
  changeOrigin: true,
  secure: false,
  selfHandleResponse: true,
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader('Host', 'www.tiktok.com');
      proxyReq.setHeader('Origin', 'https://www.tiktok.com');
    },
    proxyRes: (proxyRes, req, res) => {
      let body = [];
      proxyRes.on('data', (chunk) => body.push(chunk));
      proxyRes.on('end', () => {
        let buffer = Buffer.concat(body);
        let responseStr = buffer.toString('utf8');

        // Limpiar referencias estrictas de dominio para forzar rutas relativas
        responseStr = responseStr.replace(/https:\/\/([a-zA-Z0-9-]+\.)*tiktok\.com/g, '');
        responseStr = responseStr.replace(/https:\/\/([a-zA-Z0-9-]+\.)*tiktokcdn\.com/g, '');

        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        res.end(responseStr);
      });
    }
  }
}));

app.listen(PORT, () => {
  console.log(`Proxy avanzado activo en puerto ${PORT}`);
});
