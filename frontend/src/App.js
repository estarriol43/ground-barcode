import React, { useEffect, useState } from 'react';
import ImageDisplay from './image-display';

function App() {
  const [part, setPart] = useState('');

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

  return (
    <div style={{ textAlign: 'center' }}>
      <h1> Part {part} </h1>
    </div>
  );
}

export default App;
