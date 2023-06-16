const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Gardening_database',
  password: 'parola',
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function updateCultureData() {
  try {
    const client = await pool.connect();

    const culturesResult = await client.query('SELECT * FROM public.cultures');

    const cultures = culturesResult.rows;

    for (const culture of cultures) {
      const { id, soil_moisture, ambient_temperature } = culture;

      const newSoilMoisture = soil_moisture + getRandomInt(-3, 3);
      const newAmbientTemperature = ambient_temperature + getRandomInt(-3, 3);

      await client.query(
        'UPDATE public.cultures SET soil_moisture = $1, ambient_temperature = $2 WHERE id = $3',
        [newSoilMoisture, newAmbientTemperature, id]
      );
    }

    client.release();
  } catch (error) {
    console.error('Error executing query', error);
  }
}

const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;
const oneMinutInMiliseconds = 60 * 1000;
setInterval(updateCultureData, oneMinutInMiliseconds); // Run the update every 2 days
