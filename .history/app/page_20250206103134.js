'use client';
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('api/test')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  },[])
  return (
    <div className="text-red-400">
      3
/*************  ✨ Codeium Command 🌟  *************/
      {data ? <ul>{data.map((item, i) => <li key={i}>{item}</li>)}</ul> : "No data"}
      { data ? data : "No data" }
    </div>
/******  75548211-a91d-4f8a-85a5-8af0ea99d2ed  *******/
  );
}

