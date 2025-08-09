const fetch = require('node-fetch');

exports.handler = async (event) => {
  const videoUrl = event.queryStringParameters.url;

  if (!videoUrl) {
    return {
      statusCode: 400,
      body: 'Missing URL parameter',
    };
  }

  try {
    const res = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Referer: videoUrl,
      },
    });

    let html = await res.text();

    // إزالة نوافذ منبثقة وأكواد إعلانات (مبسط)
    html = html
      .replace(/window\.open\s*\([^)]*\)/gi, '')
      .replace(/onclick="[^"]*window\.open[^"]*"/gi, '')
      .replace(/onclick='[^']*window\.open[^']*'/gi, '')
      .replace(/target="_blank"/gi, '');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: html,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Server error: ' + err.message,
    };
  }
};
