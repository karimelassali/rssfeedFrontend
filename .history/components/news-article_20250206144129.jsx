"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Edit2 } from "lucide-react"
import Image from "next/image"

export default function NewsArticle({id}) {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  return (
    (<div className="min-h-screen bg-gray-50">
      {id}
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
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">Ansa Valle d'Aosta</span>
              </div>
            </header>

            <h2 className="text-xl font-semibold mb-3">
              Investiti a Sarre, nonna in Rianimazione e nipotino in Chirurgia
            </h2>

            <p className="text-sm text-gray-600 mb-4">04 febbraio 2025, 10:33</p>

            <div className="relative w-full h-64 mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/png%20(7).png-5OPnACyWcRuhUVwP6CHb6CnCTVvYDg.jpeg"
                alt="Ambulanza"
                fill
                className="rounded-lg object-cover" />
            </div>

            <div className="prose max-w-none mb-8">
              <p className="mb-4">Il piccolo di 18 mesi trasferito al Regina Margherita di Torino.</p>
              <p className="mb-4">
                E' stato trasferito all'ospedale Regina Margherita di Torino il bambino di un anno e mezzo investito
                ieri pomeriggio da un'auto a Sarre insieme alla mamma e alla nonna.
              </p>
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

            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <div className="relative w-12 h-12">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/png%20(7).png-5OPnACyWcRuhUVwP6CHb6CnCTVvYDg.jpeg"
                    alt="Article thumbnail"
                    fill
                    className="rounded object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Ansa Valle d'Aosta</h3>
                  <p className="text-xs text-gray-600 truncate">
                    Investiti a Sarre, nonna in Rianimazione e nipotino in Chirurgia...
                  </p>
                </div>
              </CardHeader>
            </Card>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">Notizia rielaborata</h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Titolo</h3>
                    <Button variant="ghost" size="sm" className="text-blue-500">
                      Vedi originale
                    </Button>
                  </div>
                  <p className="text-gray-600">
                    Nonna e nipotino travolti a Sarre: lei in rianimazione, il piccolo in chirurgia
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Articolo</h3>
                    <Button variant="ghost" size="sm" className="text-blue-500">
                      Vedi originale
                    </Button>
                  </div>
                  <p className="text-gray-600">
                    Il bambino di un anno e mezzo, investito ieri pomeriggio a Sarre insieme alla mamma e alla nonna, è
                    stato trasferito all'ospedale Regina Margherita di Torino...
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={toggleEdit} className="flex-1 py-6">
                Modifica
              </Button>
              <Button className="flex-1 py-6 bg-green-500 hover:bg-green-600">Continua</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>)
  );
}

