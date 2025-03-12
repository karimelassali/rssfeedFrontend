"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Save } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ApiKeySection({currentApiKey}) {
  const [apiKey, setApiKey] = useState(currentApiKey || "No api key")
  const [showKey, setShowKey] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    // Here you would typically save to backend
    setIsSaved(true)
    axios.update("api/settings", {
      Headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
      Body:
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#0F2A43]">API Key Management</CardTitle>
        <CardDescription>Add your AI API key to enable advanced features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}>
            <Alert className="bg-[#22C55E]/10 border-[#22C55E] text-[#0F2A43]">
              <AlertDescription>Your API key has been saved successfully!</AlertDescription>
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
            <Button
              onClick={handleSave}
              className="bg-[#22C55E] hover:bg-[#1ea34d]"
              disabled={!apiKey}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Your API key is stored securely and never shared with third parties.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

