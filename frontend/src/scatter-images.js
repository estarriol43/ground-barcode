import React, { useEffect, useState } from 'react';
import './styles.css';

const numImage = 20;
var codeList = []

const ScatteredImages = ({ codeFreq, codeFreqLen, part }) => {
    const [images, setImages] = useState([]);

    const createScatteredImages = () => {
        const scatteredImages = [];

        console.log(`createScatteredImages`);

        for (let i = 0; i < codeList.length; i++) {
            const x = Math.random() * window.innerWidth * 0.80;
            const y = Math.random() * window.innerHeight * 0.80;
            const rotation = Math.random() * 360;
            const src = `/images/${codeList[i]}`;

            scatteredImages.push({ x, y, rotation, src });
        }

        setImages(scatteredImages);
    };

    const updateCodeList = () => {
      var totalCnt = 0;

      var tmp = []

      for (let code in codeFreq) {
        totalCnt += codeFreq[code];
      }

      for (let code in codeFreq) {
        for (let i = 0; i < (codeFreq[code] / totalCnt) * numImage; i += 1) {
          tmp.push(code);
        }
      }
      codeList = tmp;

      console.log(codeList);
      console.log(codeFreq);
    }

    useEffect(() => {
      updateCodeList();
      createScatteredImages();
    }, [codeFreqLen, part]);

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

