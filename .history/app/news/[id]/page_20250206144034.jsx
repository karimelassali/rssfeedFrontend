'use client';
import NewsArticle from "@/components/news-article";
import {useRouter} from "next/navigation"


export default function News({params}) {
  
  const id = params.id;

  return (
    <NewsArticle 
  );
}

