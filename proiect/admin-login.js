const http = require('http');

// Constants
const hostname = 'localhost';
const port = 8080;

// Admin login request data
const adminLoginOptions = {
  hostname,
  port,
  path: '/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const adminLoginPayload = JSON.stringify({
  email: 'admin@admin.com', // Replace with the admin email for testing
  password: 'admin', // Replace with the corresponding password for the admin
});

// Admin login function
function adminLogin() {
  const req = http.request(adminLoginOptions, (res) => {
    console.log('Logging in as admin...');
    console.log(`Status Code: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`Response Body: ${chunk}`);
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.write(adminLoginPayload);
  req.end();
}

// Start the process
adminLogin();
