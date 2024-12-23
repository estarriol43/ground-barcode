import React, { useEffect, useState } from 'react';
import './styles.css';

const ScatteredImages = ({ codeList, codeListLen, part }) => {
    const [images, setImages] = useState([]);

    const createScatteredImages = () => {
        const scatteredImages = [];

        console.log(`createScatteredImages`);

        for (let i = 0; i < codeList.length; i++) {
            const x = Math.random() * window.innerWidth * 0.75;
            const y = Math.random() * window.innerHeight * 0.75;
            const rotation = Math.random() * 360;
            const src = `/images/${codeList[i]}`;

            scatteredImages.push({ x, y, rotation, src });
        }

        setImages(scatteredImages);
    };

    useEffect(() => {
      createScatteredImages();
    }, [codeListLen, part]);

    return (
        <div className="scattered-images-container">
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image.src}
                    alt="scattered"
                    className="scattered-image"
                    style={{
                        left: `${image.x}px`,
                        top: `${image.y}px`,
                        transform: `rotate(${image.rotation}deg)`
                    }}
                />
            ))}
        </div>
    );
};

export default ScatteredImages;

