import Image from "next/image";
import React from "react";

export default function ArticleCardGrid() {
  // Sample article data
  const articles = [
    {
      id: 1,
      title: "How to Master Web Development in 2025",
      excerpt: "Learn the latest techniques and tools for modern web development.",
      image: "/images/grid-image/image-01.jpg",
      date: "March 15, 2025",
      category: "Development"
    },
    {
      id: 2,
      title: "Design Trends That Will Dominate This Year",
      excerpt: "Explore the cutting-edge design patterns reshaping digital experiences.",
      image: "/images/grid-image/image-05.jpg",
      date: "March 10, 2025",
      category: "Design"
    },
    {
      id: 3,
      title: "The Future of AI in Everyday Applications",
      excerpt: "Discover how artificial intelligence is transforming common software.",
      image: "/images/grid-image/image-06.png",
      date: "March 5, 2025",
      category: "Technology"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 p-4">
      {articles.map((article) => (
        <div 
          key={article.id} 
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="relative h-48">
            <Image
              src={article.image}
              alt={article.title}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
                {article.category}
              </span>
            </div>
          </div>
          
          <div className="p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {article.date}
            </p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {article.excerpt}
            </p>
            <button className="text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline">
              Read More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}