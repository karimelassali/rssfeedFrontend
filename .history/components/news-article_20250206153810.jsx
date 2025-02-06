"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Edit2 } from "lucide-react"
import Image from "next/image"
import axios from "axios"

export default function NewsArticle({id}) {
  const [isEditing, setIsEditing] = useState(false)
  const [articleData, setArticleData] = useState({})

  const [aiResponse, setAiResponse] = useState("");

  const toggleEdit = () => {
    setIsEditing(!isEditing)
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

/*************  ✨ Codeium Command 🌟  *************/
  return (
    <AnimatePresence>
      {aiResponse ? (
        <motion.div
          key="ai-response"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <p>{aiResponse}</p>
        </motion.div>
      ) : (
        <motion.div
          key="article-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <p>{articleData.content}</p>
        </motion.div>
      )}
    </AnimatePresence>
    (
      {
        aiResponse ? (
          <div>
            <p>{aiResponse}</p>
          </div>
        ) : (
          <div>
            <p>{articleData.content}</p>
          </div>
        )
      }
    )
  );
}
/******  bcee9770-38dd-45ac-b84e-26b56c59d3f0  *******/

