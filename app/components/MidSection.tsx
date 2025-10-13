import React, { useState, useEffect } from 'react';
import { useFetchCategories } from '../lib/hooks/useCategoryApis/useFetchCategories';
import Link from 'next/link';

// Define fallback categories in case API fails
const fallbackCategories = [
  { _id: 'electronics', name: 'Electronics', image: "/electronics.png" },
  { _id: 'home-garden', name: 'Home & Garden', image: "/home.png" },
  { _id: 'health-beauty', name: 'Health & Beauty', image: "/health.png" },
  { _id: 'babies-kids', name: 'Babies and Kids', image: "/babies.png" },
  { _id: 'sports-outdoors', name: 'Sports and Outdoors', image: "/sports.png" },
  { _id: 'automotive', name: 'Automotive', image: "/automotive.png" },
  { _id: 'fashion', name: 'Fashion', image: "/fashion.png" },
  { _id: 'food-beverages', name: 'Food and Beverages', image: "/food.png" },
  { _id: 'books', name: 'Books', image: "/books.png" }
];

interface BackendCategory {
  _id: string;
  name: string;
  image?: string;
  icon?: string;
  description?: string;
}

interface HeroSlide {
  id: number;
  image: string;
}

const HeroCategoriesSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Use our custom hook to fetch categories
  const { categories: backendCategories, loading, error } = useFetchCategories();

  const heroSlides: HeroSlide[] = [
    {
      id: 1,
      image: "/slide1.png",
    },
    {
      id: 2,
      image: "/slide2.png",
    },
  ];

  // Transform backend categories to frontend format
  const transformCategories = (categories: BackendCategory[]) => {
    return categories.map(category => ({
      id: category._id, // This will be the actual MongoDB ID
      name: category.name,
      image: category.image || getFallbackImage(category.name)
    }));
  };

  // Get fallback image based on category name
  const getFallbackImage = (categoryName: string) => {
    const fallback = fallbackCategories.find(cat => 
      cat.name.toLowerCase().includes(categoryName.toLowerCase()) ||
      categoryName.toLowerCase().includes(cat.name.toLowerCase())
    );
    return fallback?.image || '/placeholder-category.png';
  };

  // Use backend categories or fallback if API fails
  const categories = backendCategories && backendCategories.length > 0 
    ? transformCategories(backendCategories)
    : fallbackCategories.map(cat => ({ ...cat, id: cat._id }));

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const currentSlideData = heroSlides[currentSlide];

  // Loading skeleton for categories
  const renderCategorySkeleton = () => (
    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-6 max-w-6xl mx-auto">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-full mb-3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-[90%] flex flex-col justify-center mx-auto">
      {/* Hero Banner */}
      <div className="relative rounded-2xl mx-4 mt-4 overflow-hidden">
        <div className="relative w-full h-[120px] sm:h-[300px]">
          
          {/* Full Width Image */}
          <div className="absolute inset-0 w-full h-[400px] sm:h-full">
            <img 
              src={currentSlideData.image} 
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-[30%] sm:h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgMTEyLjVIMTc1VjE4Ny41SDEyNVYxMTIuNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
              }}
            />
            
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10"></div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-4 py-8">
        {/* Error Message */}
        {/* {error && (
          <div className="text-center mb-4">
            <div className="text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 inline-block">
              Using fallback categories: {error}
            </div>
          </div>
        )} */}

        {/* Categories Grid */}
        {loading ? (
          renderCategorySkeleton()
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="flex flex-col items-center group"
              >
                {/* Image Circle */}
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-all duration-200 group-hover:scale-105 transform overflow-hidden border-2 border-transparent group-hover:border-blue-500">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSA0LjQ5LTQuNDlMMTIgMTEuNTFsNi41MS02LjUyTDE5IDdsLTcgN3oiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                    }}
                  />
                </div>
                
                {/* Category Name */}
                <span className="text-xs md:text-sm text-gray-700 text-center font-medium leading-tight group-hover:text-blue-600 transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && !error && (
          <div className="text-center py-8">
            <div className="text-gray-500">No categories found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroCategoriesSection;