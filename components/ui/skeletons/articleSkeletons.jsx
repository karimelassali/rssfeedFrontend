import { motion } from 'framer-motion';

const ArticleSkeleton = () => {
  return (
    <motion.div
      key="article-skeleton"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6 max-w-3xl"
    >
      {/* Header Skeleton */}
      <header className="mb-6">
        {/* Logo placeholder */}
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        
        {/* Optional annulingEditing placeholder can go here */}
        
        {/* Source tag placeholder */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
          <span className="source-tag bg-green-100 text-green-800 px-2 py-0.5 rounded">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </span>
        </div>
      </header>

      {/* Title skeleton */}
      <div className="h-6 w-full bg-gray-200 rounded mb-3 animate-pulse" />

      {/* Publication date skeleton */}
      <div className="h-4 w-24 bg-gray-200 rounded mb-4 animate-pulse" />

      {/* Image skeleton */}
      <div className="relative w-full h-64 mb-6">
        <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Description skeleton */}
      <div className="prose max-w-none mb-8 space-y-4">
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Button skeleton */}
      <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
    </motion.div>
  );
};

export default ArticleSkeleton;
