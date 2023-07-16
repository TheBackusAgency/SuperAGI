const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/api/generate-text', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await axios.post('https://api.openai.com/v1/engines/GPT-4/completions', {
      prompt,
      max_tokens: 100,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    res.json({ text: response.data.choices[0].text.trim() });
  } catch (error) {
    res.status(500).json({ error: 'Error generating text' });
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'));
