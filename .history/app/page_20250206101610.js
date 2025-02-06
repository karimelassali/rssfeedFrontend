'use client';
import { useEffect, useState } from "react";

export default function Home() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("api/test")
      .then((res) => res.json())
      .then((data) => setData(data));
  },[])
  return (
    <div className="text-red-400">
      3
      {data ? data.laravel : "Loading..."}
    </div>
  );
}

