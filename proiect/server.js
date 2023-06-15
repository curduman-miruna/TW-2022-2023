const http = require('http');
const url = require('url');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Gardening_database',
  password: 'tgbml',
});

// Function to generate the token
function generateToken(user) {
  const { id, email, role } = user;
  const secretKey = crypto.randomBytes(32).toString('hex');
  const token = jwt.sign({ id, email, role }, secretKey);
  return token;
}

const server = http.createServer(async (req, res) => {
  // Set CORS headers
  cors()(req, res, async () => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (req.method === 'POST' && pathname === '/login') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const { email, password } = JSON.parse(body);

          const client = await pool.connect();
          const result = await client.query('SELECT * FROM public.users WHERE email = $1 AND password = $2 AND role = $3', [email, password, 'client']);

          client.release();

          if (result.rowCount === 1) {
            // Successful login
            const user = result.rows[0]; // Assuming you have the user data in result.rows[0]
            const token = generateToken(user);

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, token }));
          } else {
            const result2 = await client.query('SELECT * FROM public.users WHERE email = $1 AND password = $2 AND role = $3', [email, password, 'admin']);
            if (result2.rowCount === 1) {
              // Redirect to admin page
              const user = result2.rows[0]; // Assuming you have the admin user data in result2.rows[0]
              const token = generateToken(user);

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, isAdmin: true, token }));
            } else {
              // Incorrect credentials
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: false }));
            }
          }
        } catch (error) {
          console.error('Error executing query', error);
          res.statusCode = 500;
          res.end();
        }
      });
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});
