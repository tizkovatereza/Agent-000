import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

type ResponseData = {
  reply?: string;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    try {
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });

      const content = req.body.content as string;  // Assuming the content is sent as a string
      const message = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [{ role: 'user', content }],
        model: 'claude-3-opus-20240229',
      });

      res.status(200).json({ reply: message.content });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
