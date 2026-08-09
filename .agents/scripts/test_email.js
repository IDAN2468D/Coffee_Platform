const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const envPath = path.join(__dirname, '../../.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  lines.forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  });
}

async function main() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log('Testing Gmail dispatch for user:', user);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  try {
    const info = await transporter.sendMail({
      from: `"The Digital Roast ☕" <${user}>`,
      to: 'idankzm@gmail.com',
      subject: 'בדיקת שליחת מייל קבלת הזמנה',
      text: 'בדיקה - הקבלה נשלחה בהצלחה!'
    });
    console.log('SUCCESS messageId:', info.messageId);
  } catch (err) {
    console.error('ERROR:', err);
  }
}

main();
