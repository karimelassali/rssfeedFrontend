/*************  ✨ Codeium Command 🌟  *************/
import axios from 'axios';
import { useEffect, useState } from 'react';

const WordPressImageFetcher = ({ apiUrl }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${apiUrl}/wp-json/wp/v2/media?per_page=100`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const response = await axios.get(`${apiUrl}/wp-json/wp/v2/media?per_page=100`);
        const imageUrls = response.data.map(image => ({
          src: image.media_details.sizes.full.source_url,
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
    <div className="image-gallery grid grid-cols-2 gap-4 overflow-y-auto overflow-x-hidden max-h-[75vh] pr-4 pb-4 scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500 rounded-lg">
      {images ? images.map((image, index) => (
        <img key={index} src={image.src} alt={image.alt} className="gallery-img rounded-lg shadow-lg" />
      )) : 'Loading...'}
    </div>
  );
};

export default WordPressImageFetcher;


/******  f05a688d-3e8d-420c-b618-79f6e1c4eab0  *******/