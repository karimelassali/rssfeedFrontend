import { ArrowLeft, X } from "lucide-react";
import { useState, useEffect } from "react";

const NEWS_SOURCES = [
  { id: "ansa", name: "Ansa Valle d'Aosta" },
  { id: "stampa", name: "La Stampa" },
  { id: "aostasera", name: "Aostasera" },
  { id: "gazzetta", name: "Gazzetta Matin" },
  { id: "cronaca", name: "Aosta Cronaca" },
  { id: "news24", name: "AostaNews 24" },
];

export function FilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters = []
}) {
  const [selectedSources, setSelectedSources] = useState(initialFilters);

  // Move useEffect before the early return
  useEffect(() => {
    if (isOpen) {
      setSelectedSources(initialFilters);
    }
  }, [isOpen, initialFilters]);

  if (!isOpen) return null;

  const handleSourceToggle = (sourceId) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId) 
        : [...prev, sourceId]
    );
  };

  const handleApply = () => {
    onApply(selectedSources);
    onClose();
  };

  const handleClearFilters = () => {
    setSelectedSources([]);
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
          <span
            className="flex items-center gap-2 p-2 text-sm bg-gray-100 rounded-full"
          >
            {selectedSources.length > 0 ? `${selectedSources.length} Filtri` : "Nessun filtro"}
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

      <div className="grid grid-cols-2 gap-3 mb-20">
        {NEWS_SOURCES.map((source) => (
          <button
            key={source.id}
            onClick={() => handleSourceToggle(source.id)}
            type="button"
            className={`p-3 rounded-full text-sm font-medium text-left flex items-center gap-2
              ${selectedSources.includes(source.id) ? "bg-[#1a3b54] text-white" : "bg-gray-100 text-gray-900"}`}
          >
            <div
              className={`w-6 h-6 flex items-center justify-center rounded ${
                selectedSources.includes(source.id) ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              {source.name.charAt(0)}
            </div>
            {source.name}
          </button>
        ))}
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