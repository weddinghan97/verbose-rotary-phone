export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("⚠️ لم يتم تمرير معرف الدعوة (id) في الرابط");
  }

  const redirectUrl = `https://script.google.com/macros/s/AKfycbzsHgbCpFBKC7eWo8rcx4Hp96jx85o23BHal7jcmqhcjvRejaLtwiaskFVlqwL4I4lT/exec?id=${encodeURIComponent(id)}`;

  return res.redirect(302, redirectUrl);
}
