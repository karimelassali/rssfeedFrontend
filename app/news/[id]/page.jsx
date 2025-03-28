'use client';
import React from 'react';
import NewsArticle from "@/components/news-article";

export default function News({params}) {
  const resolved  = React.use(params);
  const id = resolved.id;

  return (
    <NewsArticle id={id} />
  );
}

