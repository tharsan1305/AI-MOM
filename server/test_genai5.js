const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6JUyFUIqv6KExsk1ZwRZAMnCbc8Bcx-O5yPSmc_tz_w8w' });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: "A neon city"
    });
    console.log('SUCCESS', response.text);
  } catch(e) {
    console.error('ERROR', e.message);
  }
}
run();
