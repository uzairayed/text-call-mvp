import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { messages } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not set' });
  }

  const prompt = `Summarize the following chat conversation in a few sentences:\n\n${messages.map((m: any) => `${m.sender}: ${m.text}`).join('\n')}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    }),
  });

  const data = await response.json();
  const summary = data.choices?.[0]?.message?.content || 'No summary generated.';

  res.status(200).json({ summary });
} 