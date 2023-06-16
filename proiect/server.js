const http = require('http');
const url = require('url');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

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
    //Endpoint pentru login
    if (req.method === 'POST' && pathname === '/login') {
      let body = '';
      //Prelucrearea json primit
      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const { email, password } = JSON.parse(body);

          const client = await pool.connect();
          const result = await client.query('SELECT * FROM public.users WHERE email = $1 AND role = $2', [email, 'client']);

          client.release();

          if (result.rowCount === 1) {
            // Successful login
            const user = result.rows[0];
            const hashedPassword = user.password;
            const isMatch = await bcrypt.compare(password, hashedPassword);

            if (isMatch) {
              const token = generateToken(user);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, token }));
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: false }));
            }
          } else {
            const result2 = await client.query('SELECT * FROM public.users WHERE email = $1 AND role = $2', [email, 'admin']);

            if (result2.rowCount === 1) {
              // Successful login as admin
              const user = result2.rows[0];
              const hashedPassword = user.password;
              const isMatch = await bcrypt.compare(password, hashedPassword);

              if (isMatch) {
                const token = generateToken(user);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, isAdmin: true, token }));
              } else {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ success: false }));
              }
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
      });} 
      //Endpoint pentru creare user
      else if (req.method === 'PUT' && pathname === '/signup') {
        let body = '';

        req.on('data', (chunk) => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const { email, password, name, username } = JSON.parse(body);
            const role = 'client';

            const client = await pool.connect();

            // Check if user with the same email already exists
            const existingUserResult = await client.query('SELECT * FROM public.users WHERE email = $1', [email]);

            if (existingUserResult.rowCount > 0) {
              // User with the same email already exists
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 409; // Conflict
              res.end(JSON.stringify({ success: false, message: 'User with the same email already exists' }));
            } else {
              // User with the same email does not exist, proceed with creating the user

              const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

              const result = await client.query(
                'INSERT INTO public.users (email, password, name, username, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [email, hashedPassword, name, username, role]
              );

              if (result.rowCount === 1) {
                const user = result.rows[0]; // Newly created user

                const token = generateToken(user);

                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, token }));
              } else {
                // Failed to create user
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false }));
              }
            }

            client.release();
          } catch (error) {
            console.error('Error executing query', error);
            res.statusCode = 500;
            res.end();
          }
        });
      } 
        //Endpoint pentru MyCultures sa afiseze cultuile userului
        else if (req.method === 'GET' && pathname === '/cultures') {
            try {
        const userEmail = parsedUrl.query.email;

        const client = await pool.connect();
        const userResult = await client.query('SELECT id FROM public.users WHERE email = $1', [userEmail]);

        if (userResult.rowCount === 1) {
          const userId = userResult.rows[0].id;

          const culturesResult = await client.query('SELECT * FROM public.cultures WHERE user_id = $1', [userId]);

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify(culturesResult.rows));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'User not found' }));
        }

        client.release();
      } catch (error) {
        console.error('Error executing query', error);
        res.statusCode = 500;
        res.end();
      }
    }
    //Enpoint adaugare cultura cand dam una noua
