import React, { useState } from 'react';
import axios from 'axios';

const Home: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       const res = await axios.post('/api/submit', { input }); // Updated to use the Anthropic API endpoint
       setResponse(res.data.message);
    } catch (error) {
       console.error(error);
       setResponse('An error occurred. Please try again later.');
    }
   };
   

  return (
    <div>
      <h1>Terka's AI Friend ⭐️</h1>
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