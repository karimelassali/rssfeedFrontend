"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function FavoritesSection() {
  const [favorites, setFavorites] = useState([
    { id: 1, title: "TechCrunch", url: "https://techcrunch.com", category: "Technology" },
    { id: 2, title: "The New York Times", url: "https://nytimes.com", category: "News" },
    { id: 3, title: "BBC News", url: "https://bbc.com/news", category: "News" },
    { id: 4, title: "Medium", url: "https://medium.com", category: "Blog" },
  ])

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((fav) => fav.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#0F2A43]">Favorite Sources</CardTitle>
        <CardDescription>Manage your favorite content sources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {favorites.length === 0 ? (
            <p className="text-center py-8 text-gray-500">You have no favorite sources yet.</p>
          ) : (
            <AnimatePresence>
              {favorites.map((favorite) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 rounded-lg border border-[#0F2A43]/10 hover:border-[#22C55E]/50 transition-colors">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{favorite.title}</h3>
                        <Badge
                          variant="outline"
                          className="bg-[#22C55E]/10 text-[#0F2A43] border-[#22C55E]/30">
                          {favorite.category}
                        </Badge>
                      </div>
                      <a
                        href={favorite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-1">
                        {favorite.url}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFavorite(favorite.id)}
                      className="text-gray-500 hover:text-red-500 hover:bg-red-50">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

