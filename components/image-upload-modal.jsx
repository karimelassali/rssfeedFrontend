"use client";
import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ImagePlus, Upload } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios";
import { Loader2 } from "lucide-react";

export function ImageUploadModal({
  open,
  onOpenChange,
  onImageSelect
}) {
  const fileInputRef = React.useRef(null)

  const [wordpressImages, setWordPressImages] = React.useState([]);

  React.useEffect(() => {
    const fetchWordPressImages = async () => {
      const response = await axios.get('https://www.lavalleenotizie.it/wp-json/wp/v2/media?per_page=50');
      setWordPressImages(response.data.map((image) => image.guid.rendered));
    }
    fetchWordPressImages();
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onImageSelect(reader.result)
        onOpenChange(false)
      }
      reader.readAsDataURL(file)
    }
  }

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
            <ScrollArea className="h-[60vh] w-full">
              {wordpressImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3">
                  {wordpressImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onImageSelect(image)
                        onOpenChange(false)
                      }}
                      className="group relative aspect-video overflow-hidden rounded-lg border-2 border-transparent hover:border-blue-500"
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`WordPress Media ${index}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 p-8">
                  <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                  <p>Loading images...</p>
                </div>
              )}
            </ScrollArea>
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