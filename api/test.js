module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('Test endpoint called');
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Environment variables available:', Object.keys(process.env).filter(key => key.includes('OPENAI')));

    res.json({
      status: 'success',
      message: 'Test endpoint working',
      method: req.method,
      hasApiKey: !!process.env.OPENAI_API_KEY,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
