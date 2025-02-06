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
    <div className="text-red-400">
      3
/*************  ✨ Codeium Command 🌟  *************/
      {data[0]?.title}
      {{data[0].title}}
    </div>
/******  1d27b887-799a-4773-b53a-cfbba1693166  *******/
  );
}

