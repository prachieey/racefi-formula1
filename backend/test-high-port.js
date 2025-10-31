import express from 'express';

const app = express();
const PORT = 9999; // Using a high port number

app.get('/', (req, res) => {
  res.send('High port test server is running!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});
