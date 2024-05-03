import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import { Sandbox } from 'e2b'; // E2B
import { CodeInterpreter, Execution } from '@e2b/code-interpreter'

// Import Anthropic and E2B tools
import {
  MODEL_NAME,
  SYSTEM_PROMPT,
  tools,
} from './model'
import { codeInterpret } from './codeInterpreter'

// Initialize Anthropic client
const anthropic = new Anthropic();

// Define custom API response type
type ApiResponse = {
  message?: string;
  error?: string;
}

// Define API endpoint handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  // Create sandbox environment for code execution
  const sandbox = await Sandbox.create();
  
  // Check if the incoming request method is POST
  if (req.method === 'POST') {
    try {
      // Extract input text from the request body
      const { input } = req.body;
      
      // Send input text to Anthropic model for processing
      const response = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [{ role: 'user', content: input }],
        model: 'claude-3-opus-20240229',
        tools: tools, // Include E2B code interpreter tool
      });

      // Check if the response requires code execution
      if (response.stop_reason === 'tool_use') {
        const toolBlock = response.content.find((block) => block.type === 'tool_use');
        const toolName = toolBlock.name;
        const toolInput = toolBlock.input;

        if (toolName === 'execute_python') {
          const code = toolInput.code;
          const codeInterpreter = await CodeInterpreter.create(); // Initialize E2B code interpreter
          const codeOutput = await codeInterpret(codeInterpreter, code); // Interpret the code using E2B code interpreter
          await codeInterpreter.close(); // Close the code interpreter after execution
          
          // Append execution results to the response message
          response.message += ` Execution Results: ${codeOutput.results}`;
        }
      }

      // Extract message from the response
      const message = response.message;
      
      // Send response back to the client
      res.status(200).json({ message });
    } catch (error) {
      // Handle errors during request processing
      console.error('Error processing request:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } finally {
      // Close the sandbox environment after request processing is complete
      await sandbox.close();
    }
  } else {
    // If the request method is not POST, send Method Not Allowed response
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
