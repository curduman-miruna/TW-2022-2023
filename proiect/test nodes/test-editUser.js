const http = require('http');

const data = JSON.stringify({
  email: 'admin@admin.com',
  username: 'admin',
  name: 'admin',
  password: 'admin',
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/editUser',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
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
