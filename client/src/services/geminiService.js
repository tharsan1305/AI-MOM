import axios from 'axios';

/**
 * Service to handle the new core workflow: analyzing raw notes into the strict JSON schema.
 */
export const geminiService = {
  /**
   * Analyzes meeting notes using the backend Gemini proxy.
   * @param {string} rawNotes - The unstructured meeting notes.
   * @returns {Promise<Object>} The parsed structured JSON.
   */
  analyzeNotes: async (rawNotes) => {
    try {
      const response = await axios.post('/api/infographic/analyze', { rawNotes });
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Analysis failed unexpectedly.');
      }
    } catch (error) {
      if (error.response) {
        // Server responded with an error (e.g., 400 Bad Request, 429 Rate Limit, 500 Internal Error)
        throw new Error(error.response.data.message || 'The server encountered an error while analyzing your notes.');
      } else if (error.request) {
        // Network failure or backend down
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw new Error('An unexpected error occurred during analysis.');
      }
    }
  }
};
