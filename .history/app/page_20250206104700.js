'use client';
import axios from "axios";
import { useEffect, useState } from "react";

import Carousel from "@/components/ui/carousel";

export default function Home() {

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

