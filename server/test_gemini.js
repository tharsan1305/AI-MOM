const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI('AQ.Ab8RN6JUyFUIqv6KExsk1ZwRZAMnCbc8Bcx-O5yPSmc_tz_w8w');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say hello world in 2 words');
    console.log('SUCCESS:', result.response.text());
  } catch (error) {
    console.error('FAILED:', error.message);
  }
}

testGemini();
