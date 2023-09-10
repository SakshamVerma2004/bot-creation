const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.get('/fetch-wikipedia', async (req, res) => {
  const url = req.query.url;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(3000, () => {
  console.log('Proxy server is running on port 3001');
});
