const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
const { extractTextFromImage } = require('../services/ocrService');

// Use memory storage for OCR since we don't need to persist the image
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Interactions API Shim to support the user's requested syntax in the official SDK
if (!ai.interactions) {
  ai.interactions = {
    create: async (params) => {
      const res = await ai.models.generateContent({
        model: params.model,
        contents: params.input,
      });
      return { output_text: res.text };
    }
  };
}

// Chat Endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash",
      input: message,
    });

    res.json({ success: true, output_text: interaction.output_text });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Generate Image Endpoint
router.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required' });

    // 1. Intelligence Layer: Convert messy notes into a concise visual prompt
    let optimizedPrompt = prompt.trim();
    
    try {
      try {
        const textInteraction = await ai.interactions.create({
          model: "gemini-3.5-flash",
          input: `You are an expert AI image prompt engineer. The user has provided messy meeting notes. Extract the core theme and subject of the meeting, and write a highly descriptive, concise, visual prompt (under 30 words) to generate a beautiful, professional, cinematic representation of the meeting's outcome. \nCRITICAL INSTRUCTION: Do NOT include any text, numbers, words, or typography in the image prompt. The image must be purely visual.\n\nReturn ONLY the final image prompt string. No quotes, no intro.\n\nMeeting Notes:\n${prompt}`
        });
        if (textInteraction.output_text && textInteraction.output_text.length > 5) {
          optimizedPrompt = textInteraction.output_text.trim();
          console.log("Intelligence Layer generated optimized prompt:", optimizedPrompt);
        }
      } catch (err) {
        console.log("Intelligence Layer failed, falling back to original prompt", err.message);
      }

      // 2. Try the user's requested Gemini Image API
      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image",
        input: optimizedPrompt,
      });

      res.json({ success: true, image: { imageUrl: `data:image/jpeg;base64,${interaction.output_image.data}`, createdAt: new Date() } });
    } catch (apiError) {
      console.log('Gemini API failed or quota exceeded (429), running Pollinations fallback. Error:', apiError.message);
      
      // Note: We use the optimizedPrompt here as well to ensure the fallback gets the smart prompt!
      const encodedPrompt = encodeURIComponent(optimizedPrompt || prompt.trim());
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;
      
      const fetchRes = await fetch(imageUrl);
      const arrayBuffer = await fetchRes.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString('base64');
      
      res.json({ success: true, image: { imageUrl: `data:image/jpeg;base64,${base64Data}`, createdAt: new Date() } });
    }
  } catch (error) {
    console.error('Image Generation Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// OCR Endpoint for handwritten notes
router.post('/ocr', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const text = await extractTextFromImage(req.file.buffer, req.file.mimetype);
    
    if (!text) {
      return res.status(400).json({ success: false, message: 'Could not extract text from the image.' });
    }

    res.json({ success: true, text });
  } catch (error) {
    console.error('OCR Route Error:', error);
    res.status(500).json({ success: false, message: error.message || 'OCR processing failed.' });
  }
});

module.exports = router;
