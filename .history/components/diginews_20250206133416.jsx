"use client"

import { useState } from "react"
import { Search, Filter, PenSquare } from "lucide-react"
import { FilterModal } from "./filter-modal"
import axios from "axios"
import { useEffect } from "react"

export default function DigiNews() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('api/test')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  },[])

  // Generate more news items for scrolling
  // const newsItems = [...Array(20)].map((_, i) => ({
  //   id: i,
  //   source: "Ansa Valle d'Aosta",
  //   title: "Due donne e un bambino investiti a Sarre, anziana è grave",
  //   time: "3 ore fa",
  //   published: i === 1,
  // }))
  const  newsItems = data;

  return (
    (<div className="max-w-2xl mx-auto bg-white min-h-screen flex flex-col">
      {/* Fixed Header */}
      <header className="sticky top-0 bg-white p-4 md:p-6 pb-4 z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a3b54] mb-4">DIGINEWS</h1>

        {/* Search Bar */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="search"
              placeholder="Cerca..."
              className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button
            className={`p-2 rounded-full ${activeFilters.length > 0 ? "bg-green-500" : "bg-[#1a3b54]"}`}
            onClick={() => setIsFilterOpen(true)}>
            <Filter className="h-5 w-5 text-white" />
          </button>
        </div>
      </header>
      {/* Scrollable News List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-0">
        <div className="space-y-6">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="border-b border-gray-200 pb-6 last:border-0 overflow-hidden brea relative">
              <div className="flex items-start gap-3">
                {/* Source Icon */}
                <div
                  className="bg-green-500 text-white p-1.5 rounded text-sm font-medium min-w-[28px] text-center">
                  A
                </div>

                <div className="flex-1">
                  {/* Source */}
                  <p className="text-sm font-medium mb-1">{item.source}</p>

                  {/* Title */}
                  <h2 className="text-base font-semibold mb-2 break-words">{item.title}</h2>

                  {/* Time */}
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>

                {/* Action Button */}
                {!item.published && (
                  <button className="bg-green-400 p-1.5 rounded-lg">
                    <PenSquare className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>

              {/* Published Tag */}
              {item.published && (
                <span
                  className="absolute top-0 right-0 bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-sm">
                  Pubblicata
                </span>
              )}
            </article>
          ))}
        </div>
      </div>
      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={setActiveFilters} />
    </div>)
  );
}

