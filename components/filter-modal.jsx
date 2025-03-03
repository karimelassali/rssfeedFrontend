import { ArrowLeft, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function FilterModal({
  isOpen,
  onClose,
  onApply = () => {}, 
  initialFilters = [],
  currentData = [] // Current data from DigiNews
}) {
  const [selectedSources, setSelectedSources] = useState([]);
  const [availableSources, setAvailableSources] = useState([]);
  const prevIsOpenRef = useRef(isOpen);

  // For debugging - log data when the modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("FilterModal - Current Data:", currentData);
      console.log("FilterModal - Initial Filters:", initialFilters);
    }
  }, [isOpen, currentData, initialFilters]);

  // Process current data to extract unique sources when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset selected sources to initial filters
      setSelectedSources(initialFilters);
      
      // Ensure we have data and log it
      if (currentData && currentData.length > 0) {
        console.log("Processing data for sources, items:", currentData.length);
        
        // Extract all sources first for debugging
        const allSources = currentData.map(item => item.source);
        console.log("All sources:", allSources);
        
        // Extract unique sources from current data - handle all possible formats
        const uniqueSources = [...new Set(
          currentData
            .filter(item => item.source && typeof item.source === 'string')
            .map(item => item.source)
        )];
        
        console.log("Unique sources found:", uniqueSources);
        
        // Transform sources into the format we need
        const formattedSources = uniqueSources.map(source => {
          // Extract domain from URL if it looks like a URL
          let domain = source;
          let favicon = "";
          
          if (source.includes('://')) {
            try {
              const url = new URL(source);
              domain = url.hostname.replace('www.', '');
              // Add favicon URL
              favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
            } catch (e) {
              console.error("Error parsing URL:", source, e);
              // Keep original if URL parsing fails
            }
          }
          
          return {
            id: source,
            name: domain || source, // Fallback to original source if domain extraction fails
            originalUrl: source,
            favicon: favicon
          };
        });
        
        console.log("Formatted sources:", formattedSources);
        setAvailableSources(formattedSources);
      } else {
        console.warn("No data available for filtering");
        setAvailableSources([]);
      }
    }
  }, [isOpen, initialFilters, currentData]);

  if (!isOpen) return null;

  const handleSourceToggle = (sourceId) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleApply = () => {
    // Transform the selected source IDs into filter objects
    const filters = selectedSources.map(sourceId => ({
      type: 'source',
      value: sourceId
    }));
    
    console.log("Applying filters:", filters);
    onApply(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setSelectedSources([]);
  };

  // Function to get first letter or icon with fallback
  const getSourceIcon = (source) => {
    const firstLetter = source.name.charAt(0).toUpperCase();
    
    if (source.favicon) {
      return (
        <div className="w-6 h-6 flex items-center justify-center rounded overflow-hidden">
          <img 
            src={source.favicon} 
            alt={`${source.name} icon`} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = firstLetter;
            }}
          />
        </div>
      );
    }
    
    return (
      <div
        className={`w-6 h-6 flex items-center justify-center rounded ${
          selectedSources.includes(source.id)
            ? "bg-green-500"
            : "bg-gray-400"
        }`}
      >
        {firstLetter}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 p-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
          type="button"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold">Filtra per fonte</h2>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 p-2 text-sm bg-gray-100 rounded-full">
            {selectedSources.length > 0
              ? `${selectedSources.length} Filtri`
              : "Nessun filtro"}
          </span>
          {selectedSources.length > 0 && (
            <button
              onClick={handleClearFilters}
              className="p-2 hover:bg-gray-100 rounded-full"
              type="button"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Debug info section - can be removed in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 p-2 mb-4 rounded text-xs">
          <details>
            <summary>Debug Info</summary>
            <div>Current Data Count: {currentData?.length || 0}</div>
            <div>Available Sources: {availableSources?.length || 0}</div>
            <div>Selected Sources: {selectedSources?.length || 0}</div>
          </details>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-20 max-h-[calc(100vh-180px)] overflow-y-auto">
        {availableSources.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            Nessuna fonte disponibile
            <p className="text-xs mt-2">Assicurati che ci siano dati caricati.</p>
          </div>
        ) : (
          availableSources.map((source) => (
            <button
              key={source.id}
              onClick={() => handleSourceToggle(source.id)}
              type="button"
              className={`p-3 rounded-full text-sm font-medium text-left flex items-center gap-2 ${
                selectedSources.includes(source.id)
                  ? "bg-[#1a3b54] text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {getSourceIcon(source)}
              <span className="truncate">{source.name}</span>
            </button>
          ))
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 flex gap-3 bg-white border-t">
        <button
          onClick={onClose}
          className="flex-1 py-3 border-2 rounded-full font-medium"
          type="button"
        >
          Annulla
        </button>
        <button
          onClick={handleApply}
          className={`flex-1 py-3 rounded-full font-medium ${
            selectedSources.length > 0
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          disabled={selectedSources.length === 0}
          type="button"
        >
          Applica
        </button>
      </div>
    </div>
  );
}