"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image" // Correct import
import { useState } from "react"

export default function Rewrite() {
  const [showOriginal, setShowOriginal] = useState(false)

  return (
    (<div className="max-w-2xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0B3954]">DIGINEWS</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/png%20(7).png-UkV6xRxf3IXOclLqpol75L1uBN7gnv.jpeg"
              alt="News thumbnail"
              fill
              className="rounded object-cover" />
          </div>
          <span className="text-sm">Ansa Valle d'Aosta</span>
        </div>
      </header>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Notizia rielaborata</h3>
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOriginal(!showOriginal)}>
              Vedi originale
            </Button>
          </div>

          {showOriginal ? (
            <div className="bg-gray-50 p-4 rounded">
              {/* Original content */}
              <p className="text-gray-700">Original content here...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-500">Titolo</h4>
                <p className="mt-1">Nonna e nipotino travolti a Sarre: lei in rianimazione, il piccolo in chirurgia</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Articolo</h4>
                <p className="mt-1">AI generated content here...</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" className="flex-1">
            Modifica
          </Button>
          <Link href="/publish" className="flex-1">
            <Button className="w-full bg-green-500 hover:bg-green-600">Continua</Button>
          </Link>
        </div>
      </div>
    </div>)
  );
}

