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
    <div className="image-gallery">
      {images.map((image, index) => (
        <img key={index} src={image.src} alt={image.alt} className="gallery-img" />
      ))}
    </div>
  );
};

export default WordPressImageFetcher;

