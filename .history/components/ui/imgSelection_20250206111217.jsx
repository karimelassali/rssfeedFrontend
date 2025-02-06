import axios from 'axios';
import { useEffect, useState } from 'react';

const WordPressImageFetcher = ({ apiUrl }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${apiUrl}/wp-json/wp/v2/media?per_page=100`);
        const imageUrls = response.data.map(image => ({
          src: image.source_url,
          alt: image.alt_text || 'WordPress Image'
        }));
        setImages(imageUrls);
      } catch (error) {
        console.error('Error fetching images from WordPress:', error);
      }
    };

    fetchImages();
  }, [apiUrl]);

  return (
/*************  ✨ Codeium Command 🌟  *************/
    <div className="image-gallery overflow-y-auto overflow-x-hidden max-h-[75vh] pr-4 pb-4 scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500 rounded-lg">
    <div className="image-gallery overflow-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images ? images.map((image, index) => (
        <img key={index} src={image.src} alt={image.alt} className="gallery-img rounded-lg shadow-lg" />
      )) : 'Loading...'}
    </div>
/******  f943dc0e-f934-4b9c-84ba-2ec83e72dd04  *******/
  );
};

export default WordPressImageFetcher;

