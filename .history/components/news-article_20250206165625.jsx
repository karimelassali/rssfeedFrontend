"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Edit2 } from "lucide-react"
import Image from "next/image"
import axios from "axios"

export default function NewsArticle({id}) {
  const [isEditing, setIsEditing] = useState(false)
  const [articleData, setArticleData] = useState({})

  const [aiResponse, setAiResponse] = useState("");
  const [aiModification, setAiModification] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }
  const toggleAiModification = () => {
    setAiModification(!aiModification)
  }



  useEffect(() => {
    axios.get(`/api/article/${id}`)
      .then((response) => {
        setArticleData(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [id])

  useEffect(() => {
    if (isEditing && articleData) {
      axios
        .post(`/api/ai/`, {
          articleTitle: articleData.title,
          articleDescription: articleData.description,
        })
        .then((response) => {
          setAiResponse(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setAiResponse("");
    }
  }, [isEditing, articleData]);

  return (
    (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="article"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-6 max-w-3xl">
            <header className="mb-6">
              <h1 className="text-2xl font-bold text-[#0B3558] mb-2">DIGINEWS</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="source-tag bg-green-100 text-green-800 px-2 py-0.5 rounded">
                {articleData.source ? articleData.source.split('/').pop() : 'Loading...'}
              </span>
              </div>
            </header>

            <h2 className="text-xl font-semibold mb-3">
              {articleData.title}
            </h2>

            <p className="text-sm text-gray-600 mb-4">{articleData.pubDate}</p>

            <div className="relative w-full h-64 mb-6">
              <Image
                src="https://imgs.search.brave.com/QFb1Hs4fK8JkD2z81ohmngICaw1V5QvgTo4Fynp6h2A/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzAxLzAxLzA0/LzM2MF9GXzEwMTAx/MDQzNl9QcDJmUjYw/eGl5bHg5ZEd4Nmhu/aG44YXhZMUVXcFlh/NC5qcGc"
                alt="Ambulanza"
                fill
                className="rounded-lg object-cover" />
            </div>

            <div className="prose max-w-none mb-8">
              <p className="mb-4">{articleData.description}</p>
              {/* Add more content as needed */}
            </div>

            <Button
              onClick={toggleEdit}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg flex items-center justify-center gap-2">
              <Edit2 className="w-4 h-4" />
              Utilizza e rielabora
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-6 max-w-3xl">
            <header className="mb-6">
              <h1 className="text-2xl font-bold text-[#0B3558]">DIGINEWS</h1>
            </header>

            <Card  onClick={toggleEdit}  className="mb-6 cursor-pointer hover:bg-gray-100">
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <div className="relative w-12 h-12">
                  <Image
                    src="https://imgs.search.brave.com/QFb1Hs4fK8JkD2z81ohmngICaw1V5QvgTo4Fynp6h2A/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzAxLzAxLzA0/LzM2MF9GXzEwMTAx/MDQzNl9QcDJmUjYw/eGl5bHg5ZEd4Nmhu/aG44YXhZMUVXcFlh/NC5qcGc"
                    alt="Article thumbnail"
                    fill
                    className="rounded object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Ansa Valle d'Aosta</h3>
                  <p className="text-xs text-gray-600 truncate">
                    {articleData.title}...
                  </p>
                </div>
              </CardHeader>
            </Card>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">Notizia rielaborata</h2>

              {aiResponse ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Titolo</h3>
                      <Button variant="ghost" size="sm" className="text-blue-500">
                        Vedi originale
                      </Button>
                    </div>
                    <input
                      type="text"
                      value={articleData.title}
                      className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Articolo</h3>
                      <Button variant="ghost" size="sm" className="text-blue-500">
                        Vedi originale
                      </Button>
                    </div>
                    <textarea
                      value={aiResponse.candidates[0].content.parts[0].text}
                      rows={8}
                      className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md resize-none"
                      onChange={(e) => setAiResponse({
                        ...aiResponse,
                        candidates: [
                          {
                            ...aiResponse.candidates[0],
                            content: {
                              ...aiResponse.candidates[0].content,
                              parts: [
                                {
                                  ...aiResponse.candidates[0].content.parts[0],
                                  text: e.target.value,
                                },
                              ],
                            },
                          },
                        ],
                      })}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <img src="/ai.gif" className="animate-spin h-12 w-12 text-blue-500" alt="ai" />
                  Generating ...
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={toggleAiModification} className="flex-1 py-6">
                {aiModification ? "Annulla" : "Modifica"}
              </Button>
              <Button className="flex-1 py-6 bg-green-500 hover:bg-green-600">Continua</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    )
  );
}

