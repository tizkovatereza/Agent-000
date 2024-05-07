import React, { useState } from 'react';
import axios from 'axios';

import {
  MODEL_NAME,
  SYSTEM_PROMPT,
  tools,
} from './api/model';
import { codeInterpret } from './api/codeInterpreter'


const Home: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       const res = await axios.post('/api/submit', { input }, {
         headers: {
           'anthropic-beta': 'tools-2024-04-04'
         }
       });
       setResponse(res.data.message);
    } catch (error) {
       console.error(error);
       setResponse('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h1>🦄 Terka's AI Friend ⭐️</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="input">Enter some text:</label>
        <input
          type="text"
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {response && <p>AI friend: {response}</p>}
    </div>
  );
};

export default Home;
