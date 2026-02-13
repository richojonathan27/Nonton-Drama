// Gunakan logika dari link-stream.js dan get-token.js
const axios = require('axios');

module.exports = async function handler(req, res) {
  const { bookId } = req.query; // Mengambil ID drama yang diklik user

  try {
    // 1. Ambil Token (Logika dari get-token.js)
    const tokenRes = await axios.get("https://dramabox-token.vercel.app/token");
    const auth = tokenRes.data;

    // 2. Ambil Link Stream (Logika dari link-stream.js)
    const url = "https://sapi.dramaboxdb.com/drama-box/chapterv2/batch/load";
    const headers = {
      "User-Agent": "okhttp/4.10.0",
      "tn": `Bearer ${auth.token}`,
      "device-id": auth.deviceid,
      "package-name": "com.storymatrix.drama",
      "Content-Type": "application/json"
    };

    const data = {
      index: 1, // Episode 1
      bookId: bookId // Menggunakan ID dinamis
    };

    const streamRes = await axios.post(url, data, { headers });
    const videoUrl = streamRes.data.data.chapterList[0].cdnList[0];

    // Kirim hasilnya ke website
    res.status(200).json({ videoUrl });
  } catch (error) {
    res.status(500).json({ error: "Gagal memuat video" });
  }
};
