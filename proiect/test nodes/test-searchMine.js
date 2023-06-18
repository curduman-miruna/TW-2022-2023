const http = require('http');

// Constants
const hostname = 'localhost';
const port = 8080;

// Request data for buySearch endpoint
const buySearchOptions = {
  hostname,
  port,
  path: '/buySearch?word=example&email=user@example.com', // Replace with the desired word and email
  method: 'GET',
};

// Request data for searchMine endpoint
const searchMineOptions = {
  hostname,
  port,
  path: '/searchMine?word=culture&email=miruna@test.com', // Replace with the desired word and email
  method: 'GET',
};

// Function to perform the request and log the response
function performRequest(options) {
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

  req.end();
}


// Perform searchMine request
console.log('Performing searchMine request...');
performRequest(searchMineOptions);
