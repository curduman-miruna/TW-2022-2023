const http = require('http');

const data = JSON.stringify({
  id: 2, // Provide the ID of the culture to update
  email: 'example@example.com' // Provide the email to assign as the buyer
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/changeAvailability',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
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

req.write(data);
req.end();
