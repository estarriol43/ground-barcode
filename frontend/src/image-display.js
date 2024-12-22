import React from 'react';

// A mapping of backend values to image URLs
const imageMap = {
  fuck: `${process.env.REACT_APP_HOST_URL}/images/fuck.jpg`,
};

function ImageDisplay({ imageKey }) {
  const imageUrl = imageMap[imageKey];

  if (!imageUrl) {
    return <p>Invalid image key: {imageKey}</p>;
  }

  return (
    <div>
      <img
        src={imageUrl}
        alt={`Selected ${imageKey}`}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}

export default ImageDisplay;
