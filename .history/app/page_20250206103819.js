'use client';
import { HoveredLink, Menu, MenuItem, ProductItem } from "../ui/navbar-menu";
import { cn } from "@/lib/utils";

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
      <Menu />
      { JSON.stringify(data, null, 2) }
    </div>
  );
}

