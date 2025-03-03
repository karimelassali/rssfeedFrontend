"use client"

import { useState ,useEffect} from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileSection from "@/components/profile-section"
import ApiKeySection from "@/components/api-key-section"
import FavoritesSection from "@/components/favorites-section"
import StatsSection from "@/components/stats-section"
import { User, LinkIcon, Key, BarChart } from "lucide-react"
import {Cookie} from "js-cookie"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState(null);


  useEffect(() => {
    const info = Cookie.get("user");
    if (info) {
      setUser(JSON.parse(info));
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0F2A43] mb-6">Settings</h1>
      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key  size={16} />
            <span className="hidden sm:inline">API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <LinkIcon size={16} />
            <span className="hidden sm:inline">Favorites</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart size={16} />
            <span className="hidden sm:inline">Statistics</span>
          </TabsTrigger>
        </TabsList>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full">
          <TabsContent value="profile" className="mt-0">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="api" className="mt-0">
            <ApiKeySection  currentApiKey={'iuwhferhfeiruenuuh'}/>
          </TabsContent>

          <TabsContent value="favorites" className="mt-0">
            <FavoritesSection />
          </TabsContent>

          <TabsContent value="stats" className="mt-0">
            <StatsSection />
          </TabsContent>
        </motion.div>
      </Tabs>
    </motion.div>
  );
}

