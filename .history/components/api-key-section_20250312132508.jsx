"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Save } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import axios from "axios"

export default function ApiKeySection({currentApiKey}) {
  const [apiKey, setApiKey] = useState(currentApiKey || "No api key")
  const [showKey, setShowKey] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState("")
  const isKeyChanged = apiKey !== currentApiKey

  const handleSave = async () => {
    try {
      const response = await axios.put('/api/settings/apikey', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
      })

      if (response.status === 200) {
        setIsSaved(true)
        setIsError(false)
        setMessage(response.data.message)
        setTimeout(() => {
          setIsSaved(false)
          setMessage("")
        }, 3000)
      }
    } catch (error) {
      setIsError(true)
      setMessage(error.response?.data?.message || "Failed to update API key")
      setTimeout(() => {
        setIsError(false)
        setMessage("")
      }, 3000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#0F2A43]">API Key Management</CardTitle>
        <CardDescription>Add your AI API key to enable advanced features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isSaved && message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}>
            <Alert className="bg-[#22C55E]/10 border-[#22C55E] text-[#0F2A43]">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {isError && message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}>
            <Alert className="bg-red-100 border-red-400 text-red-700">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="space-y-2">
          <Label htmlFor="apiKey">AI API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type={showKey ? "text" : "password"}
                placeholder="Enter your API key"
                className="pr-10 border-[#0F2A43]/20 focus-visible:ring-[#22C55E]" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent">
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="bg-[#22C55E] hover:bg-[#1ea34d]"
                  disabled={!apiKey || !isKeyChanged}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Update API Key</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to update your API key? This action will replace your current API key.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSave}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Your API key is stored securely and never shared with third parties.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

