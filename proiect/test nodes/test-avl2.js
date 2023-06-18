const http = require('http');

const data = JSON.stringify({id: 7, email:"aaa"});

// Change Availability to true
const options2 = {
  hostname: 'localhost',
  port: 8080,
  path: '/changeAvailabilityFalse',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

const req2 = http.request(options2, (res) => {
  console.log(`Status Code: ${res.statusCode}`);

  res.on('data', (chunk) => {
    console.log(`Response: ${chunk}`);
  });
});

req2.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

req2.write(data);
req2.end();
