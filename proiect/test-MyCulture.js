const http = require('http');

const cultureId = 2; // Specify the culture ID to retrieve

const options = {
  hostname: 'localhost',
  port: 8080,
  path: `/MyCulture?id=${cultureId}`,
  method: 'GET',
};
const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Response Headers:', res.headers);

  res.on('data', (data) => {
    const response = JSON.parse(data);
    console.log('Response Body:', response);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
