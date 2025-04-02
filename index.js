
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const sheets = google.sheets('v4');

const auth = new JWT(
  credentials.client_email,
  undefined,
  credentials.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const spreadsheetId = '1rj3QeAN2CmRMVjMnLMix-32-U4vfyy0Wfo5BDRjuNkg'; // Google Sheets ID

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).send('<h2>لم يتم تقديم رقم الدعوة</h2>');
  }

  await auth.authorize();
  const response = await sheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: 'data!A2:E',
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return res.status(404).send('<h2>لم يتم العثور على بيانات</h2>');
  }

  const rowIndex = rows.findIndex(row => String(row[0]).trim() === id);
  if (rowIndex === -1) {
    return res.status(404).send('<h2>رقم الدعوة غير موجود</h2>');
  }

  const row = rows[rowIndex];
  const isUsed = (row[4] || '').trim() === 'نعم';

  if (isUsed) {
    return res.status(200).send('<h2>❌ هذه الدعوة تم استخدامها مسبقًا</h2>');
  }

  await sheets.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: `data!E${rowIndex + 2}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [['نعم']]
    }
  });

  return res.status(200).send(`
    <div style="font-family: sans-serif; text-align: center; margin-top: 100px;">
      <h2>✅ الدعوة صالحة</h2>
      <p>الاسم: <strong>${row[1]}</strong></p>
      <p>نوع الدعوة: <strong>${row[2]}</strong></p>
    </div>
  `);
}
