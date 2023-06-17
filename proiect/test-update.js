const http = require('http');

// Request body
const requestBody = JSON.stringify({
  id: 3,
  culture_name: 'Updated Culture Name',
  price: 9,
  description: 'Updated culture description',
});

// Request options
const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/culture/edit',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': requestBody.length,
  },
};

// Send the HTTP request
const request = http.request(options, (response) => {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    console.log('Response:', data);
  });
});

request.on('error', (error) => {
  console.error('Error:', error);
});

// Send the request body
request.write(requestBody);
request.end();
