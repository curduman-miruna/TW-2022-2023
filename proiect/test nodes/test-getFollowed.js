const http = require('http');

const userEmail = 'miruna@test.com'; // Provide the user email for testing

const options = {
  hostname: 'localhost',
  port: 8080,
  path: `/userFollowed?user_email=${encodeURIComponent(userEmail)}`,
  method: 'GET',
};

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
