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
      // Forzar respuesta sin compresión para manipular el texto sin errores
      proxyReq.setHeader('Accept-Encoding', 'identity');
    },
    proxyRes: (proxyRes, req, res) => {
      let body = [];
      proxyRes.on('data', (chunk) => body.push(chunk));
      proxyRes.on('end', () => {
        let buffer = Buffer.concat(body);
        let responseStr = buffer.toString('utf8');

        // Limpiar referencias estrictas de dominio
        responseStr = responseStr.replace(/https:\/\/([a-zA-Z0-9-]+\.)*tiktok\.com/g, '');
        responseStr = responseStr.replace(/https:\/\/([a-zA-Z0-9-]+\.)*tiktokcdn\.com/g, '');

        const headers = { ...proxyRes.headers };
        delete headers['content-encoding'];
        delete headers['content-length'];

        res.writeHead(proxyRes.statusCode, headers);
        res.end(responseStr);
      });
    }
  }
}));

app.listen(PORT, () => {
  console.log(`Proxy optimizado activo en puerto ${PORT}`);
});
