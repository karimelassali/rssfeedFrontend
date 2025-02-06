'use client';
import { useEffect, useState } from "react";

export default function Home() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((res) => res.json())
      .then((data) => setData(data));
  },[])
  return (
    <div className="text-red-400">
      3
      {data}
    </div>
  );
}

