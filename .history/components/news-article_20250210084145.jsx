"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Edit2, ArrowLeft } from "lucide-react"
import Image from "next/image"
import axios from "axios"
import { Logo } from "./ui/logo"
import PublishingWizard from "./publishing-wizard"

export default function NewsArticle({id}) {
  const [isEditing, setIsEditing] = useState(false)
  const [articleData, setArticleData] = useState({})
  const [viewOriginal, setViewOriginal] = useState({
    title: false,
    description: false
  })
  const [continuingButtons, setContinuingButtons] = useState({
    aiContinue: false,
  })
  const [annulingEditing,setAnnulingEditing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showRegenerateButton, setShowRegenerateButton] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing)
    setAiLoading(true)
    setShowRegenerateButton(false)
  }

  const regenerateAiResponse = () => {
    setAiLoading(true)
    setShowRegenerateButton(false)
    setAiResponse("")
    
    axios
      .post(`/api/ai/`, {
        articleTitle: articleData.title,
        articleDescription: articleData.description,
      })
      .then((response) => {
        setAiResponse(response.data);
        setAiLoading(false)
        setTimeout(() => setShowRegenerateButton(true), 5000)
      })
      .catch((error) => {
        console.error(error);
        setAiLoading(false)
      });
  }

  const handleViewOriginal = (type) => {
    setViewOriginal(prev => ({
      ...prev,
      [type]: true
    }))
  }

  const handleBackToAiContent = () => {
    setViewOriginal({
      title: false,
      description: false
    })
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
    if (isEditing) {
      setAiLoading(true)
      axios
        .post(`/api/ai/`, {
          articleTitle: articleData.title,
          articleDescription: articleData.description,
        })
        .then((response) => {
          setAiResponse(response.data);
          setAiLoading(false)
          setTimeout(() => setShowRegenerateButton(true), 5000)
        })
        .catch((error) => {
          console.error(error);
          setAiLoading(false)
        });
    }
  }, [isEditing, articleData])

  const annulingEditingListener = (data)=>{
    setAnnulingEditing(true);
    setTimeout(()=>{
      setAnnulingEditing(false);
    },2000)
    setContinuingButtons(prev => ({
      ...prev,
      aiContinue:false,
    }))
  }

  // useEffect(()=>{
  //   console.log('anuuling =' + annulingEditing);
  //   console.log('ai contu  = ' + continuingButtons.aiContinue);
  // },[annulingEditing,continuingButtons.aiContinue])
  const renderMainArticleView = () => (
    <motion.div
      key="article"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6 max-w-3xl">
      <header className="mb-6">
        <Logo />              
        {annulingEditing}
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
      </div>

      {
        articleData.title && articleData.description && (
          <Button
            onClick={toggleEdit}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg flex items-center justify-center gap-2">
            <Edit2 className="w-4 h-4" />
            Utilizza e rielabora
          </Button>
        )
      }
    </motion.div>
  )

  const renderEditContent = () => {
    // AI Loading State
    if (aiLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <img src="/ai.gif" className="animate-spin h-12 w-12 text-blue-500" alt="ai" />
          <p className="mt-4 text-gray-600">Generazione in corso...</p>
        </div>
      )
    }

    // If viewing original content
    if (viewOriginal.title || viewOriginal.description) {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Contenuto Originale</h2>
          
          {viewOriginal.title && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Titolo Originale</h3>
              <input
                type="text"
                value={articleData.title}
                readOnly
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md"
              />
            </div>
          )}

          {viewOriginal.description && (
            <div>
              <h3 className="font-medium mb-2">Descrizione Originale</h3>
              <textarea
                value={articleData.description}
                rows={8}
                readOnly
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md resize-none"
              />
            </div>
          )}
        </div>
      )
    }

    // Regular AI content editing view
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6">Notizia rielaborata</h2>

        {aiResponse ? (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Titolo</h3>
                <Button 
                  onClick={() => handleViewOriginal('title')} 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-500"
                >
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
                <Button 
                  onClick={() => handleViewOriginal('description')} 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-500"
                >
                  Vedi originale
                </Button>
              </div>
              <textarea
              onChange={(e)=>{se}}
                value={aiResponse.candidates[0].content.parts[0].text}
                rows={8}
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md resize-none"
              />
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  const renderActionButtons = () => {
    // When viewing original content
    if (viewOriginal.title || viewOriginal.description) {
      return (
        <Button 
          onClick={handleBackToAiContent} 
          className="w-full py-6 bg-dark-blue hover:bg-dark-blue"
        >
          Chiudo
        </Button>
      )
    }

    // When AI response is ready and regenerate button is shown
    if (showRegenerateButton) {
      return (
        <div className="flex gap-4">
          <Button 
            onClick={regenerateAiResponse}
            variant="outline" 
            className="flex-1 py-6 border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            Rigenera
          </Button>
          <Button 
            onClick={() => setContinuingButtons(prev => ({...prev, aiContinue: true}))}
            className="flex-1 py-6 bg-green-500 hover:bg-green-600"
          >
            Continua
          </Button>
        </div>
      )
    }

    // Default AI editing buttons
    return (
      aiResponse && (
        <div className="flex gap-4">
        <Button 
          variant="outline" 
          style={{backgroundColor: "#093F5A"}} 
          className="flex-1 text-white py-6"
        >
          Modifica
        </Button>
        <Button 
          onClick={() => setContinuingButtons(prev => ({...prev, aiContinue: true}))}
          className="flex-1 py-6 bg-green-500 hover:bg-green-600"
        >
          Continua
        </Button>
      </div>
      )
    )
  }

  // If aiContinue is true, render PublishingWizard
  if (continuingButtons.aiContinue && !annulingEditing) {
    return <PublishingWizard anulling={annulingEditingListener} articleData={articleData} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {!isEditing ? (
          renderMainArticleView()
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-6 max-w-3xl">
            <Logo />              

            {!viewOriginal.title && !viewOriginal.description && (
              <Card onClick={toggleEdit} className="mb-6 cursor-pointer hover:bg-gray-100">
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
            )
            }

            {renderEditContent()}

            {renderActionButtons()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}