import { useState, useEffect } from "react"
import { Search, Filter, PenSquare, XCircle, X } from "lucide-react"
import { FilterModal } from "./filter-modal"
import axios from "axios"
import Link from "next/link"
import DigiNewsSkeleton from "./ui/skeletons/diginews"

export default function DigiNews() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState([])
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch initial data
  useEffect(() => {
    setIsLoading(true)
    axios.get('api/test')
      .then(response => {
        setData(response.data)
        setFilteredData(response.data)
        setError(null)
      })
      .catch(error => {
        console.error(error)
        setError('Failed to load news data')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // Extract domain name with improved error handling
  const getDomainName = (url) => {
    try {
      const hostname = new URL(url).hostname
      const domain = hostname.replace(/^www\./, '').split('.')[0]
      return domain.toLowerCase()
    } catch (error) {
      console.error('Invalid URL:', url)
      return ''
    }
  }

  // Combined search and filter function
  const filterAndSearchData = (items, filters, query) => {
    return items.filter(item => {
      // Source filter check
      const domainMatch = filters.length === 0 || filters.includes(getDomainName(item.source))
      
      // Search query check (if query exists)
      const searchMatch = !query || [
        item.title,
        item.source,
        // Add any other fields you want to search through
      ].some(field => 
        field?.toLowerCase().includes(query.toLowerCase())
      )

      return domainMatch && searchMatch
    })
  }

  // Update filtered data when filters or search change
  useEffect(() => {
    if (data.length > 0) {
      const filtered = filterAndSearchData(data, activeFilters, searchQuery)
      setFilteredData(filtered)
    }
  }, [activeFilters, searchQuery, data])

  // Handler for applying filters
  const handleApplyFilters = (selectedSources) => {
    setActiveFilters(selectedSources)
  }

  // Handler for clearing all filters and search
  const handleClearAll = () => {
    setActiveFilters([])
    setSearchQuery("")
  }

  // Handler for clearing just search
  const handleClearSearch = () => {
    setSearchQuery("")
  }

  // Render content based on state
  const renderContent = () => {
    if (isLoading) {
      return <DigiNewsSkeleton />
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <XCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      )
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
      )
    }

    return (
      <div className="space-y-6">
        {filteredData.map((item) => (
          <article key={item.id} className="border-b border-gray-200 pb-6 last:border-0 relative">
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white p-1.5 rounded text-sm font-medium min-w-[28px] text-center">
                {getDomainName(item.source).charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1 truncate">{item.source}</p>
                <h2 className="text-base font-semibold mb-2 line-clamp-1">{item.title}</h2>
                <p className="text-sm text-gray-500 truncate">
                  {new Intl.RelativeTimeFormat("it").format(
                    Math.ceil((new Date().getTime() - new Date(item.pubDate).getTime()) / 1000 / 60),
                    "minutes"
                  )}
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
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen flex  flex-col">
      <header className="sticky top-0 pb-9 bg-white p-4 md:p-6  z-10 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a3b54] mb-4">DIGINEWS</h1>
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
              className={`p-2 rounded-full ${activeFilters.length > 0 ? "bg-green-500" : "bg-[#1a3b54]"}`}
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
        {(activeFilters.length > 0 || searchQuery) && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {activeFilters.length > 0 && (
              <span className="text-sm text-gray-500">
                Filtri attivi: {activeFilters.length}
              </span>
            )}
            {searchQuery && (
              <span className="text-sm text-gray-500">
                Ricerca: "{searchQuery}"
              </span>
            )}
          </div>
        )}
      </header>

      <div className="flex-1 p-4 md:p-6 pt-0 overflow-y-auto">
        {renderContent()}
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={activeFilters}
      />
    </div>
  );
}