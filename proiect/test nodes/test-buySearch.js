const http = require('http');
const url = require('url');

// Test data
const word = 'Culture';
const email = 'admin@admin.com'; // Replace with the user's email for testing

// Request options
const options = {
  hostname: 'localhost',
  port: 8080,
  path: `/buySearch?word=${encodeURIComponent(word)}&email=${encodeURIComponent(email)}`,
  method: 'GET',
};

// Make the request
const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`Response Body: ${chunk}`);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
