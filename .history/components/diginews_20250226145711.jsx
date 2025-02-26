import { useState, useEffect } from "react";
import { Search, Filter, XCircle, X  , PenSquare, Loader2, ChevronDown, ChevronUp, Star } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Toaster , toast } from "sonner";
import DigiNewsSkeleton from "./ui/skeletons/diginews";

// Lazy load the FilterModal component
const FilterModal = dynamic(() => import('./filter-modal').then(mod => ({ default: mod.FilterModal })), {
  loading: () => <div className="animate-pulse">Loading...</div>
});

export default function DigiNews() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageSize, setPageSize] = useState(10);



  // Reset to first page when filters or search change
  useEffect(() => {
    setPage(1);
  }, [activeFilters, searchQuery]);
  // Fetch data when page, filters, or search changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingMore(page > 1);
      setIsLoading(page === 1);

      try {
        const response = await axios.get(`/api/articles`, {
          params: {
            page,
            pageSize,
            activeFilters,
          },
        });

        const newData = response.data.data;
        // Filter sources that start with https://
        const filteredData = newData.filter(item => item.source.startsWith('https://'));
        
        // Apply search filter to the filtered data if search query exists
        const searchFilteredData = searchQuery
          ? filteredData.filter(item =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.source.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : filteredData;

        setHasMore(searchFilteredData.length >= pageSize);
        setData((prev) => (page === 1 ? searchFilteredData : [...prev, ...searchFilteredData]));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load news data");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchData();
  }, [page, pageSize, searchQuery, activeFilters]);
  // Handle "Load More" button click
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setPage((prevPage) => prevPage + 1);
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

  useEffect()

  // Calculate time difference for publication date
