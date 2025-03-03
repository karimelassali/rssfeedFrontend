import { useState, useEffect } from "react";
import { Search, Filter, XCircle, X, PenSquare, Loader2, ChevronDown, Star } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Toaster, toast } from "sonner";
import DigiNewsSkeleton from "./ui/skeletons/diginews";
import Cookies from "js-cookie";


// Lazy load the FilterModal component
const FilterModal = dynamic(() => import('./filter-modal').then(mod => ({ default: mod.FilterModal })), {
  loading: () => <div className="animate-pulse">Loading...</div>
});

export default function DigiNews() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [allData, setAllData] = useState([]); // All fetched data
  const [filteredData, setFilteredData] = useState([]); // Data after search/filter
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [authToken, setAuthToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    // Access localStorage only on client side
    const token = Cookies.get('authToken');
    const userStr = Cookies.get('user');
    setAuthToken(token);
    if (userStr) {
      try {
        const info = JSON.parse(userStr);
        setUserEmail(info.email);
        setUserData(info);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }else{
      window.location.href = '/sign-in';
    }
  }, []);
  
  // Apply filters and search to the data
  useEffect(() => {
    if (allData.length === 0) return;
    
    console.log("Applying filters to data:", allData.length, "items with", activeFilters.length, "filters");
    
    let results = [...allData];
    
    // Apply active filters if any
    if (activeFilters.length > 0) {
      // Log the full structure of the filters to debug
      console.log("Active filters detail:", JSON.stringify(activeFilters));
      
      results = results.filter(item => {
        // If no source, skip this item
        if (!item.source) return false;
        
        // Check if any filter matches this item
        return activeFilters.some(filter => {
          // Handle filter as object with type and value
          if (typeof filter === 'object' && filter.type === 'source' && filter.value) {
            return item.source === filter.value;
          }
          // Handle filter as string (backward compatibility)
          if (typeof filter === 'string') {
            return item.source === filter;
          }
          return false;
        });
      });
      
      // Log filtered results count for debugging
      console.log("After filtering by source, items remaining:", results.length);
    }
    
    // Apply search query if any
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(item => 
        (item.title && item.title.toLowerCase().includes(query)) || 
        (item.source && item.source.toLowerCase().includes(query))
      );
    }
    
    console.log("Filtered results:", results.length, "items");
    setFilteredData(results);
  }, [allData, searchQuery, activeFilters]);

  const fetchData = async (page = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await axios.get(`/api/articles?page=${page}`, {
        params: {
          activeFilters: JSON.stringify(activeFilters),
        },
      });

      // Log the full response for debugging
      console.log("API Response:", response.data);
      
      // Store debug info
      setDebugInfo({
        responseData: response.data,
        page
      });

      // Check if response.data has the expected structure
      if (!response.data || (!response.data.data && !Array.isArray(response.data))) {
        console.error("Unexpected response structure:", response.data);
        toast.error("Unexpected data format received", {
          position: "bottom-right",
          duration: 3000
        });
        return;
      }

      // Handle both Laravel pagination structure and direct array responses
      const newData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.data || []);
      
      // Filter sources that start with https://
      const filteredNewData = newData.filter(item => 
        item.source && typeof item.source === 'string' && item.source.startsWith('https://')
      );

      if (isLoadMore) {
        // Append new data to existing data
        setAllData(prevData => [...prevData, ...filteredNewData]);
      } else {
        // Replace existing data for first page
        setAllData(filteredNewData);
      }
      
      console.log("Filtered data length:", filteredNewData.length);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load news data: " + (err.message || "Unknown error"));
      toast.error(`Failed to ${isLoadMore ? "load more" : "load"} data: ${err.message || "Unknown error"}`, {
        position: "bottom-right",
        duration: 3000
      });
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  // Fetch initial data
  useEffect(() => {
    setCurrentPage(1);
    fetchData(1, false);
  }, [activeFilters]); // Only refetch when filters change, not on search

  // Clear search and filters
  const handleClearAll = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchData(nextPage, true);
  };

  // Extract domain from URL
  const getDomainFromUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    
    try {
      if (url.includes('://')) {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
      }
      return url;
    } catch (e) {
      console.error("Error extracting domain:", e);
      return url;
    }
  };

  // Get favicon for a domain
  const getFavicon = (url) => {
    const domain = getDomainFromUrl(url);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  };

  // Calculate time difference for publication date
  const getTimeDifference = (pubDate) => {
    const now = new Date();
    const published = new Date(pubDate);

    // Handle future dates by taking absolute value
    const diffSeconds = Math.abs((now.getTime() - published.getTime()) / 1000);
    const isFuture = published > now;
    const prefix = isFuture ? "Tra " : "";

    // Helper function to pad numbers with leading zeros
    const padZero = (num) => String(num).padStart(2, '0');

    // Get date and time components for published date
    const day = padZero(published.getDate());
    const month = padZero(published.getMonth() + 1);
    const year = published.getFullYear();
    const hours24 = padZero(published.getHours());
    const minutesTime = padZero(published.getMinutes());
    const dateTimeString = `${day}/${month}/${year} alle ${hours24}:${minutesTime}`;

    // Determine if published date is today
    const isToday = now.getFullYear() === published.getFullYear() &&
        now.getMonth() === published.getMonth() &&
        now.getDate() === published.getDate();

    // Determine if published date is yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = published.getFullYear() === yesterday.getFullYear() &&
        published.getMonth() === yesterday.getMonth() &&
        published.getDate() === yesterday.getDate();

    // Calculate the difference in full calendar days
    const publishedMidnight = new Date(published.getFullYear(), published.getMonth(), published.getDate());
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.floor((nowMidnight - publishedMidnight) / (1000 * 60 * 60 * 24));

    // Calculate the number of full calendar months
    const getCalendarMonths = () => {
        let months = (now.getFullYear() - published.getFullYear()) * 12;
        months += now.getMonth() - published.getMonth();
        if (now.getDate() < published.getDate()) {
            months--;
        }
        return months;
    };
    const months = getCalendarMonths();

    // Calculate the number of full calendar years
    const getCalendarYears = () => {
        let years = now.getFullYear() - published.getFullYear();
        if (now.getMonth() < published.getMonth() ||
            (now.getMonth() === published.getMonth() && now.getDate() < published.getDate())) {
            years--;
        }
        return years;
    };
    const years = getCalendarYears();

    // Handle time differences
    if (diffSeconds < 60) {
        return `${prefix}${Math.floor(diffSeconds)} ${Math.floor(diffSeconds) === 1 ? "secondo" : "secondi"}${isFuture ? "" : " fa"} (${isToday ? `oggi alle ${hours24}:${minutesTime}` : dateTimeString})`;
    } else if (isToday) {
        const totalMinutes = Math.floor(diffSeconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0) {
            if (minutes > 0) {
                return `${prefix}${hours} ${hours === 1 ? "ora" : "ore"} e ${minutes} ${minutes === 1 ? "minuto" : "minuti"}${isFuture ? "" : " fa"} (oggi alle ${hours24}:${minutesTime})`;
            }
            return `${prefix}${hours} ${hours === 1 ? "ora" : "ore"}${isFuture ? "" : " fa"} (oggi alle ${hours24}:${minutesTime})`;
        } else {
            return `${prefix}${totalMinutes} ${totalMinutes === 1 ? "minuto" : "minuti"}${isFuture ? "" : " fa"} (oggi alle ${hours24}:${minutesTime})`;
        }
    } else if (isYesterday) {
        return `${prefix}ieri alle ${hours24}:${minutesTime}`;
    } else if (diffDays < 7) {
        return `${prefix}${diffDays} ${diffDays === 1 ? "giorno" : "giorni"}${isFuture ? "" : " fa"} (${dateTimeString})`;
    } else if (months < 1) {
        const weeks = Math.floor(diffDays / 7);
        return `${prefix}${weeks} ${weeks === 1 ? "settimana" : "settimane"}${isFuture ? "" : " fa"} (${dateTimeString})`;
    } else if (years < 1) {
        return `${prefix}${months} ${months === 1 ? "mese" : "mesi"}${isFuture ? "" : " fa"} (${dateTimeString})`;
    } else {
        return `${prefix}${years} ${years === 1 ? "anno" : "anni"}${isFuture ? "" : " fa"} (${dateTimeString})`;
    }
};
  // Custom source icon component
  const SourceIcon = ({ source }) => {
    const domain = getDomainFromUrl(source);
    const favicon = getFavicon(source);
    const firstLetter = domain.charAt(0).toUpperCase();
    
    return (
      <div className="relative">
        <div className="bg-green-500 text-white p-1.5 rounded text-sm font-medium min-w-[28px] h-[28px] text-center flex items-center justify-center overflow-hidden">
          <img 
            src={favicon} 
            alt={domain}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = firstLetter;
            }}
          />
          <span className="absolute opacity-0">{firstLetter}</span>
        </div>
      </div>
    );
  };

  // Render content based on loading, error, or data state
  const renderContent = () => {
    if (isLoading) {
      return <DigiNewsSkeleton />;
    }

    if (error && filteredData.length === 0) {
      return (
        <div role="alert" className="flex flex-col items-center justify-center p-8 text-center">
          <XCircle className="h-12 w-12 text-red-500 mb-4" aria-hidden="true" />
          <p className="text-gray-600">{error}</p>
        </div>
      );
    }

    if (filteredData.length === 0 && (activeFilters.length > 0 || searchQuery)) {
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
          {filteredData.length} articoli trovati
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
        
        {filteredData.map((item, index) => (
          <article
            key={`${item.id || index}-${item.pubDate || 'no-date'}`}
            className="border-b border-gray-200 pb-6 last:border-0 relative"
          >
            <div className="flex items-start gap-3">
              <SourceIcon source={item.source} />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1 truncate">
                  {getDomainFromUrl(item.source)}
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
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      const req = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/favorite_sources/store/`, {
                        source: item.source,
                        user_id: userData.id
                      });
                  
                      // Extract domain from source URL
                      const domain = getDomainFromUrl(item.source);
                      toast.success(`${req.data.message}`, {
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
        
        {allData.length > 0 && (
          <button 
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="w-full mt-4 px-6 py-3 bg-green-400 hover:bg-green-500 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>Load More Articles ({filteredData.length})</span>
                <ChevronDown className="h-5 w-5" />
              </>
            )}
          </button>
        )}
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
              {activeFilters.length > 0 && (
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFilters.length}
                </span>
              )}
            </button>
            
            {authToken ? (
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-blue-600">
                  {userEmail}
                </span>
                <Link
                href="/settings"
                className="flex items-center justify-center bg-blue-500 border border-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium text-white"
              >
                Settings
              </Link>
              </div>
            ) : (
              <>
                <Link
                href="/sign-in"
                className="flex items-center justify-center border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors text-sm font-medium"
              >
                Accedi
              </Link>
              <Link
                href="/settings"
                className="flex items-center justify-center bg-blue-500 border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium text-white"
              >
                Settings
              </Link>
              </>
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
          initialFilters={activeFilters.map(f => typeof f === 'object' ? f.value : f)} // Handle both object and string filters
          onApply={(filters) => {
            console.log("Received filters from modal:", filters);
            setActiveFilters(filters);
          }}
          currentData={allData} // Make sure this is your full dataset
        />
      )}
    </main>
  );
}