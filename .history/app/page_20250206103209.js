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
      { JSON.stringify(data, null, 2) }
      { data ? data : "No data" }
/******  173be301-0d70-4ebc-a1ef-675172f1832f  *******/
    </div>
  );
}

