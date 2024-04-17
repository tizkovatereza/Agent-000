// pages/api/claude.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

// Define the types for clearer response handling
type Data = {
  message?: string;
  error?: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === 'POST') {
    try {
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });

      const { input } = req.body;
      const message = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [{ role: 'user', content: input }],
        model: 'claude-3-opus-20240229',
      });

      res.status(200).json({ message: message.content });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to communicate with Anthropic API' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
