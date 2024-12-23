import React, { useEffect, useState } from 'react';
import ScatteredImages from './scatter-images';

function App() {
  const [part, setPart] = useState('');
  const [codeFreq, setCodeFreq] = useState('');
  const [codeFreqLen, setCodeFreqLen] = useState('');

  useEffect(() => {
    const fetchPart = async () => {
      try {
        // Replace with your backend API endpoint
        const response = await fetch(`${process.env.REACT_APP_HOST_URL}/api/part`);
        const data = await response.json();
        setPart(data.value); // Assuming `value` corresponds to the image key or URL
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Polling the backend every 100ms
    fetchPart();
    const interval = setInterval(fetchPart, 100);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    console.log(`Part: ${part}`);

    const fetchCodeFreq = async () => {
      try {
        // Replace with your backend API endpoint
        const response = await fetch(`${process.env.REACT_APP_HOST_URL}/api/codelist`);
        const data = await response.json();
        setCodeFreq(data.value);
        setCodeFreqLen(Object.keys(data.value).length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCodeFreq();
    const interval = setInterval(fetchCodeFreq, 100);

    return () => clearInterval(interval); // Cleanup on component unmount

  }, [part]);

  useEffect(() => {
    console.log(`codeFreq: ${codeFreq}`);
  }, [codeFreqLen]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1> Part {part} </h1>
      <ScatteredImages codeFreq={codeFreq} codeFreqLen={codeFreqLen} part={part}/>
    </div>
  );
}

export default App;
