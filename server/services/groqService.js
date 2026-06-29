const analyzeWithGroq = async (rawNotes, systemPrompt, apiKey, model = 'llama-3.3-70b-versatile') => {
  if (!apiKey) {
    throw new Error('Groq API key is missing.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    console.log('Sending request to Groq...');
    const startTime = Date.now();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `RAW NOTES:\n${rawNotes}` }
        ],
        temperature: 0.2
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const error = new Error(`Groq API Error: ${response.statusText}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    const data = await response.json();
    console.log(`Groq responded in ${Date.now() - startTime}ms`);

    return data.choices[0].message.content;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const timeoutError = new Error('TIMEOUT');
      throw timeoutError;
    }
    throw error;
  }
};

module.exports = { analyzeWithGroq };
