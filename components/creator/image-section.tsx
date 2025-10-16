import React from 'react';
import Image from 'next/image';

const ImageSection = () => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 place-items-center">
      {['/creators/creator4.png', '/creators/creator3.png', '/creators/creator2.png', '/creators/creator1.png'].map((src, index) => (
        <div key={index} className="w-full max-w-[300px] aspect-[6/7] relative">
          <Image
            src={src}
            alt={`Image ${index + 1}`}
            fill
            className="object-contain rounded-xl"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageSection;
