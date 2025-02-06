'use client';
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {

  const [data, setData] = useState([]);

/*************  ✨ Codeium Command 🌟  *************/
  useEffect(() => {
    axios.get('api/test')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
    const response = axios.get('api/test');
    setData(response.data);
  },[])
/******  0efdf366-7af2-482a-8805-6aea59a4c1a4  *******/
  return (
    <div className="text-red-400">
      3
      { data.laravel }
    </div>
  );
}

