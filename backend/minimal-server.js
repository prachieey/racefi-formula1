import express from 'express';

const app = express();
const PORT = 5002;

app.get('/', (req, res) => {
  res.send('Minimal test server is running!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Minimal test server running on http://localhost:${PORT}`);
});
