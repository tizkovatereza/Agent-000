import React, { useState } from 'react';
import axios from 'axios';

const AppPage = () => {
 const [input, setInput] = useState('');
 const [response, setResponse] = useState('');

 const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  try {
    const res = await axios.post(
      '/api/submit',
      { input },
      {
        headers: {
          'anthropic-beta': 'tools-2024-04-04' // Add the required header
        }
      }
    );
    setResponse(res.data.message);
  } catch (error) {
    console.error(error);
    setResponse('An error occurred. Please try again later.');
  }
};


 return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="input">Enter some text:</label>
        <input
          id="input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {response && <p>{response}</p>}
    </div>
 );
};

export default AppPage;
