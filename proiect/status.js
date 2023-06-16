const { Pool } = require('pg');
const Vibrant = require('node-vibrant');

// Database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Gardening_database',
  password: 'parola',
});

async function updateStatus(cultureId, imageUrl) {
  try {
    const { brownPercentage, greenPercentage } = await analyzeImage(imageUrl);

    // Check color thresholds
    if (brownPercentage < 15 && greenPercentage < 30) {
      const client = await pool.connect();
      const query = 'UPDATE public.cultures SET status = $1 WHERE id = $2';
      const values = ['Ready', cultureId];

      await client.query(query, values);
      client.release();

      console.log(`Status updated for culture ID ${cultureId}`);
    } else {
      console.log(`Color composition does not meet the thresholds for culture ID ${cultureId}`);
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
}

// Function to periodically check image URLs for all cultures
async function checkImageUrls() {
  try {
    const client = await pool.connect();
    const query = 'SELECT id, unnest(image_url) AS url FROM public.cultures';
    const result = await client.query(query);
    client.release();

    const rows = result.rows;

    for (const row of rows) {
      const cultureId = row.id;
      const imageUrl = row.url;
      await updateStatus(cultureId, imageUrl);
    }
  } catch (error) {
    console.error('Error checking image URLs:', error);
  }
}

// Run the checkImageUrls function every 20 seconds
setInterval(checkImageUrls, 20000);
