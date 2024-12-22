import React from 'react';

function ImageDisplay({ imageUrl }) {
  return (
    <div>
      <img src={imageUrl} alt="Dynamic Content" style={{ maxWidth: '100%' }} />
    </div>
  );
}

export default ImageDisplay;
