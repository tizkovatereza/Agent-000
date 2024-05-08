import { CodeInterpreter } from '@e2b/code-interpreter';

// Define a function to interpret code using the E2B CodeInterpreter
export async function codeInterpret(codeInterpreter: CodeInterpreter, code: string): Promise<any> {
  // Log the code that is being executed
  console.log(`\n${'='.repeat(50)}\n> Running following AI-generated code:\n${code}\n${'='.repeat(50)}`);

  // Execute the code using the CodeInterpreter's execCell method
  const exec = await codeInterpreter.notebook.execCell(code);

  // Check if there was an error during execution
  if (exec.error) {
    // Log the error if there was one
    console.log('[Code Interpreter error]', exec.error);
    // Return undefined to indicate an error occurred
    return undefined;
  }

  // Return the execution result if there were no errors
  return exec;
}
 