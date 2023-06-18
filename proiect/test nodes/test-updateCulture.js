const http = require('http');

const data = JSON.stringify({
  id: 1,
  culture_name: 'Updated Culture',
  price: 5,
  status: 'In Progress',
  description: 'Updated description of the culture',
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/culture/edit',
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
