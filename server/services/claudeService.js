const analyzeWithClaude = async (rawNotes, systemPrompt, apiKey, model = 'claude-3-haiku-20240307') => {
  if (!apiKey) {
    throw new Error('Claude API key is missing.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    console.log(`Sending request to Claude (${model})...`);
    const startTime = Date.now();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: `RAW NOTES:\n${rawNotes}` }
        ],
        temperature: 0.2
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const error = new Error(`Claude API Error: ${response.statusText}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    const data = await response.json();
    console.log(`Claude responded in ${Date.now() - startTime}ms`);

    return data.content[0].text;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const timeoutError = new Error('TIMEOUT');
      throw timeoutError;
    }
    throw error;
  }
};

module.exports = { analyzeWithClaude };
