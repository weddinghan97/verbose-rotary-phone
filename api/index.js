export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("⚠️ لم يتم تمرير معرف الدعوة (id) في الرابط");
  }

  const redirectUrl = `https://script.google.com/macros/s/AKfycbxKAK-jI40llq0u9wPnW6OSPZnmuLAEvw-_S21WcyNdWb_waxgs63ifNFa-0jln8xY6/exec?id=${encodeURIComponent(id)}`;

  return res.redirect(302, redirectUrl);
}

