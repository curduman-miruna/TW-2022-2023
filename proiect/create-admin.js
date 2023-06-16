const http = require('http');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Gardening_database',
  password: 'tgbml',
});

const createAdmin = async () => {
  const email = 'admin@admin.com';
  const password = 'admin';
  const name = 'Admin User';
  const username = 'admin';
  const role = 'admin';

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO public.users (email, password, name, username, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, hashedPassword, name, username, role]
    );

    client.release();

    if (result.rowCount === 1) {
      console.log('Admin user created successfully');
    } else {
      console.error('Failed to create admin user');
    }
  } catch (error) {
    console.error('Error executing query', error);
  }
};

createAdmin();
