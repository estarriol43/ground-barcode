import React, { useEffect, useState } from 'react';
import ImageDisplay from './image-display';

function App() {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Replace this URL with your backend endpoint
    fetch(`${process.env.REACT_APP_HOST_URL}/api/image`)
      .then(response => response.json())
      .then(data => setImageUrl(data.imageUrl))
      .catch(error => console.error('Error fetching image:', error));
  }, []);

  return (
    <div>
      <h1>Dynamic Image Display</h1>
      {imageUrl ? (
        <ImageDisplay imageUrl={imageUrl} />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
}

export default App;
