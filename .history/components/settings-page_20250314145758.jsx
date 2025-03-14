"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSection from "@/components/profile-section";
import ApiKeySection from "@/components/api-key-section";
import FavoritesSection from "@/components/favorites-section";
import StatsSection from "@/components/stats-section";
import { User, LinkIcon, Key, BarChart } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { set } from "date-fns";


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    apiToken: '',
    favoriteSources: null, // Initialize as null to handle loading state
  });
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const info = Cookies.get("user");
    if (info) {
      setUser(JSON.parse(info));
    }
  }, []);

  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      apiToken: user?.api_token,
    }));
  }, [user])

  const fetchFavorites = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}api/favorite_sources/fetch`,
        {
          user_id: user.id,
        }
        Headers: {
          "Content-Type": "application/json",
        },
      );
      
      // Pass the complete response data - it includes both message and sources
      setUserData((prev) => ({
        ...prev,
        favoriteSources: response.data,
      }));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      // Set empty data structure with message on error
      setUserData((prev) => ({
        ...prev,
        favoriteSources: {
          message: "Error loading favorites. Please try again.",
          sources: []
        },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Back to Home Navigation */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors duration-200 group"
          aria-label="Torna alla Home"
        >
          <ArrowLeft className="h-5 w-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Torna alla Home</span>
        </Link>
      </div>
      
      <div className="flex items-center mb-6">
        <span className="text-3xl text-gray-700 font-bold">Impostazioni</span>
      </div>
      
      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden sm:inline">Profilo</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key size={16} />
            <span className="hidden sm:inline">Chiavi API</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <LinkIcon size={16} />
            <span className="hidden sm:inline">Preferiti</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart size={16} />
            <span className="hidden sm:inline">Statistiche</span>
          </TabsTrigger>
        </TabsList>
  
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <TabsContent value="profile" className="mt-0">
            <ProfileSection />
          </TabsContent>
  
          <TabsContent value="api" className="mt-0">
            <ApiKeySection currentApiKey={userData.apiToken} />
          </TabsContent>
  
          <TabsContent value="favorites" className="mt-0">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-8 w-8 bg-green-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 mb-2.5"></div>
                  <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>
              </div>
            ) : (
              <FavoritesSection favoriteSources={userData.favoriteSources} />
            )}
          </TabsContent>
  
          <TabsContent value="stats" className="mt-0">
            <StatsSection />
          </TabsContent>
        </motion.div>
      </Tabs>
    </motion.div>
  );
}