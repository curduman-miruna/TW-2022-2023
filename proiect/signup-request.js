const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/signup',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
};

const data = JSON.stringify({
  email: 'maria@gmail.com',
  password: 'maria',
  name: 'maria',
  username: 'maria',
});

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
