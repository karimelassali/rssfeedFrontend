"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Edit2, ArrowLeft, ImageOff, FileText  } from "lucide-react"
import Image from "next/image"
import axios from "axios"
import { Logo } from "./ui/logo"
import PublishingWizard from "./publishing-wizard"
import ArticleSkeleton from "./ui/skeletons/articleSkeletons"

// New EditForm Component
const ArticleEditForm = ({ title, article, onCancel, onContinue }) => {
  const [formData, setFormData] = useState({
    title: title || "",
    article: article || ""
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-white z-50 overflow-y-auto"
    >
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-6">DIGINEWS</h1>
        
        <div className="space-y-6 mb-24">
          <div>
            <h2 className="text-lg font-medium mb-4">Modifica articolo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titolo</label>
                <textarea
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Articolo</label>
                <textarea
                  value={formData.article}
                  onChange={(e) => setFormData(prev => ({ ...prev, article: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={12}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <div className="max-w-2xl mx-auto flex gap-4">
            <Button
              onClick={onCancel}
              className="flex-1 py-6 bg-slate-800 text-white hover:bg-slate-700"
            >
              Annulla
            </Button>
            <Button
              onClick={() => onContinue(formData)}
              className="flex-1 py-6 bg-green-500 hover:bg-green-600 text-white"
            >
              Continua
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main NewsArticle Component
export default function NewsArticle({ id }) {
  const [isEditing, setIsEditing] = useState(false);
  const [randomImageUrl, setRandomImageUrl] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [articleData, setArticleData] = useState({});
  const [viewOriginal, setViewOriginal] = useState({
    title: false,
    description: false
  });
  const [continuingButtons, setContinuingButtons] = useState({
    aiContinue: false,
  });
  const [annulingEditing, setAnnulingEditing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showRegenerateButton, setShowRegenerateButton] = useState(false);
  const [error, setError] = useState(null);

  // Generate random image URL
  useEffect(() => {
    const randomNum = Math.floor(Math.random() * 1000);
    setRandomImageUrl(`https://picsum.photos/500/300?random=${randomNum}`);
  }, [id]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setAiLoading(true);
    setShowRegenerateButton(false);
    setError(null);
  };

  const handleEditFormSubmit = (formData) => {
    setAiResponse({
      title: formData.title,
      description: formData.article
    });
    setShowEditForm(false);
    setContinuingButtons(prev => ({ ...prev, aiContinue: true }));
  };

  const handleViewOriginal = (type) => {
    setViewOriginal(prev => ({
      ...prev,
      [type]: true
    }));
  };

  const handleBackToAiContent = () => {
    setViewOriginal({
      title: false,
      description: false
    });
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/api/article/${id}`);
        setArticleData(response.data);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Failed to load article');
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  useEffect(() => {
    const generateAiContent = async () => {
      if (isEditing && articleData.title && articleData.description) {
        setAiLoading(true);
        setError(null);
        
        try {
          const response = await axios.post('/api/ai/', {
            articleTitle: articleData.title,
            articleDescription: articleData.description,
          });
          setAiResponse(response.data);
          setAiLoading(false);
          setTimeout(() => setShowRegenerateButton(true), 5000);
        } catch (error) {
          console.error('Error generating AI content:', error);
          setError('Failed to generate AI content');
          setAiLoading(false);
        }
      }
    };

    generateAiContent();
  }, [isEditing, articleData]);

  const annulingEditingListener = (data) => {
    setAnnulingEditing(true);
    setTimeout(() => {
      setAnnulingEditing(false);
    }, 2000);
    setContinuingButtons(prev => ({
      ...prev,
      aiContinue: false,
    }));
  };

  const NoImagePlaceholder = () => {
    return (
      <div className="relative w-full h-64 bg-gradient-to-br from-[#F5F6F7] to-[#F5F6F7]/70 rounded-xl overflow-hidden shadow-md flex flex-col items-center justify-center text-center p-6 border border-[#0F2A43]/10">
        <div className="absolute inset-0 opacity-10">
          <svg 
            className="w-full h-full text-[#0F2A43]/10" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            <pattern id="pattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M0 0 L10 0 L5 5 Z" className="stroke-[#0F2A43]/20" fill="none" />
            </pattern>
            <rect x="0" y="0" width="100" height="100" fill="url(#pattern)" />
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-[#0F2A43]/5 p-4 rounded-full mb-4 shadow-md">
            <ImageOff className="w-10 h-10 text-[#0F2A43]" strokeWidth={1.5} />
          </div>
          
          <h3 className="text-xl font-bold text-[#0F2A43] mb-2 tracking-tight">
            Nessun Contenuto Visivo
          </h3>
          
          <p className="text-sm text-[#0F2A43]/80 max-w-xs">
            Questo articolo non ha un'immagine associata. Il contenuto rimane informativo e prezioso.
          </p>
          
          <div className="mt-4 flex items-center text-[#0F2A43]/60 text-xs">
            <FileText className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Articolo Solo Testo
          </div>
        </div>
  
        {/* Optional subtle error indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/30"></div>
      </div>
    );
  };
  

  const renderMainArticleView = () => (
    articleData.title && articleData.description ? (
      <motion.div
      key="article"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6 max-w-3xl"
    >
      <header className="mb-6">
        <Logo />
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="source-tag bg-green-100 text-green-800 px-2 py-0.5 rounded">
            {articleData.source ? articleData.source.split('/').pop() : 'Loading...'}
          </span>
        </div>
      </header>

      <h2 className="text-xl font-semibold mb-3">
        {articleData.title}
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        {new Date(articleData.pubDate).toLocaleDateString('it-IT', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
      {articleData.img && (
         <div className="relative w-full h-64 mb-6">
         {articleData.img ? (
           <Image
             src={articleData.img}
             alt="Article image"
             fill
             className="rounded-lg object-cover"
             onError={(e) => {
               e.target.src = '/default-image.jpg'; // Fallback image
             }}
           />
         ) : (
           // <NoImagePlaceholder />
           null
         )}
       </div>
      )}
      <div className="prose max-w-none mb-8">
        <p className="mb-20">{articleData.description}</p>
      </div>

      <div className="fixed flex justify-center bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button
          onClick={toggleEdit}
          className="w-[50%] bg-green-500 hover:bg-green-600 text-white py-4 rounded-full flex items-center justify-center gap-2 max-sm:w-full"
        >
          <Edit2 className="w-4 h-4" />
          Utilizza e rielabora
        </Button>
      </div>
    </motion.div>
    ) : (
      <ArticleSkeleton />
    )
  );


  const renderEditContent = () => {
    if (aiLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <img src="/ai.gif" className="h-12 w-12" alt="Loading..." />
          <p className="mt-4 text-gray-600">Generazione in corso...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center text-red-600 p-4">
          {error}
          <Button
            onClick={toggleEdit}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Retry
          </Button>
        </div>
      )
    }

    if (viewOriginal.title || viewOriginal.description) {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Contenuto Originale</h2>
          
          {viewOriginal.title && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Titolo Originale</h3>
              <div className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md">
                {articleData.title}
              </div>
            </div>
          )}

          {viewOriginal.description && (
            <div>
              <h3 className="font-medium mb-2">Descrizione Originale</h3>
              <div className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md whitespace-pre-wrap">
                {articleData.description}
              </div>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6">Notizia rielaborata</h2>

        {aiResponse && (
          <div className="space-y-6">
            <div className="flex bg-slate-100 rounded-md p-2 flex-col">
              <div className="flex justify-between p-2 border-b border-slate-500 items-center mb-2">
                <h3 className="font-medium">Titolo</h3>
                <Button 
                  onClick={() => handleViewOriginal('title')} 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-500 bg-blue-100"
                >
                  Vedi originale
                </Button>
              </div>
              <div className="w-full px-4 py-2 text-black rounded-md overflow-wrap break-words">
                {aiResponse.title}
              </div>
            </div>

            <div className="bg-slate-100 p-2 rounded">
              <div className="flex justify-between  p-2border-b border-slate-500 items-center mb-2">
                <h3 className="font-medium">Articolo</h3>
                <Button 
                  onClick={() => handleViewOriginal('description')} 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-500 bg-blue-100"
                >
                  Vedi originale
                </Button>
              </div>
              <div className="w-full px-4 py-2 mb-20 text-black bg-transparent rounded-md whitespace-pre-wrap break-words">
                {aiResponse.description}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderActionButtons = () => {
    if (viewOriginal.title || viewOriginal.description) {
      return (
        <Button 
          onClick={handleBackToAiContent} 
          className="w-full py-6 bg-slate-800 hover:bg-slate-700 text-white"
        >
          Chiudo
        </Button>
      )
    }

    if (showRegenerateButton) {
      return (
        <div className="flex w-full justify-center gap-4">
          <div className="flex w-[50%] flex justify-center   gap-4 max-sm:w-full">
          <Button 
            onClick={() => setShowEditForm(true)}
            className="flex-1 rounded-full py-6 bg-slate-800 hover:bg-slate-700 text-white"
          >
            Modifica
          </Button>
          <Button 
            onClick={() => setContinuingButtons(prev => ({...prev, aiContinue: true}))}
            className="flex-1 rounded-full py-6 bg-green-500 hover:bg-green-600 text-white"
          >
            Continua
          </Button>
        </div>
        </div>
      )
    }

    return (
      aiResponse && (
        <div className="flex gap-4">
          <Button 
            onClick={() => setShowEditForm(true)}
            className="flex-1 rounded-full py-6 bg-slate-800 hover:bg-slate-700 text-white"
          >
            Modifica
          </Button>
          <Button 
            onClick={() => setContinuingButtons(prev => ({...prev, aiContinue: true}))}
            className="flex-1 rounded-full py-6 bg-green-500 hover:bg-green-600 text-white"
          >
            Continua
          </Button>
        </div>
      )
    )
  }

  if (continuingButtons.aiContinue && !annulingEditing) {
    return <PublishingWizard anulling={annulingEditingListener} articleData={aiResponse} id={articleData.id} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {showEditForm && (
          <ArticleEditForm
            title={aiResponse.title}
            article={aiResponse.description}
            onCancel={() => setShowEditForm(false)}
            onContinue={handleEditFormSubmit}
          />
        )}
        
        {!isEditing ? (
          renderMainArticleView()
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-6 max-w-3xl"
          >
            <Logo />

            {!viewOriginal.title && !viewOriginal.description && (
              <Card onClick={toggleEdit} className="mb-6 cursor-pointer hover:bg-gray-100">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <div className="relative w-12 h-12">
                  <Image
                    src={randomImageUrl}
                    alt="Article image"
                    fill
                    className="rounded-lg object-cover"
                  />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">
                      {articleData.source ? articleData.source.split('/').pop() : 'Loading...'}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      {articleData.title}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            )}

            {renderEditContent()}

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
              {renderActionButtons()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}