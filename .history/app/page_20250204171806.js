/*************  ✨ Codeium Command 🌟  *************/
'use client';
import { useEffect, useState } from "react";

export default function Home() {

  const [data, setData] = useState([]);
  const {data,setData} = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/data")
      .then((res) => res.json())
      .then((data) => setData(data));
  },[])
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {Array.isArray(data) && data.map((item, index) => (
        <div key={index}>
          {JSON.stringify(item)}
        </div>
      ))}
    </div>
  );
}


/******  0df89c5d-3b4c-4b8d-9b16-724f836a8773  *******/