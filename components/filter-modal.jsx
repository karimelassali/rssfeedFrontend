import { ArrowLeft, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function FilterModal({
  isOpen,
  onClose,
  onApply = () => {},
  initialFilters = [],
  allSources = [], // Static list of sources
}) {
  const [selectedSources, setSelectedSources] = useState([]);
  const [availableSources, setAvailableSources] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedSources(initialFilters.map(filter => 
        typeof filter === 'object' ? filter.value : filter
      ));

      // Format and set the static sources
      const formattedSources = formatSources(allSources);
      setAvailableSources(formattedSources);
    }
  }, [isOpen, initialFilters, allSources]);

  // Helper function to format sources
  const formatSources = (sources) => {
    return sources.map(source => {
      const sourceStr = typeof source === 'string' ? source : String(source);
      let domain = sourceStr;
      let favicon = "";

      if (sourceStr.includes('://')) {
        try {
          const url = new URL(sourceStr);
          domain = url.hostname.replace('www.', '');
          favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch (e) {
          console.error("Error parsing URL:", sourceStr, e);
        }
      }

      return {
        id: sourceStr,
        name: domain || sourceStr,
        originalUrl: sourceStr,
        favicon: favicon,
      };
    });
  };

  if (!isOpen) return null;

  const handleSourceToggle = (sourceId) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleApply = () => {
    const filters = selectedSources.map(sourceId => ({
      type: 'source',
      value: sourceId,
    }));
    console.log("Applying filters:", filters);
    onApply(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setSelectedSources([]);
  };

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
          selectedSources.includes(source.id) ? "bg-green-500" : "bg-gray-400"
        }`}
      >
        {firstLetter}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 p-4">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" type="button">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold">Filtra per fonte</h2>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 p-2 text-sm bg-gray-100 rounded-full">
            {selectedSources.length > 0 ? `${selectedSources.length} Filtri` : "Nessun filtro"}
          </span>
          {selectedSources.length > 0 && (
            <button onClick={handleClearFilters} className="p-2 hover:bg-gray-100 rounded-full" type="button">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-20 max-h-[calc(100vh-180px)] overflow-y-auto">
        {availableSources.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            Nessuna fonte disponibile
          </div>
        ) : (
          availableSources.map((source) => (
            <button
              key={source.id}
              onClick={() => handleSourceToggle(source.id)}
              type="button"
              className={`p-3 rounded-full text-sm font-medium text-left flex items-center gap-2 ${
                selectedSources.includes(source.id) ? "bg-[#1a3b54] text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              {getSourceIcon(source)}
              <span className="truncate">{source.name}</span>
            </button>
          ))
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 flex gap-3 bg-white border-t">
        <button onClick={onClose} className="flex-1 py-3 border-2 rounded-full font-medium" type="button">
          Annulla
        </button>
        <button
          onClick={handleApply}
          className={`flex-1 py-3 rounded-full font-medium ${
            selectedSources.length > 0 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
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