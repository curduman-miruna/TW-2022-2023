const http = require('http');

const cultureId = 1; // Specify the culture ID to retrieve

const options = {
  hostname: 'localhost',
  port: 8080,
  path: `/culture?id=${cultureId}`,
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
