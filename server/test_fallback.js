const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6JUyFUIqv6KExsk1ZwRZAMnCbc8Bcx-O5yPSmc_tz_w8w' });

async function run() {
  try {
    const res = await ai.models.generateImages({
      model: "gemini-3.1-flash-image",
      prompt: "A neon city",
      config: { numberOfImages: 1, outputMimeType: "image/jpeg" }
    });
    console.log("Success");
  } catch (err) {
    console.log("Caught Error Message:", err.message);
    try {
      const encodedPrompt = encodeURIComponent("A neon city");
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;
      console.log("Fetching fallback...", imageUrl);
      const response = await fetch(imageUrl);
      console.log("Fallback response status:", response.status);
      const arrayBuffer = await response.arrayBuffer();
      console.log("Buffer length:", arrayBuffer.byteLength);
    } catch (fallbackErr) {
      console.log("Fallback Error:", fallbackErr.message);
    }
  }
}
run();
