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
/*************  ✨ Codeium Command 🌟  *************/
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {Json.stringify(data)}
    </div>
/******  683f66c4-7220-4810-a8d8-a41ada90a8bb  *******/
  );
}

