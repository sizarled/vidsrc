const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const videoUrl = event.queryStringParameters.url;

    if (!videoUrl) {
      return { statusCode: 400, body: 'Missing URL parameter' };
    }

    // جلب الصفحة من المصدر
    const res = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0', // بعض المواقع تحتاجه
        'Referer': videoUrl
      }
    });

    let html = await res.text();

    // إزالة النوافذ المنبثقة المعروفة
    html = html
      // حذف أي window.open()
      .replace(/window\.open\s*\([^)]*\)/gi, '')
      // حذف onClick الذي يفتح روابط
      .replace(/onclick="[^"]*window\.open[^"]*"/gi, '')
      .replace(/onclick='[^']*window\.open[^']*'/gi, '')
      // حذف أي روابط target="_blank" (ممكن تستخدم لفتح إعلانات)
      .replace(/target="_blank"/gi, '')
      // حذف أكواد إعلانات Google وأشباهها
      .replace(/<script[^>]*src=["'][^"']*(ads|doubleclick|popunder)[^"']*["'][^>]*>.*?<\/script>/gi, '')
      // حذف divs الإعلانية الواضحة
      .replace(/<div[^>]*(ad|popup)[^>]*>.*?<\/div>/gis, '');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: html,
    };

  } catch (err) {
    return { statusCode: 500, body: 'Server error: ' + err.message };
  }
};
