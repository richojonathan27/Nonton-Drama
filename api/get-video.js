const axios = require('axios');

module.exports = async function handler(req, res) {
  const { bookId } = req.query;
  try {
    // Ambil Token (dari get-token.js)
    const tokenRes = await axios.get("https://dramabox-token.vercel.app/token");
    const { token, deviceid } = tokenRes.data;

    // Ambil Link Stream (dari link-stream.js)
    const url = "https://sapi.dramaboxdb.com/drama-box/chapterv2/batch/load";
    const headers = {
      "User-Agent": "okhttp/4.10.0",
      "tn": `Bearer ${token}`,
      "device-id": deviceid,
      "package-name": "com.storymatrix.drama",
      "Content-Type": "application/json"
    };

    const data = { index: 1, bookId: bookId };
    const streamRes = await axios.post(url, data, { headers });
    
    const videoUrl = streamRes.data.data.chapterList[0].cdnList[0];
    res.status(200).json({ success: true, videoUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: "Gagal memproses video" });
  }
};
