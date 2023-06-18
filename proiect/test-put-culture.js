const http = require('http');

const data = JSON.stringify({
  email: 'maria@gmail.com',
  culture_name: 'Heather',
  soil_moisture: 30,
  ambient_temperature: 25,
  image_url: ['https://example.com/tomato.jpg'],
  culture_type: 'Heather',
  price: 3,
  status: 'Ready',
  availability: true,
  description: 'Daffodils are incredibly versatile and can be planted in borders, beds, or containers, and make lovely cut flowers for floral arrangements. Their hardiness and long blooming season make them an excellent choice for both gardeners and flower enthusiasts alike.',
});


const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/culture',
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
