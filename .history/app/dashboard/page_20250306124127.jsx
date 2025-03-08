"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, MoreHorizontal, CheckCircle, Clock, AlertCircle, GripVertical } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// Define our color scheme
const colors = {
  blue: "#0F2A43",
  gray: "#F5F6F7",
  green: "#22C55E",
}

// Sample data for posts
const [samplePosts, setSamplePosts] = useState([
  {
    id: "1",
    title: "10 Tips for Better Content Marketing",
    description: "Learn how to improve your content marketing strategy with these expert tips.",
    publishDate: "2023-10-15",
    status: "published",
    image: "https://imgs.search.brave.com/CFoRBLlcAtS1HK3P3N1exBlQGBpxtkNK1f-BqJVLE9o/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9keWwz/NDdoaXd2M2N0LmNs/b3VkZnJvbnQubmV0/L2FwcC91cGxvYWRz/LzIwMjUvMDIvSU1H/Mi1zY2FsZWQuanBn",
    category: "Marketing",
  },
  {
    id: "2",
    title: "The Future of AI in Journalism",
    description: "Exploring how artificial intelligence is transforming the journalism industry.",
    publishDate: "2023-10-20",
    status: "published",
    image: "https://imgs.search.brave.com/CFoRBLlcAtS1HK3P3N1exBlQGBpxtkNK1f-BqJVLE9o/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9keWwz/NDdoaXd2M2N0LmNs/b3VkZnJvbnQubmV0/L2FwcC91cGxvYWRz/LzIwMjUvMDIvSU1H/Mi1zY2FsZWQuanBn",
    category: "Technology",
  },
  {
    id: "3",
    title: "Understanding Web3 and Blockchain",
    description: "A comprehensive guide to understanding Web3 technologies and blockchain.",
    publishDate: "2023-10-25",
    status: "scheduled",
    image: "https://imgs.search.brave.com/CFoRBLlcAtS1HK3P3N1exBlQGBpxtkNK1f-BqJVLE9o/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9keWwz/NDdoaXd2M2N0LmNs/b3VkZnJvbnQubmV0/L2FwcC91cGxvYWRz/LzIwMjUvMDIvSU1H/Mi1zY2FsZWQuanBn",
    category: "Technology",
  },
  {
    id: "4",
    title: "Social Media Trends for 2024",
    description: "Stay ahead of the curve with these predicted social media trends for next year.",
    publishDate: "2023-11-01",
    status: "scheduled",
    image: "https://imgs.search.brave.com/CFoRBLlcAtS1HK3P3N1exBlQGBpxtkNK1f-BqJVLE9o/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9keWwz/NDdoaXd2M2N0LmNs/b3VkZnJvbnQubmV0/L2FwcC91cGxvYWRz/LzIwMjUvMDIvSU1H/Mi1zY2FsZWQuanBn",
    category: "Social Media",
  },
  {
    id: "5",
    title: "How to Optimize Your SEO Strategy",
    description: "Failed to publish due to missing metadata.",
    publishDate: "2023-10-10",
    status: "failed",
    image: "https://imgs.search.brave.com/CFoRBLlcAtS1HK3P3N1exBlQGBpxtkNK1f-BqJVLE9o/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9keWwz/NDdoaXd2M2N0LmNs/b3VkZnJvbnQubmV0/L2FwcC91cGxvYWRz/LzIwMjUvMDIvSU1H/Mi1zY2FsZWQuanBn",
    category: "SEO",
  },
])

