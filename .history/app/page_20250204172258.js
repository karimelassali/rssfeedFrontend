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
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

