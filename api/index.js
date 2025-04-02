export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("⚠️ لم يتم تمرير معرف الدعوة (id) في الرابط");
  }

  const redirectUrl = `https://script.google.com/macros/s/AKfycbxWo_d5_vB9FcfRnL-IX74MZ5e0ZQouF74EicRwzhqgTjTPgryEvWE9CozjoJ2jE-0G/exec?id=${encodeURIComponent(id)}`;

  return res.redirect(302, redirectUrl);
}
