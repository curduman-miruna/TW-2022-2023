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
  password: 'parola',
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
              console.log(user.name);
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
      });
    }
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
      const { email, culture_name, soil_moisture, ambient_temperature, image_url, culture_type, price, description } = JSON.parse(body);
      const status = 'in progress';
      const availability = false;

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

      // Get the user ID
      const userResult = await client.query('SELECT id FROM public.users WHERE email = $1', [email]);

      if (userResult.rowCount === 1) {
        const userId = userResult.rows[0].id;

        // Delete entries from user_cultures table first
        await client.query('DELETE FROM public.user_cultures WHERE user_id = $1', [userId]);

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
    } else if(req.method === 'GET' && pathname === '/users'){
      const emailAdmin='admin@admin.com';
      try{
        const client=await pool.connect();
        const usersResult=await client.query('SELECT * FROM public.users WHERE email !=$1',[emailAdmin]);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(usersResult.rows));
        client.release();
        console.log(usersResult.rowCount);
      }catch(error){
        console.error('Error executing query', error);
        res.statusCode = 500;
        res.end();
      }
    }
    else if (req.method === 'GET' && pathname === '/userInfo') {
  const { email } = url.parse(req.url, true).query;

  if (email !== null) {
    try {
      const client = await pool.connect();
      const userResult = await client.query('SELECT * FROM public.users WHERE email = $1', [email]);

      if (userResult.rowCount === 1) {
        const userInfo = userResult.rows[0];

        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(userInfo));
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'User not found' }));
      }

      client.release();
    } catch (error) {
      console.error('Error executing query', error);
      res.statusCode = 500;
      res.end();
    }
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'User not logged in' }));
  }
}


    //Endpoint pentru intoarcere followed of a user
else if (req.method === 'GET' && pathname === '/userFollowed') {
  try {
    const userEmail = parsedUrl.query.user_email;

    const client = await pool.connect();
    const userCulturesResult = await client.query('SELECT * FROM public.user_cultures WHERE user_email = $1', [userEmail]);

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(userCulturesResult.rows));

    client.release();
  } catch (error) {
    console.error('Error executing query', error);
    res.statusCode = 500;
    res.end();
  }
}
 //Endpoint pentru adaugare in user_cultures -> culturile la care a dat follow
else if (req.method === 'PUT' && pathname === '/addFollow') {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { user_email, culture_id, culture_name } = JSON.parse(body);

      const client = await pool.connect();
      const userResult = await client.query('SELECT id FROM public.users WHERE email = $1', [user_email]);

      if (userResult.rowCount === 1) {
        const user_id = userResult.rows[0].id;

        const userCultureResult = await client.query(
          'INSERT INTO public.user_cultures (user_id, user_email, culture_id, culture_name) VALUES ($1, $2, $3, $4) RETURNING *',
          [user_id, user_email, culture_id, culture_name]
        );

        if (userCultureResult.rowCount === 1) {
          const userCulture = userCultureResult.rows[0];

          // Increase the followers count of the culture
          await client.query(
            'UPDATE public.cultures SET followers = followers + 1 WHERE id = $1',
            [culture_id]
          );

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, userCulture }));
        } else {
          // Failed to insert user culture
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

//Endpoint for delete followed culture from preferencess
else if (req.method === 'DELETE' && pathname === '/deleteFollow') {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { user_email, culture_id, culture_name } = JSON.parse(body);

      const client = await pool.connect();

      const deleteResult = await client.query(
        'DELETE FROM public.user_cultures WHERE user_email = $1 AND culture_id = $2 AND culture_name = $3 RETURNING *',
        [user_email, culture_id, culture_name]
      );

      if (deleteResult.rowCount === 1) {
        const deletedEntry = deleteResult.rows[0];

        // Decrease the followers count of the culture
        await client.query(
          'UPDATE public.cultures SET followers = followers - 1 WHERE id = $1',
          [deletedEntry.culture_id]
        );

        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, message: 'Entry deleted' }));
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, message: 'Entry not found' }));
      }

      client.release();
    } catch (error) {
      console.error('Error executing query', error);
      res.statusCode = 500;
      res.end();
    }
  });
}

//Endpoint to get a culture, the info in the database
else if (req.method === 'GET' && pathname === '/culture') {
  const { id } = url.parse(req.url, true).query;

  const client = await pool.connect();
  const cultureResult = await client.query('SELECT * FROM public.cultures WHERE id = $1', [id]);

  if (cultureResult.rowCount === 1) {
    const culture = cultureResult.rows[0];
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ success: true, culture }));
  } else {
    // Culture not found
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: 'Culture not found' }));
  }

  client.release();
}

//Endpoint to delete a culture
else if (req.method === 'DELETE' && pathname === '/culture') {
  const { id } = url.parse(req.url, true).query;

  try {
    const client = await pool.connect();

    // Delete entries from user_cultures table first
    await client.query('DELETE FROM public.user_cultures WHERE culture_id = $1', [id]);

    // Delete the culture from cultures table
    const deleteResult = await client.query('DELETE FROM public.cultures WHERE id = $1', [id]);

    if (deleteResult.rowCount === 1) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, message: 'Culture deleted successfully' }));
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 404;
      res.end(JSON.stringify({ success: false, message: 'Culture not found' }));
    }

    client.release();
  } catch (error) {
    console.error('Error executing query', error);
    res.statusCode = 500;
    res.end();
  }
}


