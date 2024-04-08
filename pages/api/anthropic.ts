// pages/api/anthropic.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 if (req.method === 'POST') {
    try {
      const { input } = req.body;
      const response = await axios.post('https://api.anthropic.com/v1/engines/claude/completions', {
        prompt: input,
        max_tokens: 60,
        n: 1,
        stop: null,
        temperature: 0.5,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const message = response.data.choices[0].text;
      res.status(200).json({ message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
 } else {
    res.status(405).json({ error: 'Method not allowed.' });
 }
}
