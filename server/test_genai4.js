const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6JUyFUIqv6KExsk1ZwRZAMnCbc8Bcx-O5yPSmc_tz_w8w' });

async function run() {
  try {
    const response = await ai.models.generateImages({
      model: "gemini-3.1-flash-image",
      prompt: "A neon city",
      config: { numberOfImages: 1, outputMimeType: "image/jpeg" }
    });
    console.log('SUCCESS', response.generatedImages.length);
  } catch(e) {
    console.error('ERROR', e.message);
  }
}
run();