//endpoint to update a culture
else if (req.method === 'POST' && pathname === '/culture/edit') {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { id, culture_name, price, description } = JSON.parse(body);

      const client = await pool.connect();

      const cultureResult = await client.query(
        'UPDATE public.cultures SET culture_name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *',
        [culture_name, price, description, id]
      );

      if (cultureResult.rowCount === 1) {
        const culture = cultureResult.rows[0];
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, culture }));
      } else {
        // Failed to update culture
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ success: false, message: 'Failed to update culture' }));
      }

      client.release();
    } catch (error) {
      console.error('Error executing query', error);
      res.statusCode = 500;
      res.end();
    }
  });
}


//Endpoint pentru schimbare availability in false daca cineva cumpara
else if (req.method === 'POST' && pathname === '/changeAvailabilityFalse') {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { id, email } = JSON.parse(body);

      const client = await pool.connect();
      const result = await client.query('UPDATE public.cultures SET availability = false, buyer = $1 WHERE id = $2', [email, id]);

      if (result.rowCount === 1) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, message: 'Culture not found' }));
      }

      client.release();
    } catch (error) {
      console.error('Error executing query', error);
      res.statusCode = 500;
      res.end();
    }
  });
}


// Change Availability
else if (req.method === 'POST' && pathname === '/changeAvailabilityTrue') {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { id } = JSON.parse(body);

      const client = await pool.connect();
      const result = await client.query('UPDATE public.cultures SET availability = true WHERE id = $1', [id]);

      if (result.rowCount === 1) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, message: 'Culture not found' }));
      }

      client.release();
    } catch (error) {
      console.error('Error executing query', error);
      res.statusCode = 500;
      res.end();
    }
  });
}

// Endpoint GetCultureTipis
else if (req.method === 'GET' && pathname === '/MyCulture') {
  const { id } = url.parse(req.url, true).query;

  const client = await pool.connect();

  // Fetch the culture details
  const cultureResult = await client.query('SELECT * FROM public.cultures WHERE id = $1', [id]);

  if (cultureResult.rowCount === 1) {
    const culture = cultureResult.rows[0];

    // Fetch the optimal conditions for the culture type
    const optimConditionsResult = await client.query('SELECT * FROM public.optim_conditions WHERE culture_type = $1', [culture.culture_type]);

    if (optimConditionsResult.rowCount === 1) {
      const optimConditions = optimConditionsResult.rows[0];
      const optimalSoilMoisture = optimConditions.soil_moisture;
      const optimalAmbientTemperature = optimConditions.ambient_temperature;

      const soilMoistureDiff = culture.soil_moisture - optimalSoilMoisture;
      const temperatureDiff = culture.ambient_temperature - optimalAmbientTemperature;

      const isSoilMoistureInRange = Math.abs(soilMoistureDiff) <= 2;
      const isAmbientTemperatureInRange = Math.abs(temperatureDiff) <= 2;

      let tips = [];

      if (!isSoilMoistureInRange) {
        let moistureTip;
        if (soilMoistureDiff < 0) {
          moistureTip = `Soil moisture is lower than optimal. Increase watering frequency to achieve the recommended range: ${optimalSoilMoisture - 2} - ${optimalSoilMoisture + 2}.`;
        } else {
          moistureTip = `Soil moisture is higher than optimal. Reduce watering frequency to achieve the recommended range: ${optimalSoilMoisture - 2} - ${optimalSoilMoisture + 2}.`;
        }
        tips.push(moistureTip);
      }

      if (!isAmbientTemperatureInRange) {
        let temperatureTip;
        if (temperatureDiff < 0) {
          temperatureTip = `Ambient temperature is lower than optimal. Provide additional heating to maintain the recommended range: ${optimalAmbientTemperature - 2} - ${optimalAmbientTemperature + 2}.`;
        } else {
          temperatureTip = `Ambient temperature is higher than optimal. Provide additional cooling to maintain the recommended range: ${optimalAmbientTemperature - 2} - ${optimalAmbientTemperature + 2}.`;
        }
        tips.push(temperatureTip);
      }

      if (isSoilMoistureInRange && isAmbientTemperatureInRange) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        tips = ["Optimal Soil Moisture", "Optimal Ambiental Temperature"];
        res.end(JSON.stringify({ success: true, culture, tips }));
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, culture, tips }));
      }
    } else {
      // Optimal conditions not found
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 404;
      res.end(JSON.stringify({ success: false, message: 'Optimal conditions not found for the culture type' }));
    }
  } else {
    // Culture not found
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: 'Culture not found' }));
  }

  client.release();
}

// Get all Cultures that are available and the user is not the same

else if (req.method === 'GET' && pathname === '/buyPage') {
  try {
    const userEmail = parsedUrl.query.email;
    const limit = 30;

    const client = await pool.connect();
    const userResult = await client.query('SELECT id FROM public.users WHERE email = $1', [userEmail]);

    if (userResult.rowCount === 1) {
      const userId = userResult.rows[0].id;

      const culturesResult = await client.query(
        `SELECT * FROM public.cultures 
        WHERE user_id != $1 
        AND availability = true
        LIMIT $2`,
        [userId, limit]
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

    else {
      res.statusCode = 404;
      res.end();
    }
  });
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});
