'use client';
import axios from "axios";
import { useEffect, useState } from "react";

import Carousel from "@/components/ui/carousel";
import WordPressImageFetcher from "@/components/ui/imgSelection";

export default function Home() {

  const slides = [
    {
      id: 1,
      src: 'https://picsum.photos/id/1015/1000/600',
      alt: 'Image 1',
    },
    {
      id: 2,
      src: 'https://picsum.photos/id/1016/1000/600',
      alt: 'Image 2',
    },
    {
      id: 3,
      src: 'https://picsum.photos/id/1017/1000/600',
      alt: 'Image 3',
    },
    {
      id: 4,
      src: 'https://picsum.photos/id/1018/1000/600',
      alt: 'Image 4',
    },
    {
      id: 5,
      src: 'https://picsum.photos/id/1019/1000/600',
      alt: 'Image 5',
    },
  ];
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    axios.get('api/test')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  },[])
  return (
    <div className="text-red-400">
      Login 
      {data ? <Carousel slides={data} /> : 'Loading...'}
      

    <hr />
    <hr/>
    {modalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <WordPressImageFetcher apiUrl={'https://www.lavalleenotizie.it/'} />
          <button onClick={() => setModalOpen(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Close</button>
        </div>
      </div>
    )}

    <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded">Open Modal</button>
    </div>
  );
}

