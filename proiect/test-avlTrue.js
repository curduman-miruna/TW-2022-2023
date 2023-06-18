const http = require('http');

const postData = JSON.stringify({ id: 4 }); // Set the culture ID you want to update

const options = {
  hostname: 'localhost', // Replace with your server hostname
  port: 8080, // Replace with your server port
  path: '/changeAvailabilityTrue',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(postData);
req.end();
