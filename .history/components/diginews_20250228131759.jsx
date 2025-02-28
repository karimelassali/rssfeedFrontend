import { useState, useEffect } from "react";
import { Search, Filter, XCircle, X, PenSquare, Loader2, ChevronDown, ChevronUp, Star } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Toaster, toast } from "sonner";
import DigiNewsSkeleton from "./ui/skeletons/diginews";
import { useAllData, useFilteredData } from "./context/data";

// Lazy load the FilterModal component
const FilterModal = dynamic(() => import('./filter-modal').then(mod => ({ default: mod.FilterModal })), {
  loading: () => <div className="animate-pulse">Loading...</div>
});

export default function DigiNews() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [authToken, setAuthToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [loadMorePage , setLoadMorePage] = useState(1);  
  useEffect(() => {
    // Access localStorage only on client side
    const token = window.localStorage.getItem('authToken');
    const userStr = window.localStorage.getItem('user');
    setAuthToken(token);
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUserEmail(userData.email);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);
  
  // Reset data when filters or search change
  useEffect(() => {
    setData([]); // Clear existing data when filters or search changes
  }, [activeFilters, searchQuery]);
  
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const fetchData = async () => {
    setIsLoading(true);
  
    try {
      const response = await axios.get(`/api/articles?page=${loadMorePage}`, {
        params: {
          activeFilters: JSON.stringify(activeFilters)
        },
      });
  
      console.log("API Response:", response.data);
      
      setDebugInfo({
        responseData: response.data
      });
  
      if (!response.data || (!response.data.data && !Array.isArray(response.data))) {
        console.error("Unexpected response structure:", response.data);
        toast.error("Unexpected data format received", {
          position: "bottom-right",
          duration: 3000
        });
        return;
      }
  
      const newData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.data || []);
      
      const filteredData = newData.filter(item => 
        item.source && typeof item.source === 'string' && item.source.startsWith('https://')
      );
  
      setAllData(filteredData);
      filterDataBySearch(filteredData, searchQuery);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load news data: " + (err.message || "Unknown error"));
      toast.error("Failed to load more data: " + (err.message || "Unknown error"), {
        position: "bottom-right",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };
  const filterDataBySearch = (dataToFilter, query) => {
    if (!query) {
      setFilteredData(dataToFilter);
      return;
    }
  
    const lowercaseQuery = query.toLowerCase();
    const filtered = dataToFilter.filter(item => 
      (item.title && item.title.toLowerCase().includes(lowercaseQuery)) ||
      (item.source && item.source.toLowerCase().includes(lowercaseQuery))
    );
  
    setFilteredData(filtered);
  };
  
  useEffect(() => {
    filterDataBySearch(allData, searchQuery);
  }, [searchQuery]);
  
  useEffect(() => {
    setAllData([]); // Clear existing data when filters change
    setFilteredData([]);
    setLoadMorePage(1);
    fetchData();
  }, [activeFilters]);
  const handleLoadMore = () => {
    setLoadMorePage(prevPage => prevPage + 1);
    fetchData();
  };
  // Render content based on loading, error, or data state
  const renderContent = () => {
    if (isLoading) {
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
        
        {/* Show debugging info in dev environment */}
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <div className="p-4 bg-gray-100 rounded-lg mb-4 text-xs overflow-auto max-h-40">
            <details>
              <summary className="cursor-pointer font-bold">Debug Info</summary>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </details>
          </div>
        )}
        
        {data.map((item, index) => (
          <article
            key={`${item.id || index}-${item.pubDate || 'no-date'}`}
            className="border-b border-gray-200 pb-6 last:border-0 relative"
          >
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white p-1.5 rounded text-sm font-medium min-w-[28px] text-center" aria-hidden="true">
                {item.source && item.source.charAt(0).toUpperCase()}
              </div>
  
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1 truncate">
                  {item.source}
                </p>
                <h2 className="text-base font-semibold mb-2 line-clamp-1">
                  {item.title}
                </h2>
                {item.pubDate && (
                  <time dateTime={item.pubDate} className="text-sm text-gray-500 truncate">
                    {getTimeDifference(item.pubDate)}
                  </time>
                )}
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
                      try {
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
                      } catch (err) {
                        console.error("Error processing source URL:", err);
                        toast.error("Invalid source URL", {
                          position: "bottom-right",
                          duration: 3000
                        });
                      }
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
        <button 
          onClick={() => handleLoadMore()}
          className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-5 w-5" />
              <span>Load More Articles</span>
            </>
          )}
        </button>
  
      </div>
    );
  };
  return (
    <main className="container mx-auto px-4 py-8 pb-20 relative min-h-screen bg-gray-50">
      <Toaster />
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
            
            {authToken ? (
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-blue-600">
                  {userEmail}
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