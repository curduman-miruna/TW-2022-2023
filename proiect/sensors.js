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
    console.log(`Analyzing image: ${url}`);

    // Check if the image is in a supported format (PNG)
    if (image.getMIME() !== 'image/png') {
      console.log(`Skipping analysis for image with unsupported format: ${url}`);
      return { brownPercentage: 0, greenPercentage: 0 };
    }

    const width = image.getWidth();
    const height = image.getHeight();

    let brownPixels = 0;
    let greenPixels = 0;

    // Define color ranges for brown and green
    const brownRange = { min: { r: 100, g: 80, b: 0 }, max: { r: 180, g: 150, b: 100 } };
    const greenRange = { min: { r: 0, g: 120, b: 0 }, max: { r: 100, g: 220, b: 100 } };

    image.scan(0, 0, width, height, (x, y, idx) => {
      const red = image.bitmap.data[idx];
      const green = image.bitmap.data[idx + 1];
      const blue = image.bitmap.data[idx + 2];

      if (isColorInRange(red, green, blue, brownRange)) {
        // Brown pixel
        brownPixels++;
      } else if (isColorInRange(red, green, blue, greenRange)) {
        // Green pixel
        greenPixels++;
      }
    });

    const totalPixels = width * height;
    const brownPercentage = (brownPixels / totalPixels) * 100;
    const greenPercentage = (greenPixels / totalPixels) * 100;

    return { brownPercentage, greenPercentage };
  } catch (error) {
    console.error('Error analyzing image', error);
    return { brownPercentage: 50, greenPercentage: 30 };
  }
}

function isColorInRange(red, green, blue, colorRange) {
  const { min, max } = colorRange;
  return (
    red >= min.r && red <= max.r &&
    green >= min.g && green <= max.g &&
    blue >= min.b && blue <= max.b
  );
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

      const imageUrl = `https://raw.githubusercontent.com/curduman-miruna/TW-2022-2023/main/proiect/Culture_Photos/${culture_type}${getRandomInt(1, 3)}.png`;

      const { brownPercentage, greenPercentage } = await analyzeImage(imageUrl);
      const updatedImageUrlArray = [imageUrl]; // Wrap the URL in an array
      await client.query('UPDATE public.cultures SET image_url = $1 WHERE id = $2', [updatedImageUrlArray, id]);
      if (brownPercentage < 10 && greenPercentage < 20) {
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
const twoDaysInMilliseconds = 5 * 1000;
setInterval(updateCultureData, twoDaysInMilliseconds);
