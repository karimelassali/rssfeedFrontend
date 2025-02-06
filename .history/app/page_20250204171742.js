'use client';
import { useEffect, useState } from "react";

export default function Home() {

  const {data,setData} = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/data")
      .then((res) => res.json())
      .then((data) => setData(data));
  },[])
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
/*************  ✨ Codeium Command 🌟  *************/
      {Array.isArray(data) && data.map((item, index) => (
        <div key={index}>
          {JSON.stringify(item)}
        </div>
      ))}
      {{data}}
/******  f9370f50-3ee7-4ece-be2c-1f6c216f6f39  *******/
    </div>
  );
}

