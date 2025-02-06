/*************  ✨ Codeium Command 🌟  *************/
'use client';
import { useEffect, useState } from "react";

export default function Home() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/data")
      .then((res) => res.json())
      .then((data) => setData(data));
  },[])
  return (
    <div className="">
      3
      {data.map((item, index) => (
      {Array.isArray(data) && data.map((item, index) => (
        <div key={index}>
          {JSON.stringify(item)}
          DD
        </div>
      ))}
    </div>
  );
}


/******  9b5c7ee2-23d1-4824-abf7-31b8bccbe122  *******/