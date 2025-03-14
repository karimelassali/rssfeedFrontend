"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, MoreHorizontal, CheckCircle, Clock, AlertCircle, GripVertical, ArrowLeft } from 'lucide-react'
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

// Define our color scheme
const colors = {
  blue: "#0F2A43",
  gray: "#F5F6F7",
  green: "#22C55E",
}

export default function Dashboard({ isHomepage = true }) {
  const [posts, setPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredPosts, setFilteredPosts] = useState([])
  const [scheduledPosts, setScheduledPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)
  const [draggedOverItem, setDraggedOverItem] = useState(null)
  
  // Map API publishType values to UI display values
  const mapPublishType = (type) => {
    switch(type) {
      case "now":
        return "published";
      case "schedule":
        return "scheduled";
      case "failed":
        return "failed";
      default:
        return type;
    }
  }
  
  // Fetch posts with error handling and loading states
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    
    const fetchPosts = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/publishedArticles', { 
          signal,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Process the data with the actual structure
        const processedPosts = data.data.map(post => ({
          ...post,
          // Create a displayPublishType for UI rendering
          displayPublishType: mapPublishType(post.publishType),
          // Use scheduled time if available or fallback to date + time
          publishDate: post.scheduledTime || `${post.date} ${post.time || ''}`
        }))
        
        setPosts(processedPosts)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching posts:', error)
          setError('Failed to load posts. Please try again later.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
    
    // Clean up the request if the component unmounts
    return () => controller.abort()
  }, [])

  // Filter posts based on search term and active tab
  useEffect(() => {
    if (posts.length === 0) {
      setFilteredPosts([])
      setScheduledPosts([])
      return
    }
    
    let result = [...posts]

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by publishType (using displayPublishType for UI matching)
    if (activeTab !== "all") {
      result = result.filter((post) => post.displayPublishType === activeTab)
    }

    setFilteredPosts(result)

    // Set scheduled posts separately for reordering
    setScheduledPosts(
      posts
        .filter((post) => post.displayPublishType === "scheduled")
        .sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate)),
    )
  }, [searchTerm, activeTab, posts])

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

  const handleDrop = async (e, index) => {
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
      
      // Here you could add an API call to update the order on the server
      try {
        // Example API call to update order
        // await fetch('/api/updateScheduledOrder', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(newItems.map(item => item.id))
        // });
      } catch (error) {
        console.error('Failed to update order:', error);
        // You could revert the order here if the API call fails
      }
    }
    
    // Reset
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  // Format the date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  // Status badge component with appropriate styling
  const StatusBadge = ({ displayPublishType }) => {
    switch (displayPublishType) {
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
              <StatusBadge displayPublishType={post.displayPublishType} />
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
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDeleteClick(post)}
                  >
                    Delete post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 flex-1">{post.description || "No description available"}</p>

            <div className="flex justify-between items-center mt-auto pt-4 border-t">
              <Badge variant="outline" className="bg-[#F5F6F7]">
                {post.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {post.displayPublishType === "published" ? "Published" : post.displayPublishType === "scheduled" ? "Scheduled" : "Failed"} on{" "}
                {formatDate(post.publishDate)}
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
                  <StatusBadge displayPublishType={post.displayPublishType} />
                  <span className="text-xs text-muted-foreground">
                    Scheduled for {formatDate(post.publishDate)}
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
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDeleteClick(post)}
                  >
                    Delete post
                  </DropdownMenuItem>
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
        {/* Back to Home Navigation */}
        <div className="mb-2">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#22C55E] transition-colors duration-200 group"
            aria-label="Torna alla Home Pagina"
          >
            <ArrowLeft className="h-5 w-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Torna alla Home Pagina</span>
          </Link>
        </div>
      
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
  
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
  
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

  const [postToDelete, setPostToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (post) => {
    setPostToDelete(post)
  }

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/articles/delete/${postToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      // Remove the deleted post from state
      setPosts(posts.filter(post => post.id !== postToDelete.id))
      setPostToDelete(null)
    } catch (error) {
      console.error('Error deleting post:', error)
      setError('Failed to delete post. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setPostToDelete(null)
  }

  // Update the DropdownMenuItem in renderPostCard
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
              <StatusBadge displayPublishType={post.displayPublishType} />
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
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDeleteClick(post)}
                  >
                    Delete post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 flex-1">{post.description || "No description available"}</p>

            <div className="flex justify-between items-center mt-auto pt-4 border-t">
              <Badge variant="outline" className="bg-[#F5F6F7]">
                {post.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {post.displayPublishType === "published" ? "Published" : post.displayPublishType === "scheduled" ? "Scheduled" : "Failed"} on{" "}
                {formatDate(post.publishDate)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Update the DropdownMenuItem in renderScheduledPostsList
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
                  <StatusBadge displayPublishType={post.displayPublishType} />
                  <span className="text-xs text-muted-foreground">
                    Scheduled for {formatDate(post.publishDate)}
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
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDeleteClick(post)}
                  >
                    Delete post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col space-y-8">
        {/* Back to Home Navigation */}
        <div className="mb-2">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#22C55E] transition-colors duration-200 group"
            aria-label="Torna alla Home Pagina"
          >
            <ArrowLeft className="h-5 w-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Torna alla Home Pagina</span>
          </Link>
        </div>
      
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
  
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
  
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
  
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!postToDelete} onOpenChange={() => !isDeleting && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post
              {postToDelete?.title && ` "${postToDelete.title}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}