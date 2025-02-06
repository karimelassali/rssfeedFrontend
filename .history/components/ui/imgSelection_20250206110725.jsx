import axios from 'axios';
import { useEffect, useState } from 'react';

const WordPressImageFetcher = ({ apiUrl }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${apiUrl}/wp-json/wp/v2/media`);
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
    <div className="image-gallery grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div className="image-gallery">
      {images.map((image, index) => (
        <img key={index} src={image.src} alt={image.alt} className="gallery-img rounded-lg shadow-lg" />
        <img key={index} src={image.src} alt={image.alt} className="gallery-img" />
      ))}
    </div>
/******  567129b5-eade-4f10-ad2d-6e25e5763075  *******/
  );
};

export default WordPressImageFetcher;