export default function Dashboard({ isHomepage = true }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredPosts, setFilteredPosts] = useState(samplePosts)
  const [scheduledPosts, setScheduledPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [draggedItem, setDraggedItem] = useState(null)
  const [draggedOverItem, setDraggedOverItem] = useState(null)



  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/publishedArticles')
        const data = await response.json()
        setSamplePosts(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching posts:', error)
        setIsLoading(false)
      }
    }

    fetchPosts()
  },[])

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter posts based on search term and active tab
  useEffect(() => {
    let result = samplePosts

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (activeTab !== "all") {
      result = result.filter((post) => post.status === activeTab)
    }

    setFilteredPosts(result)

    // Set scheduled posts separately for reordering
    setScheduledPosts(
      samplePosts
        .filter((post) => post.status === "scheduled")
        .sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate)),
    )
  }, [searchTerm, activeTab])

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    // Set a transparent drag image
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDraggedOverItem(index);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    
    // If the item is dropped in a different position
    if (draggedItem !== index) {
      const newItems = [...scheduledPosts];
      const draggedItemContent = newItems[draggedItem];
      
      // Remove the dragged item
      newItems.splice(draggedItem, 1);
      
      // Add it at the new position
      newItems.splice(index, 0, draggedItemContent);
      
      // Update the state
      setScheduledPosts(newItems);
    }
    
    // Reset
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  // Status badge component with appropriate styling
  const StatusBadge = ({ status }) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-[#22C55E] hover:bg-[#22C55E]/80 text-white flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Published
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="border-[#0F2A43] text-[#0F2A43] flex items-center gap-1">
            <Clock className="w-3 h-3" /> Scheduled
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Failed
          </Badge>
        )
      default:
        return null
    }
  }

  // Render post card based on status
  const renderPostCard = (post) => {
    return (
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Article Image */}
          <div className="w-full h-48 overflow-hidden">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            />
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <StatusBadge status={post.status} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit post</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete post</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 flex-1">{post.description}</p>

            <div className="flex justify-between items-center mt-auto pt-4 border-t">
              <Badge variant="outline" className="bg-[#F5F6F7]">
                {post.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {post.status === "published" ? "Published" : post.status === "scheduled" ? "Scheduled" : "Failed"} on{" "}
                {post.publishDate}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render scheduled posts list with drag and drop
  const renderScheduledPostsList = () => {
    if (scheduledPosts.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No scheduled posts found</h3>
          <p className="text-muted-foreground mt-1">Try creating a new scheduled post</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {scheduledPosts.map((post, index) => (
          <div
            key={post.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-4 bg-white rounded-lg shadow p-4 border ${
              draggedItem === index ? "opacity-50" : ""
            } ${draggedOverItem === index ? "border-[#22C55E] border-2" : ""}`}
          >
            <div className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </div>
            <div className="flex-1 flex items-center gap-4">
              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{post.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={post.status} />
                  <span className="text-xs text-muted-foreground">
                    Scheduled for {post.publishDate}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit post</DropdownMenuItem>
                  <DropdownMenuItem>Reschedule</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete post</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col space-y-8">
        {/* Fixed Height Header to prevent shifting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-h-[80px]">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Posts</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor all your published content</p>
          </div>
          {isHomepage && (
            <Link href="/" className="bg-[#22C55E] p-2 flex items-center justify-center rounded-md hover:bg-[#22C55E]/90 text-white">
              <Plus className="mr-2 h-4 w-4" /> Publish new post
            </Link>
          )}
        </div>

        {/* Tabs and Search */}
        <div className="grid gap-4 md:grid-cols-[1fr_300px]">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#22C55E] data-[state=active]:text-white">
                All
              </TabsTrigger>
              <TabsTrigger
                value="published"
                className="data-[state=active]:bg-[#22C55E] data-[state=active]:text-white"
              >
                Published
              </TabsTrigger>
              <TabsTrigger
                value="scheduled"
                className="data-[state=active]:bg-[#22C55E] data-[state=active]:text-white"
              >
                Scheduled
              </TabsTrigger>
              <TabsTrigger value="failed" className="data-[state=active]:bg-[#22C55E] data-[state=active]:text-white">
                Failed
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Posts Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6 space-y-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="flex justify-between items-center pt-4">
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : (
            <>
              {activeTab === "scheduled" ? (
                renderScheduledPostsList()
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  {filteredPosts.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <h3 className="text-lg font-medium">No posts found</h3>
                      <p className="text-muted-foreground mt-1">Try adjusting your search criteria</p>
                    </div>
                  ) : (
                    filteredPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        layout
                      >
                        {renderPostCard(post)}
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}