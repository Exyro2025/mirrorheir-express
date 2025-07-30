// api/generate-letter.js

export default async function handler(req, res) {
  try {
    // This console.log should appear in Vercel's runtime logs if the function starts
    console.log('Function started successfully!');
    return res.status(200).json({ letter: 'Test letter content from Vercel.' });
  } catch (error) {
    console.error('Error in simple function:', error);
    return res.status(500).json({ error: 'Simple function crashed.' });
  }
}

