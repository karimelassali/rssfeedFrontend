'use client';
import NewsArticle from "@/components/news-article";

export default function News({params}) {
  const {id} = params;

  return (
    <NewsArticle id={id} />
  );
}