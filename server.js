const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const PORT = process.env.PORT || 3000;
const proxy = httpProxy.createProxyServer({
  target: 'https://www.tiktok.com',
  changeOrigin: true,
  secure: false,
  xfwd: true
});

// Interceptar y redirigir todo el tráfico manteniendo las cabeceras
app.use((req, res) => {
  req.headers.host = 'www.tiktok.com';
  proxy.web(req, res, {}, (err) => {
    if (err) {
      res.status(500).send('Error en el proxy');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Proxy web activo en puerto ${PORT}`);
});
