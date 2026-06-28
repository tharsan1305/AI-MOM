const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: 'AQ.Ab8RN6JUyFUIqv6KExsk1ZwRZAMnCbc8Bcx-O5yPSmc_tz_w8w',
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

async function testGeminiOpenAI() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gemini-2.5-flash',
      messages: [{ role: 'user', content: 'Output {"key": "value"}' }],
      response_format: { type: 'json_object' }
    });
    console.log('SUCCESS:', response.choices[0].message.content);
  } catch (error) {
    console.error('FAILED:', error.message);
  }
}

testGeminiOpenAI();
