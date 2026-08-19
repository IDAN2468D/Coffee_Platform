const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

async function testGCalInsert() {
  const configDir = path.join(process.env.USERPROFILE || 'C:\\Users\\kazam', '.config', 'google-drive-mcp');
  const tokenPath = path.join(configDir, 'tokens.json');
  const keysPath = path.join(configDir, 'gcp-oauth.keys.json');

  const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
  const keysData = JSON.parse(fs.readFileSync(keysPath, 'utf8')).installed;
  const account = tokenData.accounts?.default || Object.values(tokenData.accounts || {})[0];

  const oauth2Client = new google.auth.OAuth2(
    keysData.client_id,
    keysData.client_secret,
    keysData.redirect_uris?.[0] || 'http://localhost'
  );

  oauth2Client.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const now = new Date();
  const startTime = new Date(now.getTime() + 60 * 60 * 1000);
  const endTime = new Date(startTime.getTime() + 45 * 60 * 1000);

  try {
    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: '☕ בדיקת סנכרון ישיר: The Digital Roast',
        description: 'אירוע שנוצר ישירות ביומן Google Calendar ללא עריכה ידנית!',
        location: 'The Digital Roast Lab',
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'Asia/Jerusalem',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'Asia/Jerusalem',
        },
      },
    });

    console.log('SUCCESS! Event created directly in Google Calendar:', res.data.id, res.data.htmlLink);
  } catch (err) {
    console.error('Insert error:', err.message);
    if (err.errors) console.error('Details:', err.errors);
  }
}

testGCalInsert();
