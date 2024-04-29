import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { Sandbox } from 'e2b'; // E2B

type ApiResponse = {
  message?: string;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const sandbox = await Sandbox.create();
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

      if (response.requiresCodeExecution) { // Pseudocode: Adjust based on actual API response
        const codeToExecute = extractCode(response); // Implement this function to parse the response
        const executionResults = await sandbox.runCode(codeToExecute);
        response.message += ` Execution Results: ${executionResults}`;
      }

      const message = response.message;
      res.status(200).json({ message });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } finally {
      await sandbox.close();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}