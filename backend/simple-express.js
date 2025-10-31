import express from 'express';
const app = express();
const PORT = 7000; // Using a high port number

app.get('/', (req, res) => {
  res.send('Simple Express server is running!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});