const getTimeDifference = (pubDate) => {
    const now = new Date();
    const published = new Date(pubDate);
    const diff = (now.getTime() - published.getTime()) / 1000;
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44); // Average month length

    // Helper function to pad numbers with leading zeros
    const padZero = (num) => String(num).padStart(2, '0');

    // Get date and time components
    const day = padZero(published.getDate());
    const month = padZero(published.getMonth() + 1);
    const year = published.getFullYear();
    const hours24 = padZero(published.getHours());
    const minutesTime = padZero(published.getMinutes());
    const seconds = padZero(published.getSeconds());

    // Full date-time format
    const dateTimeString = `${day}/${month}/${year} alle ${hours24}:${minutesTime}:${seconds}`;

    // Handle different time ranges with more precision
    if (diff < 60) { // Less than a minute
        return `${Math.floor(diff)} secondi fa (oggi alle ${hours24}:${minutesTime})`;
    } else if (days === 0) { // Same day
        if (hours > 0) {
            const remainingMinutes = minutes % 60;
            if (remainingMinutes > 0) {
                return `${hours} ${hours === 1 ? "ora" : "ore"} e ${remainingMinutes} ${remainingMinutes === 1 ? "minuto" : "minuti"} fa (oggi alle ${hours24}:${minutesTime})`;
            }
            return `${hours} ${hours === 1 ? "ora" : "ore"} fa (oggi alle ${hours24}:${minutesTime})`;
        } else {
            return `${minutes} ${minutes === 1 ? "minuto" : "minuti"} fa (oggi alle ${hours24}:${minutesTime})`;
        }
    } else if (days === 1) { // Yesterday
        return `ieri alle ${hours24}:${minutesTime}`;
    } else if (days < 7) { // Less than a week
        return `${days} ${days === 1 ? "giorno" : "giorni"} fa (${dateTimeString})`;
    } else if (weeks < 4) { // Less than a month
        return `${weeks} ${weeks === 1 ? "settimana" : "settimane"} fa (${dateTimeString})`;
    } else if (months < 12) { // Less than a year
        return `${months} ${months === 1 ? "mese" : "mesi"} fa (${dateTimeString})`;
    } else { // More than a year
        const years = Math.floor(months / 12);
        return `${years} ${years === 1 ? "anno" : "anni"} fa (${dateTimeString})`;
    }
};

  // Render content based on loading, error, or data state
  const renderContent = () => {
    if (isLoading && page === 1) {
      return <DigiNewsSkeleton />;
    }

    if (error) {
      return (
        <div role="alert" className="flex flex-col items-center justify-center p-8 text-center">
          <XCircle className="h-12 w-12 text-red-500 mb-4" aria-hidden="true" />
          <p className="text-gray-600">{error}</p>
        </div>
      );
    }

    if (data.length === 0 && (activeFilters.length > 0 || searchQuery)) {
      return (
        <div role="status" className="flex flex-col items-center justify-center p-8 text-center">
          <Toaster />
          <div className="mb-4 text-gray-400">
            <Filter className="h-12 w-12" aria-hidden="true" />
          </div>
          <p className="text-gray-600 mb-4">Nessun risultato trovato</p>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Cancella tutti i filtri"
          >
            Cancella tutto
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="sr-only" role="status" aria-live="polite">
          {data.length} articoli trovati
        </div>
        {/* {user && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg overflow-hidden">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )} */}
        {data.map((item) => (
          <article
            key={`${item.id}-${item.pubDate}`}
            className="border-b border-gray-200 pb-6 last:border-0 relative"
          >
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white p-1.5 rounded text-sm font-medium min-w-[28px] text-center" aria-hidden="true">
                {item.source.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1 truncate">
                  {item.source}
                </p>
                <h2 className="text-base font-semibold mb-2 line-clamp-1">
                  {item.title}
                </h2>
                <time dateTime={item.pubDate} className="text-sm text-gray-500 truncate">
                  {getTimeDifference(item.pubDate)}
                </time>
              </div>

              {!item.isPublished && (
                <div className="flex gap-2">
                  <Link 
                    href={`/news/${item.id}`} 
                    className="bg-green-400 p-1.5 rounded-lg"
                    aria-label={`Modifica articolo: ${item.title}`}
                  >
                    <PenSquare className="h-4 w-4 text-white" aria-hidden="true" />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Extract domain from source URL
                      const domain = new URL(item.source).hostname.replace('www.', '');
                      toast.success(`${domain} :  added to your favorite sources!`, {
                        position: "bottom-right",
                        duration: 3000,
                          style: {
                            background: "#4CAF50",
                            color: "white",
                            border: "none"
                          }
                        });
                      }}
                      className="bg-yellow-400 hover:bg-yellow-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                      aria-label="Subscribe to notifications from this source"
                      >
                      <Star className="h-4 w-4 text-white hover:scale-110 transform transition-transform" aria-hidden="true" />
                    </button>
                </div>
              )}
            </div>

            {item.isPublished === 1 && (
              <span className="absolute top-0 right-0 bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-sm">
                Pubblicata
              </span>
            )}
            
          </article>
        ))}

        {hasMore && (
          <div className="text-center mt-4">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isLoadingMore ? "Caricamento in corso..." : "Carica altri articoli"}
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  <span>Caricamento...</span>
                </>
              ) : (
                "Carica altri"
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8 pb-20 relative min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 sticky top-0 bg-white z-10 p-4 rounded-lg shadow-sm">
          <div className="relative flex-1 w-full">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca articoli..."
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              aria-label="Cerca articoli"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-gray-600"
                aria-label="Cancella ricerca"
              >
                <X className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 border border-gray-200"
              aria-label="Apri filtri"
              aria-expanded={isFilterOpen}
            >
              <Filter className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-medium">Filtri</span>
            </button>
            
            {localStorage.getItem('authToken') ? (
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-blue-600">
                  {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).email}
                </span>
              </div>
            ) : (
              <Link 
                href="/sign-in" 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 overflow-y-auto">
          {renderContent()}
        </div>
      </div>

      {isFilterOpen && (
        <FilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          initialFilters={activeFilters}
          onApply={(filters) => setActiveFilters(filters)}
        />
      )}
    </main>
  );
}