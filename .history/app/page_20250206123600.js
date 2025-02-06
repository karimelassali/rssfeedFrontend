'use client';
import axios from "axios";
import { useEffect, useState } from "react";

import Carousel from "@/components/ui/carousel";
import WordPressImageFetcher from "@/components/ui/imgSelection";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
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
  // const {user,logout} = useContext(AuthContext);


  useEffect(() => {
    axios.get('api/test')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  },[])
  return (
    <div className="w-ful" >

    </div>
  );
}

