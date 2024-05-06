import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { tools } from './model';
import { Sandbox } from 'e2b';
import { CodeInterpreter } from '@e2b/code-interpreter'


// Initialize Anthropic client
const anthropic = new Anthropic();

// Define custom API response type
type ApiResponse = {
  message?: string;
  error?: string;
}

// Define API endpoint handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  // Check if the incoming request method is POST
  if (req.method === 'POST') {
    try {
      // Extract input text from the request body
      const { input } = req.body;
      
      // Check for the presence of the 'anthropic-beta' header and validate its value
      const anthropicBetaHeader = req.headers['anthropic-beta'];
      if (anthropicBetaHeader !== 'tools-2024-04-04') {
        throw new Error('Invalid or missing header: anthropic-beta');
      }
      
      // Send input text to Anthropic model for processing
      const response = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [{ role: 'user', content: input }],
        model: 'claude-3-opus-20240229', // Replace with your actual model name
        tools: tools, // Include E2B code interpreter tool
      });

      // Extract message from the response
      const message = response.message;
      
      // Send response back to the client
      res.status(200).json({ message });
    } catch (error) {
      // Handle errors during request processing
      console.error('Error processing request:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    // If the request method is not POST, send Method Not Allowed response
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
