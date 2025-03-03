"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save } from "lucide-react"
import Cookie from "js-cookie"


export default function ProfileSection() {
  const [user, setUser] = useState({
    name: "John Doe",
    email:'john@example.com'
  })
  const [role, setRole] = useState("Content Editor")
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
  }

  const retrieveProfile = () => {
    const info = Cookie.get("user");
    if (info) {
      setUser(JSON.parse(info));
    }

  }

  useEffect(() => {
    retrieveProfile();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#0F2A43]">Profile Information</CardTitle>
        <CardDescription>Manage your personal information and role</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-[#22C55E]">
              <AvatarImage src={`https://api.dicebear.com/9.x/miniavs/svg?seed=${user.name+ new Date().getTime()}`} alt="Profile" />
              <AvatarFallback className="text-2xl bg-[#0F2A43] text-white">JD</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 rounded-full bg-[#22C55E] hover:bg-[#1ea34d] h-8 w-8">
              <Camera size={14} />
            </Button>
          </div>

          <div className="space-y-4 flex-1">
            {isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-[#0F2A43]/20 focus-visible:ring-[#22C55E]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="border-[#0F2A43]/20 focus-visible:ring-[#22C55E]" />
                </div>
                <Button onClick={handleSave} className="bg-[#22C55E] hover:bg-[#1ea34d] mt-2">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="text-lg font-medium">{user.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-lg font-medium">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p className="text-lg font-medium">{role}</p>
                </div>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-[#0F2A43]/20 hover:bg-[#22C55E]/10 hover:text-[#0F2A43] hover:border-[#22C55E]">
                  Edit Profile
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

