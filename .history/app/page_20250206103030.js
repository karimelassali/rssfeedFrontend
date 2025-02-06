'use client';
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {

  const [data, setData] = useState([]);

  useEffect(() => {
    const response = axios.get('api/test');
    setData(response.data);
  },[])
  return (
    <div className="text-red-400">
      3
      { data.laravel }
    </div>
  );
}

