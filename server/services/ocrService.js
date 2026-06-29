const { GoogleGenAI } = require('@google/genai');

const extractTextFromImage = async (fileBuffer, mimeType) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // fast and good at vision
      contents: [
        'Extract and transcribe all handwritten or printed text from this image exactly as written. Output only the transcribed text, nothing else.',
        {
          inlineData: {
            data: fileBuffer.toString('base64'),
            mimeType: mimeType
          }
        }
      ]
    });

    if (res.text) {
      return res.text.trim();
    }
    
    throw new Error('No text returned from Gemini');
  } catch (error) {
    console.error('OCR Service Error:', error);
    throw new Error('Failed to extract text from image');
  }
};

module.exports = {
  extractTextFromImage
};
