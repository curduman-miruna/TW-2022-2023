const http = require('http');

const data = JSON.stringify({
  user_email: 'bianca.curduman@gmail.com',
  culture_id: 2,
  culture_name: 'culture 2'
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/addCulture',
  method: 'PUT',
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