else if (req.method === 'PUT' && pathname === '/culture') {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { email, culture_name, soil_moisture, ambient_temperature, image_url, culture_type, price, status, availability, description } = JSON.parse(body);

      const client = await pool.connect();
      const userResult = await client.query('SELECT id FROM public.users WHERE email = $1', [email]);

      if (userResult.rowCount === 1) {
        const user_id = userResult.rows[0].id;

        const cultureResult = await client.query(
          'INSERT INTO public.cultures (user_id, culture_name, soil_moisture, ambient_temperature, image_url, culture_type, price, status, availability, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
          [user_id, culture_name, soil_moisture, ambient_temperature, image_url, culture_type, price, status, availability, description]
        );

        if (cultureResult.rowCount === 1) {
          const culture = cultureResult.rows[0];
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, culture }));
        } else {
          // Failed to insert culture
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, message: 'Failed to insert culture' }));
        }
      } else {
        // User not found
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, message: 'User not found' }));
      }

      client.release();
    } catch (error) {
      console.error('Error executing query', error);
      res.statusCode = 500;
      res.end();
    }
  });
}
// Endpoint editare user
else if (req.method === 'POST' && pathname === '/editUser') {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { email, username, name, password } = JSON.parse(body);

      const client = await pool.connect();

      // Retrieve the user from the database
      const userResult = await client.query('SELECT * FROM public.users WHERE email = $1', [email]);

      if (userResult.rowCount === 1) {
        const user = userResult.rows[0];
        const hashedPassword = user.password;

        let updatedPassword = hashedPassword;

        if (password && password !== hashedPassword) {
          // Password is provided and different from the one in the database, encrypt it
          const hashedNewPassword = await bcrypt.hash(password, 10);
          updatedPassword = hashedNewPassword;
        }

        const updateResult = await client.query(
          'UPDATE public.users SET username = $1, name = $2, password = $3 WHERE email = $4',
          [username, name, updatedPassword, email]
        );

        if (updateResult.rowCount === 1) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true }));
        } else {
          // Failed to update user
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, message: 'Failed to update user' }));
        }
      } else {
        // User not found
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, message: 'User not found' }));
      }

      client.release();
    } catch (error) {
      console.error('Error executing query', error);
      res.statusCode = 500;
      res.end();
    }
  });
}
//Endpoint delete user
else if (req.method === 'DELETE' && pathname === '/deleteUser') {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { email } = JSON.parse(body);

      const client = await pool.connect();

      // Delete the user from the database
      const deleteResult = await client.query('DELETE FROM public.users WHERE email = $1', [email]);

      if (deleteResult.rowCount === 1) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
      } else {
        // User not found
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, message: 'User not found' }));
      }

      client.release();
    } catch (error) {
      console.error('Error executing query', error);
      res.statusCode = 500;
      res.end();
    }
  });
}
//Endpoint pentru searchul de pe pagina buy
else if (req.method === 'GET' && pathname === '/buySearch') {
  try {
    const word = parsedUrl.query.word;
    const userEmail = parsedUrl.query.email;
    const limit = 10;

    const client = await pool.connect();
    const userResult = await client.query('SELECT id FROM public.users WHERE email = $1', [userEmail]);

    if (userResult.rowCount === 1) {
      const userId = userResult.rows[0].id;

      const culturesResult = await client.query(
        `SELECT * FROM public.cultures 
        WHERE LOWER(culture_name) LIKE LOWER($1) 
        AND user_id != $2 
        AND availability = true
        LIMIT $3`,
        [`%${word}%`, userId, limit]
      );

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(culturesResult.rows));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'User not found' }));
    }

    client.release();
  } catch (error) {
    console.error('Error executing query', error);
    res.statusCode = 500;
    res.end();
  }
}
//Endpoint pentru searchul de pe pagina my cultures
else if (req.method === 'GET' && pathname === '/searchMine') {
  try {
    const word = parsedUrl.query.word;
    const userEmail = parsedUrl.query.email;
    const limit = 10;

    const client = await pool.connect();
    const userResult = await client.query('SELECT id FROM public.users WHERE email = $1', [userEmail]);

    if (userResult.rowCount === 1) {
      const userId = userResult.rows[0].id;

      const culturesResult = await client.query(
        `SELECT * FROM public.cultures 
        WHERE LOWER(culture_name) LIKE LOWER($1) 
        AND user_id = $2 
        LIMIT $3`,
        [`%${word}%`, userId, limit]
      );

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(culturesResult.rows));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'User not found' }));
    }

    client.release();
  } catch (error) {
    console.error('Error executing query', error);
    res.statusCode = 500;
    res.end();
  }
}
//Endpoint pentru intoarcere followed of a user

    else {
      res.statusCode = 404;
      res.end();
    }
  });
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});
