import React, { createContext, useState } from 'react';

export const ImageContext = createContext();

const ImageContextProvider = ({ children }) => {
  const [images, setImages] = useState([]);

  return (
    <ImageContext.Provider value={{
      images,
      setImages
    }}>
      {children}
    </ImageContext.Provider>
  );
}

export default ImageContextProvider;