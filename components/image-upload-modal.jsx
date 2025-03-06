"use client";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImagePlus, Upload, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { Loader2 } from "lucide-react";

export function ImageUploadModal({ open, onOpenChange, onImageSelect }) {
  const fileInputRef = React.useRef(null);
  const [wordpressImages, setWordPressImages] = React.useState([]);
  const [filteredImages, setFilteredImages] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Fetch WordPress images
  React.useEffect(() => {
    const fetchWordPressImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(
          'https://www.lavalleenotizie.it/wp-json/wp/v2/media?per_page=50'
        );
        const images = response.data.map((image) => ({
          url: image.guid.rendered,
          title: image.title.rendered,
          alt: image.alt_text
        }));
        setWordPressImages(images);
        setFilteredImages(images);
      } catch (err) {
        setError("Failed to load WordPress images");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWordPressImages();
  }, []);

  // Handle search functionality
  React.useEffect(() => {
    const filtered = wordpressImages.filter((image) =>
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.alt.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredImages(filtered);
  }, [searchQuery, wordpressImages]);

  // Handle local file upload
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result);
        onOpenChange(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[100vh] border-none max-h-[89vh]">
        <DialogHeader>
          <DialogTitle>Seleziona immagine</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="wordpress" className="w-full h-full flex flex-col flex-1">
          <TabsList className="w-full">
            <TabsTrigger value="wordpress" className="flex-1">
              WordPress Media
            </TabsTrigger>
            <TabsTrigger value="local" className="flex-1">
              Upload Locale
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wordpress" className="flex-1 relative">
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca immagini..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <ScrollArea className="h-[60vh] w-full">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center gap-4 p-8">
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                    <p>Loading images...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center gap-4 p-8 text-red-500">
                    <p>{error}</p>
                    <Button onClick={() => fetchWordPressImages()}>
                      Retry
                    </Button>
                  </div>
                ) : filteredImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {filteredImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          onImageSelect(image.url);
                          onOpenChange(false);
                        }}
                        className="group relative aspect-video overflow-hidden rounded-lg border-2 border-transparent hover:border-blue-500"
                        title={image.title}
                      >
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.alt || image.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {image.title}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 p-8">
                    <p className="text-gray-500">No images found</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="local" className="mt-4">
            <div className="flex flex-col items-center justify-center gap-4 p-8">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <ImagePlus className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}