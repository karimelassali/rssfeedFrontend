"use client"

import { useState, useEffect } from "react"
import { Search, Filter, PenSquare } from "lucide-react"
import { FilterModal } from "./filter-modal"
import axios from "axios"

export default function DigiNews() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('api/test')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  },[])

  const newsItems = data;

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen flex flex-col">
    <header className="sticky top-0 bg-white p-4 md:p-6 pb-4 z-10 shadow-sm">
      <h1 className="text-2xl md:text-3xl font-bold text-[#1a3b54] mb-4">DIGINEWS</h1>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5"></div>
          <input type="search" placeholder="Cerca..." className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button className="p-2 rounded-full bg-[#1a3b54]">
          <div className="h-5 w-5 text-white"></div>
        </button>
      </div>
    </header>
  
    <div className="flex-1 p-4 md:p-6 pt-0 overflow-y-auto">
      <div className="space-y-6">
        <article className="border-b border-gray-200 pb-6 last:border-0 relative">
          <div className="flex items-start gap-3">
            <div className="bg-green-500 text-white p-1.5 rounded text-sm font-medium min-w-[28px] text-center">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1 truncate">Source</p>
              <h2 className="text-base font-semibold mb-2 line-clamp-2">Title</h2>
              <p className="text-sm text-gray-500 truncate">Time</p>
            </div>
            <button className="bg-green-400 p-1.5 rounded-lg">
              <div className="h-4 w-4 text-white"></div>
            </button>
          </div>
          <span className="absolute top-0 right-0 bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-sm">
            Pubblicata
          </span>
        </article>
      </div>
    </div>
  </div>
  );
}