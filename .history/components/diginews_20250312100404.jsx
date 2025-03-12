"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Filter, XCircle, X, PenSquare, Loader2, ChevronDown, Star, ArrowLeft, Cog, LogOut, User } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Toaster, toast } from "sonner";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";

const FilterModal = dynamic(() => import('./filter-modal').then(mod => ({ default: mod.FilterModal })), {
  loading: () => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md mx-4 animate-pulse">
        <div className="flex items-center justify-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-green-100"></div>
          <div className="ml-4 w-full">
            <div className="h-4 bg-green-100 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-green-50 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  ),
});

const DigiNewsSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-start gap-3 p-2 animate-pulse">
        <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function DigiNews() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [feeds, setFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [authToken, setAuthToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 1 });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const userMenuRef = useRef(null);
  const inputRef = useRef(null);

  const staticSources = [
    'https://appweb.regione.vda.it/DBWeb/Comunicati.nsf/RSScomunicati.xml',
    'https://www.ansa.it/valledaosta/notizie/valledaosta_rss.xml',
    'https://www.comune.aosta.it/it/events/feed',
    'https://www.comune.aosta.it/it/news/feed',
    'https://pressevda.regione.vda.it/it/events/feed',
    'https://pressevda.regione.vda.it/it/news/feed',
  ];

  // Detect if the device is a laptop (screen width >= 1024px)
  const [isLaptop, setIsLaptop] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => setIsLaptop(window.innerWidth >= 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Search debounce effect
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Authentication check
  useEffect(() => {
    const token = Cookies.get('authToken');
    const userStr = Cookies.get('user');
    setAuthToken(token);
    try {
      if (userStr) {
        const info = JSON.parse(userStr);
        setUserEmail(info.email);
        setUserData(info);
      } else {
        toast.info("Sessione scaduta, effettua l'accesso", { position: "top-center", duration: 3000 });
        setTimeout(() => window.location.href = '/sign-in', 1500);
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
      toast.error("Errore nei dati utente, reindirizzamento...", { position: "top-center", duration: 3000 });
      setTimeout(() => window.location.href = '/sign-in', 1500);
    }
  }, []);

  // Fetch data
  const fetchData = useCallback(async (page = 1, isLoadMore = false) => {
    if (!authToken) return;
    if (isLoadMore) setIsLoadingMore(true);
    else setIsLoading(true);
    try {
      const backendUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}api/data`);
      backendUrl.searchParams.append('page', page);
      backendUrl.searchParams.append('pageSize', pagination.pageSize);
      if (searchQuery) backendUrl.searchParams.append('search', searchQuery);
      if (Object.keys(activeFilters).length > 0) {
        backendUrl.searchParams.append('activeFilters', JSON.stringify(activeFilters));
      }
      backendUrl.searchParams.append('_t', Date.now());

      const response = await axios.get(backendUrl.toString(), {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });

      const { data, pagination: pagData } = response.data;
      const newData = Array.isArray(data) ? data : [];
      if (isLoadMore) setFeeds(prev => [...prev, ...newData]);
      else setFeeds(newData);
      setPagination(prev => ({ ...prev, page, totalPages: pagData?.total_pages || 1 }));
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Unknown error";
      setError(`Failed to ${isLoadMore ? "load more" : "load"} data: ${errMsg}`);
      toast.error(`Errore: ${errMsg}`, { position: "bottom-right", duration: 3000 });
    } finally {
      if (isLoadMore) setIsLoadingMore(false);
      else setIsLoading(false);
    }
  }, [authToken, pagination.pageSize, searchQuery, activeFilters]);

  useEffect(() => {
    fetchData(1, false);
  }, [fetchData]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  // Keyboard shortcut for search (Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleClearAll = () => {
    setActiveFilters({});
    setSearchQuery("");
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
    toast.success("Filtri rimossi", { position: "bottom-right", duration: 2000, style: { backgroundColor: '#34C759', color: 'white' } });
  };

  const handleLoadMore = () => {
    const nextPage = pagination.page + 1;
    if (nextPage <= pagination.totalPages) fetchData(nextPage, true);
  };

  const handleLogout = () => {
    if (confirm("Vuoi davvero effettuare il logout?")) {
      Cookies.remove('authToken');
      Cookies.remove('user');
      setAuthToken(null);
      setUserData(null);
      setUserEmail(null);
      toast.success("Logout completato", { position: "bottom-right", duration: 2000, style: { backgroundColor: '#34C759', color: 'white' } });
      setTimeout(() => window.location.href = '/sign-in', 1000);
    }
  };

  const handleFilterApply = (filters) => {
    const newFilters = {};
    if (filters.length > 0) newFilters.source = filters[0].value;
    setActiveFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    setIsFilterOpen(false);
    if (filters.length > 0) {
      toast.success(`Filtro applicato: ${filters[0].value.split('/').pop()}`, {
        position: "bottom-right",
        duration: 2000,
        style: { backgroundColor: '#34C759', color: 'white' },
      });
    }
  };

  // Utility functions
  const getDomainFromUrl = (url) => url && typeof url === 'string' ? new URL(url).hostname.replace('www.', '') : '';
  const getFavicon = (url) => url == 'https://appweb.regione.vda.it/DBWeb/Comunicati.nsf/RSScomunicati.xml'? 'https://cdn-icons-png.flaticon.com/128/4552/4552937.png' : `https://www.google.com/s2/favicons?domain=${getDomainFromUrl(url)}&sz=128`;

  const getTimeDifference = (pubDate) => {
    const now = new Date();
    const published = new Date(pubDate);
    const diffSeconds = Math.abs((now - published) / 1000);
    const isFuture = published > now;
    const prefix = isFuture ? "Tra " : "";
    const padZero = (num) => String(num).padStart(2, '0');
    const dateTimeString = `${padZero(published.getDate())}/${padZero(published.getMonth() + 1)}/${published.getFullYear()} alle ${padZero(published.getHours())}:${padZero(published.getMinutes())}`;
    const isToday = now.toDateString() === published.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === published.toDateString();
    const diffDays = Math.floor(diffSeconds / (60 * 60 * 24));

    if (diffSeconds < 60) return `${prefix}${Math.floor(diffSeconds)} secondi${isFuture ? "" : " fa"} (${isToday ? "oggi" : dateTimeString})`;
    const totalMinutes = Math.floor(diffSeconds / 60);
    if (isToday) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return hours > 0 ? `${prefix}${hours} ore${minutes > 0 ? ` e ${minutes} minuti` : ""}${isFuture ? "" : " fa"}` : `${prefix}${totalMinutes} minuti${isFuture ? "" : " fa"}`;
    }
    if (isYesterday) return `${prefix}ieri`;
    if (diffDays < 7) return `${prefix}${diffDays} giorni${isFuture ? "" : " fa"}`;
    return dateTimeString;
  };

  const SourceIcon = ({ source }) => {
    const domain = getDomainFromUrl(source);
    const favicon = getFavicon(source);
    return (
      <div className="relative bg-gradient-to-br from-green-500 to-green-600 text-white p-1.5 rounded-lg shadow-md w-8 h-8 flex items-center justify-center overflow-hidden">
        <img src={favicon} alt={domain} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
        <span className="absolute text-sm font-medium" style={{ opacity: favicon ? 0 : 1 }}>{domain.charAt(0).toUpperCase()}</span>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) return <DigiNewsSkeleton />;
    if (error && feeds.length === 0) return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-600">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <p>{error}</p>
        <button onClick={() => fetchData(1, false)} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all">Riprova</button>
      </div>
    );
    if (feeds.length === 0 && (Object.keys(activeFilters).length > 0 || searchQuery)) return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-600">
        <Filter className="h-12 w-12 text-gray-400 mb-4" />
        <p>Nessun risultato trovato</p>
        <button onClick={handleClearAll} className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all">Cancella tutto</button>
      </div>
    );

    return (
      <div className="space-y-4">
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <details className="p-4 bg-gray-100 rounded-lg text-xs"><summary>Debug Info</summary><pre>{JSON.stringify(debugInfo, null, 2)}</pre></details>
        )}
        <AnimatePresence>
          {feeds.map((item, index) => (
            <motion.article
              key={`${item.id || index}-${item.pubDate || 'no-date'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="border-b border-gray-200 pb-4 hover:bg-gray-50 rounded-lg p-3 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <SourceIcon source={item.source} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600">{getDomainFromUrl(item.source)}</p>
                  <h2 className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors">{item.title}</h2>
                  <div className="flex items-center gap-2">
                    {item.pubDate && <time className="text-xs text-gray-500">{getTimeDifference(item.pubDate)}</time>}
                    {item.isPublished == 1 && (
                      <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">Pubblicato</span>
                    )}
                  </div>
                </div>
                {!item.isPublished && (
                  <div className="flex gap-2">
                    <Link href={`/news/${item.id}`} className="relative p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 group">
                      <PenSquare className="h-4 w-4" />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">Modifica</span>
                    </Link>
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/favorite_sources/store`, {user_id: userData.id, source: item.source }, {
                          headers: { 'Authorization': `Bearer ${authToken}` },
                        });
                        response.data.type && response.data.type === 'success' && toast.success(response.data.message, { style: { backgroundColor: '#34C759', color: 'white' } });
                        response.data.type && response.data.type === 'warning' && toast.warning(response.data.message, { style: { backgroundColor: '#F7DC6F', color: 'black' } });
                      }}
                      className="relative p-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 group"
                    >
                      <Star className="h-4 w-4" />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">Preferito</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
        {pagination.page < pagination.totalPages && (
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="w-full md:w-1/2 mx-auto mt-6 px-6 py-3 bg-green-500 text-white rounded-full flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-green-600 transition-all"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Caricamento...
              </>
            ) : (
              <>
                Carica altri ({feeds.length}) <ChevronDown className="h-5 w-5" />
              </>
            )}
          </motion.button>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Toaster />
      {/* Enhanced Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-md rounded-b-xl p-4 md:p-6 "
      >
       <div className="container mx-auto px-4 py-3">
  <div className="bg-white rounded-xl shadow-md max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
    {/* Search Bar */}
    <div className="relative w-full max-w-xl flex-grow">
      <motion.input
        ref={inputRef}
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        placeholder="Cerca articoli..."
        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 shadow-sm text-gray-800 placeholder-gray-400"
        aria-label="Cerca articoli"
        whileFocus={{ scale: 1.01 }}
      />
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${searchFocused ? 'text-green-500' : 'text-gray-400'}`} />
      <AnimatePresence>
        {searchQuery && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsFilterOpen(true)}
        className="relative flex items-center justify-center px-4 py-2.5 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-all flex-1 sm:flex-auto"
      >
        <Filter className="h-4 w-4" />
        <span className="ml-2 font-medium">Filtri</span>
        {Object.keys(activeFilters).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {Object.keys(activeFilters).length}
          </span>
        )}
      </motion.button>

      {Object.keys(activeFilters).length > 0 && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleClearFilters}
          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex-1 sm:flex-auto font-medium"
        >
          Cancella
        </motion.button>
      )}

      {authToken ? (
        <div className="relative flex-1 sm:flex-auto" ref={userMenuRef}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            onClick={() => setIsUserMenuOpen(prev => !prev)}
            className="w-[20%] h-[20%] flex items-center justify-center sm:justify-start  bg-green-50 border border-green-200 rounded-full  text-green-600 font-medium hover:bg-green-100 transition-all"
          >
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
              {userEmail?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:inline truncate max-w-[120px]">{userEmail}</span>
          </motion.button>
          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20"
              >
                <div className="px-3 py-2 text-gray-600 text-sm border-b border-gray-200">
                  <p className="font-medium">{userEmail}</p>
                  <p className="text-xs opacity-75">Utente autenticato</p>
                </div>
                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md">
                  <ArrowLeft className="h-4 w-4" /> Dashboard
                </Link>
                <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md">
                  <User className="h-4 w-4" /> Profilo
                </Link>
                <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md">
                  <Cog className="h-4 w-4" /> Impostazioni
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-left"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Link href="/sign-in" className="px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex-1 sm:flex-auto text-center font-medium">
          Accedi
        </Link>
      )}
    </div>
  </div>
      </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        {isLoading && (
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 animate-progress"></div>
          </div>
        )}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">{renderContent()}</div>

        {isFilterOpen && (
          <FilterModal
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            initialFilters={Object.values(activeFilters)}
            onApply={handleFilterApply}
            allSources={staticSources}
          />
        )}
      </div>
    </main>
  );
}

// Custom Tailwind animation for progress bar
const styles = `
  @keyframes progress {
    0% { width: 0%; }
    50% { width: 75%; }
    100% { width: 100%; }
  }
  .animate-progress {
    animation: progress 2s infinite;
  }
`;
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}