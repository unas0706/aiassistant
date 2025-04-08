const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/chat', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI shopping assistant for a tech store. 
        Help users find products and answer questions about electronics and tech products. 
        Be concise and friendly in your responses.`
      }
    ];

    if (Array.isArray(chatHistory)) {
      messages.push(...chatHistory.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      })));
    }

    messages.push({ role: 'user', content: message });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 200
    });

    const reply = completion.choices[0].message.content;

    res.json({ message: reply });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error processing your request',
      error: error.message
    });
  }
});

module.exports = router; 