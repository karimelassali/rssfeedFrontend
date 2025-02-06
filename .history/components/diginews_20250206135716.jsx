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
    <div class="max-w-2xl mx-auto bg-white min-h-screen flex flex-col animate-pulse">
    <header class="sticky top-0 bg-white p-4 md:p-6 pb-4 z-10 shadow-sm">
        <div class="h-8 bg-gray-200 rounded mb-4"></div>

        <div class="relative flex items-center gap-2">
            <div class="relative flex-1">
                <div class="h-5 w-5 bg-gray-200 rounded full"></div>
                <div class="w-full h-6 bg-gray-200 rounded-full pl-10 pr-4 py-2 mb-2"></div>
            </div>
            <div class="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
    </header>

    <div class="flex-1 p-4 md:p-6 pt-0 overflow-y-auto">
        <div class="space-y-6">
            <div class="h-16 bg-gray-200 rounded mb-6"></div>
            <div class="h-16 bg-gray-200 rounded mb-6"></div>
            <div class="h-16 bg-gray-200 rounded mb-6"></div>
            <!--... more items ...-->
        </div>
    </div>

    <!-- Filter Modal -->
    <div class="h-64 w-full bg-gray-200 rounded"></div>
</div>
  );
}