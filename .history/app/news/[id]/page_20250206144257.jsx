'use client';
import NewsArticle from "@/components/news-article";
import {use } from "react";


export default function News({params}) {
  const unwrappedParams = use(params);
  const {id} = unwrappedParams;

  return (
    <NewsArticle id={id} />
  );
}

