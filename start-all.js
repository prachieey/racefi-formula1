import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const backendPath = join(__dirname, 'backend');
const frontendPath = join(__dirname, 'frontend');

// Start the backend server
const backend = exec('node start-server.js', { cwd: backendPath });
backend.stdout.on('data', (data) => {
  console.log(`[Backend] ${data}`);
});
backend.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data}`);
});

// Start the frontend server
const frontend = exec('npm start', { cwd: frontendPath });
frontend.stdout.on('data', (data) => {
  console.log(`[Frontend] ${data}`);
});
frontend.stderr.on('data', (data) => {
  console.error(`[Frontend Error] ${data}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});
