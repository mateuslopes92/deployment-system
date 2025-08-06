const express = require('express');
const client = require('prom-client');
const app = express();
const register = new client.Registry();

client.collectDefaultMetrics({ register });

app.get('/', (req, res) => {
  res.send('Hello from Kubernetes!');
});

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
