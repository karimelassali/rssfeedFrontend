import { useState, useEffect } from "react";
import { Search, Filter, XCircle, X, PenSquare, Loader2 } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import DigiNewsSkeleton from "./ui/skeletons/diginews";
import { FilterModal } from "./filter-modal";

export default function DigiNews() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  // Fetch data when page number changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingMore(page > 1);  // Show loading indicator when fetching more
      setIsLoading(page === 1);  // Show initial loading indicator for first page

      try {
        const response = await axios.get(`/api/test?page=${page}&pageSize=${PAGE_SIZE}`);
        const newData = response.data.data;

        if (newData.length < PAGE_SIZE) {
          setHasMore(false);  // No more data to load
        }

        // Append new data to existing data state
        setData((prevData) => {
          if (page === 1) {
            return newData;  // Replace initial data
          } else {
            return [...prevData, ...newData];  // Append new data
          }
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load news data");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchData();
  }, [page]);

  // Filtering and searching logic
  const filterAndSearchData = (items, filters, query) => {
    return items.filter((item) => {
      const domainMatch = filters.length === 0 || filters.includes(item.source);
      const searchMatch =
        !query ||
        [item.title, item.source].some((field) =>
          field.toLowerCase().includes(query.toLowerCase())
        );
      return domainMatch && searchMatch;
    });
  };

  // Apply filters and search query
  useEffect(() => {
    if (data.length > 0) {
      const filtered = filterAndSearchData(data, activeFilters, searchQuery);
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [activeFilters, searchQuery, data]);

  // Handle "Load More" button click
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setPage((prev) => prev + 1);  // Increment page number
    }
  };

  // Clear search and filters
  const handleClearAll = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const getTimeDifference = (pubDate) => {
    const diff = (new Date().getTime() - new Date(pubDate).getTime()) / 1000;
    const minutes = Math.ceil(diff / 60);
    const hours = Math.ceil(minutes / 60);
    const days = Math.ceil(hours / 24);
  
    if (days > 0) {
      return `${days} ${days === 1 ? "giorno" : "giorni"} fa`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? "ora" : "ore"} fa`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? "minuto" : "minuti"} fa`;
    } else {
      return "meno di 1 minuto fa";
    }
  };
  const renderContent = () => {
    if (isLoading && page === 1) {
      return <DigiNewsSkeleton />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <XCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      );
    }

    if (filteredData.length === 0 && (activeFilters.length > 0 || searchQuery)) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 text-gray-400">
            <Filter className="h-12 w-12" />
          </div>
          <p className="text-gray-600 mb-4">Nessun risultato trovato</p>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            Cancella tutto
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {filteredData.map((item) => (
          <article key={`${item.id}-${item.title}`} className="border-b border-gray-200 pb-6 last:border-0 relative">
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white p-1.5 rounded text-sm font-medium min-w-[28px] text-center">
                {item.source.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1 truncate">{item.source}</p>
                <h2 className="text-base font-semibold mb-2 line-clamp-1">{item.title}</h2>
                <p className="text-sm text-gray-500 truncate">
                  {
                    getTimeDifference(item.pubDate)
                  }
                </p>
              </div>

              {!item.isPublished && (
                <Link href={`/news/${item.id}`} className="bg-green-400 p-1.5 rounded-lg">
                  <PenSquare className="h-4 w-4 text-white" />
                </Link>
              )}
            </div>

            {item.isPublished === 1 && (
              <span className="absolute top-0 right-0 bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-sm">
                Pubblicata
              </span>
            )}
          </article>
        ))}

        {/* Load More Button: Show if there are more pages */}
        {hasMore && (
          <div className="text-center mt-4">
            {isLoadingMore ? (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Caricamento...</span>
              </div>
            ) : (
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-green-500 min-w-[40%] text-white rounded-lg hover:bg-green-600 transition"
              >
                Carica altri
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen flex flex-col">
      <header className="sticky top-0 pb-9 bg-white p-4 md:p-6 z-10 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a3b54] mb-4">
          DIGINEWS
        </h1>
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="search"
              placeholder="Cerca..."
              className="w-full bg-gray-100 rounded-full pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {(activeFilters.length > 0 || searchQuery) && (
              <button
                onClick={handleClearAll}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Clear all"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            )}
            <button
              className={`p-2 rounded-full ${
                activeFilters.length > 0 ? "bg-green-500" : "bg-[#1a3b54]"
              }`}
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6">{renderContent()}</div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
    </div>
  );
}
