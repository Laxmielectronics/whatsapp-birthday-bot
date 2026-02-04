const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");
const { google } = require("googleapis");

const client = new Client();

client.on("qr", qr => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });

  const sheets = google.sheets({ version: "v4", auth });

  const sheetId = "https://docs.google.com/spreadsheets/d/1p-rLwjGcLZnt3lx6914Uyxcy0cjZMFxKU_lhjqvnZb4/edit?usp=sharing";

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Sheet1!A2:C"
  });

  const today = new Date().toISOString().slice(5, 10);

  res.data.values.forEach(row => {
    const name = row[0];
    const phone = row[1];
    const dob = row[2].slice(5, 10);

    if (dob === today) {
      client.sendMessage(
        `${phone}@c.us`,
        `🎉 Happy Birthday ${name}! 🎂\nMay God bless you with happiness & success.\n– Your Shop 💐`
      );
    }
  });
});

client.initialize();

