
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const sheets = google.sheets('v4');

const auth = new JWT(
  'vercel-checker@unified-surfer-455613-j2.iam.gserviceaccount.com',
  undefined,
  `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCfiup3oxAooW14
fkO0BZPnc2dmKVfHg+pRSbTcXBXOGcv9IRm5CWxZ8Udsd9OUqI4ntKBQPyJj5uB/
qv5TRmBa3psvfJFhoC+bXfFRjgiVx04MTeqFlXj90N/AfQwgRunkVgfiOTLgsPFn
OxhigbqKEhBSElEKi+sCBZYFRqXUAsmmyG9OU4F93EVrOcYTHytdJJMTsmXRznLP
Ty8A5kyeV6m9W6DG5FnuMu8NkFJKuo7bbpxAtF0yGRTWe8RaFKdRpqnIVB7PcKuE
OVH2fT9ZDDBZuoy5BJMCWx08aVKs8Sz6EjvaZk8OBbDKKLAntLvY6hZw+RIDGgcq
GrWRsU7FAgMBAAECggEAAZZkKw8tzkgXUUKCxPJ+dfUBgeEGbqwWDRU195byk2VR
UMvFnqaeQK50a5STpkaF4S8Pnn/9hRxbS00cKh/CPkhs9EXoImsLUWxXxg9EozNJ
yDiPc7qfHhNrSCLv/g0GlcJY++8qxCHIMFYRS4wHGzzLxpOuriavQdfK/HMNm/SF
6pNtC0J9XrjNDmGuNLPOkj5auiEK91oWrTydVuey+zczSK+XQtxC2mqnziFmNPjZ
8eDV1ScKMd1x8QPYQksm1almRQGgr0QgVbzF1sXtg6LjqjJS8fGMce1XxjkoJlfM
zwj6MRm28P5uCQ4CABklA03CfBD/bHP8pN5y8QOdPwKBgQDXAfhdsP8mk1PwN1NU
HsVjMxjZrz/Q90r4qc2wF9dH2K7asQIG2jZcNSBxsTLJqQhO7cLefMe/1y7fGAND
HGljZzwEjDZ66xN6s9a+GmT9+Bmts3AexItRPX+cVSsz04o5rvi0WkX8ah0HUx80
USW7eNQPSxQRxsqWSG06MHpDawKBgQC99dMBXhJt/amXwGOusWlCgswtZ9Xnzqzs
EAkF3vRKGHYWgLhP0zFNlP2srASFiqEMVQFRp3kjk1oXkglMOlPx5qJrIYoS4FDx
HOU8nGR1ryW9xv8x+1ijX5O9X6JRI3ZHpQFqGurMS/uSn36vk9eLpJoEY8WPMUZV
k1JmWiByjwKBgQDT9b1DoBnpjZRSXDhp1WwCP31gHMRs3V2rhrqfvuEckyDNt3Ko
DrdIb5dsfaPz6g+mv/48GAdTuG8cwC93GatLs5oXYaLTyquJa4FoJ90oAk5OT3dY
3an6jQYguFW+4eyCsVu9cMFN9c5oSimZCeaIyrVD3mAKpk9RmFUV6HSfwQKBgQCD
n+lUoj18725rE0k/C/lWt9EIiVGDrQbPD5Fg+wskqGxyzUBpN3qLOnjIA+2iJtvO
8rvWO4hJ6Vlcybkdk7EFBf125CeLStlrKM2CwQ8vKGyrYk8D8BiMI7b4WmLbfAoC
PMiNIBef9epcv52FxZhuT2DVN9j1jnwg4dMPztV66wKBgQDG3s/B0dPPXxNyAkeA
qtukwQSFZB83In5sFteH+XqrGpENAnCy3eeTPXWspFzI2Cz2KQ5iX9lCoB+wgFv2
cl2iTZemFxuo5oLxKnzSMUhvwPl/ugUHiflVOLixK3hre8Rchy5dKmFlE4IznS/9
cN11WruX4kwJ6yb+FiVoarJeVg==
-----END PRIVATE KEY-----
`,
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
