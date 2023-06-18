const http = require('http');

const data = JSON.stringify({
  user_email: 'bianca.curduman@gmail.com',
  culture_id: 2,
  culture_name: 'Tomato'
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/deleteFollow',
  method: 'DELETE',
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
