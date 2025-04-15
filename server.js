
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

app.post('/generate', async (req, res) => {
  const { url, language, goal, lines } = req.body;
  try {
    const prompt = `Generate ${lines} lines of ${goal.toLowerCase()} copy in ${language} based on: ${url}`;
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
    });
    res.json(completion.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
