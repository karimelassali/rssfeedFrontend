'use client';
import NewsArticle from "@/components/news-article";
import {use } from "react";


export default function News({params}) {
  const 
  const id = params.id;

  return (
    <NewsArticle id={id} />
  );
}

