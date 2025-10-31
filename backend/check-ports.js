import net from 'net';

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(false);
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port, '0.0.0.0');
  });
}

// Check common ports
async function checkPorts() {
  const ports = [3000, 3001, 3002, 4000, 5000, 5001, 5002, 5003, 8000, 8080, 8888, 9999];
  console.log('Checking available ports...');
  
  for (const port of ports) {
    const available = await isPortAvailable(port);
    console.log(`Port ${port}: ${available ? '✅ Available' : '❌ In Use'}`);
  }
}

checkPorts().catch(console.error);
