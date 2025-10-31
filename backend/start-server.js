import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
const envPath = path.join(process.cwd(), '.env');
console.log('Loading environment variables from:', envPath);

dotenv.config({ path: envPath });

// Log environment variables for debugging
console.log('Environment Variables:');
console.log('- MONGODB_URI:', process.env.MONGODB_URI);
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '***' : 'Not set');
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL);

// Set default port if not specified
if (!process.env.PORT) {
  process.env.PORT = 6000;
  console.log('No PORT specified, using default:', process.env.PORT);
}

// Debug: Log current working directory and environment
console.log('Current working directory:', process.cwd());
console.log('NODE_PATH:', process.env.NODE_PATH);

// Import the main app after environment variables are loaded
import('./src/index.js').catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
