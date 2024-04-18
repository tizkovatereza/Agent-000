// pages/api/submit.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

type ApiResponse = {
  message?: string;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === 'POST') {
    try {
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });

      const { input } = req.body;
      const response = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [{ role: 'user', content: input }],
        model: 'claude-3-opus-20240229',
      });

      const message = response.content.map(block => block.text).join('');
      res.status(200).json({ message });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message } as ApiResponse);
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
