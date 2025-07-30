// api/generate-letter.js

import OpenAI from 'openai'; // Make sure you have 'openai' installed in your project dependencies

// Initialize OpenAI with your API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Vercel environment variable
});

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { recipient, tone, message } = req.body;

  if (!recipient || !tone || !message) {
    return res.status(400).json({ error: 'Missing recipient, tone, or message' });
  }

  const prompt = `You are an emotional memory companion. Help someone write a letter to ${recipient} in a ${tone} tone. Use the following message as guidance: \"${message}\".`;

  try {
    console.log('Attempting to call OpenAI API...'); // Add this log!
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 700,
      temperature: 0.8,
    });
    console.log('OpenAI API call successful.'); // Add this log!

    const letterContent = completion.choices[0].message.content;

    // Set CORS headers for Vercel functions
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json({ letter: letterContent });

  } catch (error) {
    console.error('Error calling OpenAI API:', error); // This is where the specific error will be caught
    if (error.response) {
        console.error(error.response.status, error.response.data);
        return res.status(error.response.status).json({ error: error.response.data });
    } else {
        return res.status(500).json({ error: 'Failed to generate letter' });
    }
  }
}
