const { Pool } = require('pg');
const Vibrant = require('node-vibrant');
const Jimp = require('jimp');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Gardening_database',
  password: 'parola',
});

async function analyzeImage(url) {
  try {
    const image = await Jimp.read(url);

    // Check if the image is in a supported format (JPEG, PNG, GIF)
    const supportedFormats = ['image/jpeg', 'image/png', 'image/gif'];
    if (!supportedFormats.includes(image.getMIME())) {
      console.log(`Skipping analysis for image with unsupported format: ${url}`);
      return { brownPercentage: 0, greenPercentage: 0 };
    }

    const convertedImage = await image.getBufferAsync(Jimp.MIME_JPEG);

    const palette = await Vibrant.from(convertedImage).getPalette();
    const brownColor = palette.Vibrant._rgb;
    const greenColor = palette.DarkVibrant._rgb;

    const totalPixels = palette.Vibrant._population + palette.DarkVibrant._population;
    const brownPercentage = (palette.Vibrant._population / totalPixels) * 100;
    const greenPercentage = (palette.DarkVibrant._population / totalPixels) * 100;

    return { brownPercentage, greenPercentage };
  } catch (error) {
    console.error('Error analyzing image', error);
    return { brownPercentage: 0, greenPercentage: 0 };
  }
}


async function updateCultureData() {
  try {
    const client = await pool.connect();

    const culturesResult = await client.query('SELECT * FROM public.cultures');

    const cultures = culturesResult.rows;

    for (const culture of cultures) {
      const { id, soil_moisture, ambient_temperature, culture_type, image_url } = culture;

      const newSoilMoisture = soil_moisture + getRandomInt(-3, 3);
      const newAmbientTemperature = ambient_temperature + getRandomInt(-3, 3);

      await client.query(
        'UPDATE public.cultures SET soil_moisture = $1, ambient_temperature = $2 WHERE id = $3',
        [newSoilMoisture, newAmbientTemperature, id]
      );

      const imageUrl = `https://raw.githubusercontent.com/curduman-miruna/TW-2022-2023/main/proiect/Culture_Photos/${culture_type}${getRandomInt(1, 3)}.jpeg`;

      const { brownPercentage, greenPercentage } = await analyzeImage(imageUrl);
      const updatedImageUrlArray = [imageUrl]; // Wrap the URL in an array
      await client.query('UPDATE public.cultures SET image_url = $1 WHERE id = $2', [updatedImageUrlArray, id]);
      if (brownPercentage < 15 && greenPercentage < 40) {
        await client.query('UPDATE public.cultures SET status = $1 WHERE id = $2', ['Ready', id]);
        console.log(`Status updated for culture ID ${id}`);
      } else {
        await client.query('UPDATE public.cultures SET status = $1 WHERE id = $2', ['In Progress', id]);
        console.log(`Color composition does not meet the thresholds for culture ID ${id}`);
      }
    }

    client.release();
  } catch (error) {
    console.error('Error executing query', error);
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Run the update every 2 days
const twoDaysInMilliseconds = 10 * 1000;
setInterval(updateCultureData, twoDaysInMilliseconds);
