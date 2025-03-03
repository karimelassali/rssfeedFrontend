"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ExternalLink, Search, LinkIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Image from "next/image"




export default function FavoritesSection({ favoriteSources }) {
  const [favorites, setFavorites] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (favoriteSources) {
      // Check if we have the message in the data structure
      if (favoriteSources.message) {
        setMessage(favoriteSources.message)
        // If we have sources array, use that
        if (favoriteSources.sources && Array.isArray(favoriteSources.sources)) {
          setFavorites(favoriteSources.sources)
        } else {
          // Otherwise, assume favoriteSources is the array itself
          setFavorites(Array.isArray(favoriteSources) ? favoriteSources : [])
        }
      } else {
        // Handle the case where the structure might be flattened
        setFavorites(Array.isArray(favoriteSources) ? favoriteSources : [])
        if (favorites.length > 0) {
          setMessage(`${favorites.length} favorite sources found`)
        }
      }
      setIsLoaded(true)
    }
  }, [favoriteSources])

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((fav) => fav.id !== id))
    // Update the message count too
    setMessage(`${favorites.length - 1} favorite sources found`)
  }

  const filteredFavorites = favorites.filter(favorite => 
    favorite.source.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
        <CardTitle className="text-[#0F2A43] text-xl flex items-center gap-2">
          <LinkIcon className="h-6 w-6" />
          Favorite Sources
        </CardTitle>
        <CardDescription>Manage your favorite content sources</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-green-100 focus:border-green-300 focus:ring-green-200"
            />
          </div>

          {/* Message notification */}
          {isLoaded && message && (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center border border-green-200 shadow-sm">
              <span className="font-medium">{message}</span>
            </div>
          )}
          
          {/* Empty state */}
          {isLoaded && filteredFavorites.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 px-4"
            >
              {searchQuery ? (
                <p className="text-gray-500">No sources match your search.</p>
              ) : (
                <div className="space-y-3">
                  <LinkIcon className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="text-gray-500">You have no favorite sources yet.</p>
                  <p className="text-sm text-gray-400">Sources you mark as favorite will appear here.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* List of favorites */}
          <AnimatePresence>
            {isLoaded && filteredFavorites.map((favorite) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 rounded-lg border border-[#0F2A43]/10 hover:border-[#22C55E]/50 hover:bg-green-50/30 transition-all shadow-sm">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{favorite.source}</h3>
                      <Badge
                        variant="outline"
                        className="bg-[#22C55E]/10 text-[#0F2A43] border-[#22C55E]/30">
                        {favorite.source.includes('www.') ? 'Web' : 'Source'}
                      </Badge>
                    </div>
                    <a
                      href={favorite.source.startsWith('http') ? favorite.source : `https://${favorite.source}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-1">
                      {favorite.source}
                      <ExternalLink size={12} />
                    </a>
                    {favorite.created_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        Added on {new Date(favorite.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFavorite(favorite.id)}
                    className="text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={18} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}