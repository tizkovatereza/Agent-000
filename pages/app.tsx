// pages/app.tsx
import { useState } from 'react';

const AppPage = () => {
 const [input, setInput] = useState('');
 const [response, setResponse] = useState('');

 const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setResponse('Hello friend');
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
