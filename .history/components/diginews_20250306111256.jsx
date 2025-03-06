"use client"; // For Next.js App Router

import { useState, useEffect } from "react";
import { Search, Filter, XCircle, X, PenSquare, Loader2, ChevronDown, Star } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Toaster, toast } from "sonner";
import DigiNewsSkeleton from "./ui/skeletons/diginews";
import Cookies from "js-cookie";
import { ArrowLeft, Cog } from "lucide-react";
import { LogOut } from "lucide-react";

const FilterModal = dynamic(() => import('./filter-modal').then(mod => ({ default: mod.FilterModal })), {
  loading: () => <div className="animate-pulse">Loading...</div>
});

export default function DigiNews() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [authToken, setAuthToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(3);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // New state for user menu


  const staticSources = [
    'https://appweb.regione.vda.it/DBWeb/Comunicati.nsf/RSScomunicati.xml',
    'https://www.ansa.it/valledaosta/notizie/valledaosta_rss.xml',
    'https://www.comune.aosta.it/it/events/feed',
    'https://www.comune.aosta.it/it/news/feed',
    'https://pressevda.regione.vda.it/it/events/feed',
    'https://pressevda.regione.vda.it/it/news/feed',
  ];

  useEffect(() => {
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
    } else {
      window.location.href = '/sign-in';
    }
  }, []);

  useEffect(() => {
    if (allData.length === 0) return;

    let results = [...allData];

    if (activeFilters.length > 0) {
      results = results.filter(item => {
        if (!item.source) return false;
        return activeFilters.some(filter => {
          if (typeof filter === 'object' && filter.type === 'source' && filter.value) {
            return item.source === filter.value;
          }
          if (typeof filter === 'string') {
            return item.source === filter;
          }
          return false;
        });
      });
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(item => 
        (item.title && item.title.toLowerCase().includes(query)) || 
        (item.source && item.source.toLowerCase().includes(query))
      );
    }

    setFilteredData(results);
  }, [allData, searchQuery, activeFilters]);

  const fetchData = async (page = 1, isLoadMore = false) => {
    if (isLoadMore) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      const response = await axios.get(`/api/articles?page=${page}`, {
        params: { activeFilters: JSON.stringify(activeFilters) },
      });

      console.log("API Response:", response.data);
      setDebugInfo({ responseData: response.data, page });

      const newData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      const filteredNewData = newData.filter(item => 
        item.source && typeof item.source === 'string' && item.source.startsWith('https://')
      );

      if (isLoadMore) {
        setAllData(prevData => [...prevData, ...filteredNewData]);
      } else {
        setAllData(filteredNewData);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load news data: " + (err.message || "Unknown error"));
      toast.error(`Failed to ${isLoadMore ? "load more" : "load"} data: ${err.message || "Unknown error"}`, {
        position: "bottom-right",
        duration: 3000
      });
    } finally {
      if (isLoadMore) setIsLoadingMore(false);
      else setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchData(1, false);
  }, [activeFilters]);

  const handleClearAll = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchData(nextPage, true);
  };
  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('user');
    setAuthToken(null);
    setUserData(null);
    setUserEmail(null);
    toast.success("Logout effettuato con successo", {
      position: "bottom-right",
      duration: 3000,
      style: { backgroundColor: '#34C759', color: 'white' }
    });
    window.location.href = '/sign-in';
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev);
  };

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

  const getFavicon = (url) => {
    const domain = getDomainFromUrl(url);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  };

  const getTimeDifference = (pubDate) => {
    const now = new Date();
    const published = new Date(pubDate);
    const diffSeconds = Math.abs((now.getTime() - published.getTime()) / 1000);
    const isFuture = published > now;
    const prefix = isFuture ? "Tra " : "";
    const padZero = (num) => String(num).padStart(2, '0');
    const day = padZero(published.getDate());
    const month = padZero(published.getMonth() + 1);
    const year = published.getFullYear();
    const hours24 = padZero(published.getHours());
    const minutesTime = padZero(published.getMinutes());
    const dateTimeString = `${day}/${month}/${year} alle ${hours24}:${minutesTime}`;
    const isToday = now.toDateString() === published.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = yesterday.toDateString() === published.toDateString();
    const diffDays = Math.floor(diffSeconds / (60 * 60 * 24));

    const getCalendarMonths = () => {
      let months = (now.getFullYear() - published.getFullYear()) * 12;
      months += now.getMonth() - published.getMonth();
      if (now.getDate() < published.getDate()) months--;
      return months;
    };
    const months = getCalendarMonths();

    const getCalendarYears = () => {
      let years = now.getFullYear() - published.getFullYear();
      if (now.getMonth() < published.getMonth() || 
          (now.getMonth() === published.getMonth() && now.getDate() < published.getDate())) {
        years--;
      }
      return years;
    };
    const years = getCalendarYears();

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
            aria-label="Cancella tutti i filtri e la ricerca"
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
                      const response = await axios.post('/api/favorite', { source: item.source });
                      toast(response.data.message, { 
                        duration: 3000, 
                        position: 'bottom-right', 
                        style: { backgroundColor: '#34C759', color: 'white' } 
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

        {allData.length > 0 && (
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-medium rounded-lg shadow-md hover:from-green-500 hover:to-green-600 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sticky top-0 bg-white z-10 p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 backdrop-blur-md bg-opacity-90">
          {/* Search Bar */}
          <div className="relative w-full md:flex-1">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca articoli..."
              className="w-full pl-12 pr-12 py-3 md:py-4 bg-white bg-opacity-70 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 shadow-md hover:shadow-lg text-base md:text-lg font-medium"
              aria-label="Cerca articoli"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 md:h-6 w-5 md:w-6 text-gray-500" aria-hidden="true" />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors duration-200"
                aria-label="Cancella ricerca"
              >
                <X className="h-5 md:h-6 w-5 md:w-6" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Filter and Clear Filters Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-0">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Apri filtri"
              aria-expanded={isFilterOpen}
            >
              <Filter className="h-4 md:h-5 w-4 md:w-5" aria-hidden="true" />
              <span className="text-sm font-semibold">Filtri</span>
              {activeFilters.length > 0 && (
                <span className="bg-white text-green-600 text-xs px-2 py-1 rounded-full shadow-sm">
                  {activeFilters.length}
                </span>
              )}
            </button>

            {activeFilters.length > 0 && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Cancella tutti i filtri"
              >
                <XCircle className="h-4 md:h-5 w-4 md:w-5" aria-hidden="true" />
                <span className="text-sm font-semibold">Cancella</span>
              </button>
            )}
          </div>

          {/* User Data */}
          {authToken ? (
            <div className="relative flex items-center gap-2 mt-3 md:mt-0">
              <button
                onClick={toggleUserMenu}
                className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 shadow-md hover:shadow-lg transition-all duration-300 text-green-600 font-semibold text-sm truncate max-w-[150px] hover:underline focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Opzioni utente"
                aria-expanded={isUserMenuOpen}
              >
                {userEmail}
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 flex flex-col gap-2 bg-white border border-gray-200 rounded-lg shadow-xl p-2 w-48 z-20 md:w-56">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200 text-sm font-medium"
                    aria-label="Vai al dashboard"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200 text-sm font-medium"
                    aria-label="Vai alle impostazioni"
                  >
                    <Cog className="h-4 w-4" aria-hidden="true" />
                    Impostazioni
                  </Link>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-2 md:p-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                aria-label="Logout"
              >
                <LogOut className="h-4 md:h-5 w-4 md:w-5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-0">
              <Link
                href="/sign-in"
                className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                aria-label="Accedi"
              >
                Accedi
              </Link>
              <Link
                href="/settings"
                className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                aria-label="Impostazioni"
              >
                Impostazioni
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>

      {isFilterOpen && (
        <FilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          initialFilters={activeFilters.map(f => typeof f === 'object' ? f.value : f)}
          onApply={(filters) => {
            console.log("Received filters from modal:", filters);
            setActiveFilters(filters);
          }}
          allSources={staticSources}
        />
      )}
    </main>
  );
}