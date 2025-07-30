export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { recipient, tone, message } = req.body;

  const prompt = `You are an emotional memory companion. Help someone write a letter to ${recipient} in a ${tone} tone. Use the following message as guidance: \"${message}\".`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 700,
        temperature: 0.8
      })
    });

    const data = await response.json();
    const letter = data.choices?.[0]?.message?.content;
    res.status(200).json({ letter });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ message: "Failed to generate letter." });
  }
}
