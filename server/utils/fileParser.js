const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const parseFile = async (file) => {
  const ext = file.originalname.split('.').pop().toLowerCase();

  try {
    if (ext === 'pdf') {
      const data = await pdfParse(file.buffer);
      return data.text;
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    } else if (ext === 'txt') {
      return file.buffer.toString('utf-8');
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    throw new Error(`File parsing failed: ${error.message}`);
  }
};

module.exports = { parseFile };
