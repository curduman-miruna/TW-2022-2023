const nodemailer = require('nodemailer');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Gardening_database',
  password: 'parola',
});

// Create a transporter object using the SMTP transport
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "b9fca5aa0fe45d",
    pass: "5759039b77c7ef"
  }
});


// Function to send an email
function sendEmail(retrive, subject2, text2) {
  const mailOptions = {
    from: 'webgardeningapp@gmail.com',
    to: retrive,
    subject: subject2,
    text: text2,
  };

  transport.sendMail(mailOptions, (error, info) => { // Update from transporter to transport
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}



// Check for cultures with status "Ready"
async function checkReadyCultures() {
  try {
    const client = await pool.connect();

    const readyCulturesResult = await client.query(
      'SELECT * FROM public.cultures WHERE status = $1',
      ['Ready']
    );

    const readyCultures = readyCulturesResult.rows;

    for (const culture of readyCultures) {
      const { id, culture_name } = culture;
      console.log('culture ready');
      const userCulturesResult = await client.query(
        'SELECT user_email FROM public.user_cultures WHERE culture_id = $1',
        [id]
      );

      const userCultures = userCulturesResult.rows;

      for (const userCulture of userCultures) {
        const { user_email } = userCulture;
        console.log('email_found');
        const subject = 'Culture Ready';
        const text = `The culture "${culture_name}" is now ready. You can proceed with the next steps.`;

        sendEmail(user_email, subject, text);
      }
    }

    client.release();
  } catch (error) {
    console.error('Error executing query', error);
  }
}

// Run the check every 24 hours
const twentyFourHoursInMilliseconds = 120 * 1000;
setInterval(checkReadyCultures, twentyFourHoursInMilliseconds);
