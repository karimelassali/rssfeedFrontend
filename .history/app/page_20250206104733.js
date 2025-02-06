'use client';
import axios from "axios";
import { useEffect, useState } from "react";

import Carousel from "@/components/ui/carousel";

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

  useEffect(() => {
    axios.get('api/test')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  },[])
  return (
    <div className="text-red-400">
      <Carousel slides={data} />
      { JSON.stringify(data, null, 2) }
    </div>
  );
}

