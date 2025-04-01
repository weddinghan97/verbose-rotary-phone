
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send('<h2>لم يتم تقديم رقم الدعوة</h2>');
  }

  const filePath = path.resolve('./', 'data.csv');
  const fileContent = readFileSync(filePath, 'utf8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  const entry = records.find(row => row['رقم الدعوة'] === id || row['رقم الدعوة'] === parseInt(id));

  if (!entry) {
    return res.status(404).send('<h2>رقم الدعوة غير موجود</h2>');
  }

  const isUsed = entry['تم الاستخدام؟'].trim() === 'نعم';

  if (isUsed) {
    return res.status(200).send('<h2>❌ هذه الدعوة تم استخدامها مسبقًا</h2>');
  }

  return res.status(200).send(`
    <div style="font-family: sans-serif; text-align: center; margin-top: 100px;">
      <h2>✅ الدعوة صالحة</h2>
      <p>الاسم: <strong>${entry['اسم الملف']}</strong></p>
      <p>نوع الدعوة: <strong>${entry['نوع الدعوة']}</strong></p>
    </div>
  `);
}
