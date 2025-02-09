"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ImagePlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ImageUploadModal } from "./image-upload-modal"
import { Logo } from "./ui/logo"
import axios from "axios"

const categories = [
  { id: "cronaca", name: "Cronaca" },
  { id: "regione", name: "Regione" },
  { id: "economia", name: "Economia" },
  { id: "turismo", name: "Turismo" },
  { id: "sanita", name: "Sanità" },
  { id: "agricoltura", name: "Agricoltura" },
  { id: "scuola", name: "Scuola" },
  { id: "cultura", name: "Cultura e spettacolo" },
  { id: "sport", name: "Sport" },
  { id: "rubriche", name: "Rubriche" },
  { id: "ambiente", name: "Ambiente" },
  { id: "parrocchie", name: "Parrocchie" },
  { id: "necrologi", name: "Necrologi" },
  { id: "archivio", name: "Archivio" },
]

export default function PublishingWizard({articleData,anulling}) {
  const [step, setStep] = React.useState(1)
  const [imageModalOpen, setImageModalOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    image: null,
    category: "",
    showInHomepage: false,
    publishType: "now", // 'now' or 'schedule'
    date: "",
    time: "",
  })
  const [publishingState, setPublishingState] = React.useState({
    response: null,
    isClicked: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContinue = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2 && formData.category) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canContinue = () => {
    if (step === 1) {
      if (!formData.image) return false
      if (formData.publishType === "schedule" && (!formData.date || !formData.time)) return false
      return true
    }
    if (step === 2) {
      return formData.category !== ""
    }
    return true
  }

  const publicArticle = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/publish/${id}`, {
        method: "POST",
      });
      const res = await response.json();
      console.log("Response:", res); // تحقق من الرد
      if (response.ok) {
        setPublishingState({ response: res, isClicked: true });
      }
    } catch (error) {
      console.error("Error publishing article:", error);
    }
  };
  
  return (
    (<div className="min-h-screen bg-gray-50 p-4">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto max-w-md">
            <Card className="overflow-hidden">
              <div className="border-b bg-gray-50 p-4">
                <Logo />
              </div>
              <div className="space-y-4 p-4">
                <div>
                  <p className="mb-2 text-sm">Inserisci immagine</p>
                  <div
                    className={cn(
                      "relative aspect-[3/2] w-full cursor-pointer rounded-lg border-2 border-dashed",
                      formData.image ? "border-[#00C897]" : "border-gray-300"
                    )}
                    onClick={() => setImageModalOpen(true)}>
                    {formData.image ? (
                      <>
                        <img
                          src={formData.image || "/placeholder.svg"}
                          alt="Preview"
                          className="h-full w-full rounded-lg object-cover" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleInputChange("image", null)
                          }}
                          className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-lg">
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2">
                        <ImagePlus className="h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-500">Aggiungi immagine</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm">Seleziona categoria</p>
                  <button
                    className="w-full rounded-lg border p-3 text-left text-sm hover:bg-gray-50"
                    onClick={() => setStep(2)}>
                    {formData.category
                      ? categories.find((c) => c.id === formData.category)?.name
                      : "Seleziona una categoria"}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Seleziona posizione</span>
                  <Switch
                    checked={formData.showInHomepage}
                    onCheckedChange={(checked) => handleInputChange("showInHomepage", checked)} />
                </div>

                <div className="space-y-4">
                  <RadioGroup
                    value={formData.publishType}
                    onValueChange={(value) => handleInputChange("publishType", value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="now" id="now" />
                      <Label htmlFor="now">Pubblica ora</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="schedule" id="schedule" />
                      <Label htmlFor="schedule">Programma pubblicazione</Label>
                    </div>
                  </RadioGroup>

                  {formData.publishType === "schedule" && (
                    <div className="space-y-2">
                      <p className="mb-2 text-sm">Seleziona data di pubblicazione</p>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange("date", e.target.value)}
                          className="flex-1 rounded-lg border p-2 text-sm" />
                        <input
                          type="time"
                          value={formData.time}
                          onChange={(e) => handleInputChange("time", e.target.value)}
                          className="flex-1 rounded-lg border p-2 text-sm" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => {setStep(1);anulling(true)}}>
                    Annulla
                  </Button>
                  <Button
                    className="flex-1 bg-[#00C897] hover:bg-[#00B386]"
                    onClick={handleContinue}
                    disabled={!canContinue()}>
                    Continua
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="mx-auto max-w-md">
            <Card>
              <div className="flex items-center border-b p-4">
                <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-base">Seleziona una categoria</h2>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 gap-2 p-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleInputChange("category", category.id)}
                      className={cn(
                        "rounded-lg border p-3 text-center text-sm transition-colors",
                        formData.category === category.id
                          ? "border-[#00C897] bg-[#00C897] text-white"
                          : "hover:bg-gray-50"
                      )}>
                      {category.name}
                    </button>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                <Button
                  className="w-full bg-[#00C897] hover:bg-[#00B386]"
                  onClick={handleContinue}
                  disabled={!canContinue()}>
                  Continua
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="mx-auto max-w-md">
            <Card>
              <div className="border-b bg-gray-50 p-4">
                <Logo />
              </div>
              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <span className="text-sm text-orange-500">PRINCIPALE</span>
                  <h3 className="text-lg font-medium">{categories.find((c) => c.id === formData.category)?.name}</h3>
                </div>
                {formData.image && (
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Preview"
                    className="aspect-video w-full rounded-lg object-cover" />
                )}
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">{articleData.title}</h4>
                  <p className="text-sm text-gray-600">{articleData.description}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleBack}
                    disabled={publishingState.isClicked} // تعطيل الزر بعد النشر
                  >
                    Modifica
                  </Button>

                  <Button
                    className="flex-1 bg-[#00C897] hover:bg-[#00B386]"
                    onClick={() => publicArticle(articleData.id)}
                    disabled={publishingState.isClicked} // تعطيل الزر بعد النشر
                  >
                    {publishingState.isClicked ? "Pubblicato" : "Pubblica"}
                  </Button>



                  </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      
      <ImageUploadModal
        open={imageModalOpen}
        onOpenChange={setImageModalOpen}
        onImageSelect={(imageUrl) => handleInputChange("image", imageUrl)} />
    </div>)
  );
}

