import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  image: string; // Changed from icon to image
}

interface HeroSlide {
  id: number;
  image: string;
}

const HeroCategoriesSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const categories: Category[] = [
    { id: 'electronics', name: 'Electronics', image: "/electronics.png" },
    { id: 'home-garden', name: 'Home & garden', image: "/home.png" },
    { id: 'health-beauty', name: 'Health & beauty', image: "/health.png" },
    { id: 'babies-kids', name: 'Babies and kids', image: "/babies.png" },
    { id: 'sports-outdoors', name: 'Sports and outdoors', image: "/sports.png" },
    { id: 'automotive', name: 'Automotive', image: "/automotive.png" },
    { id: 'fashion', name: 'Fashion', image: "/fashion.png" },
    { id: 'food-beverages', name: 'Food and beverages', image: "/food.png" },
    { id: 'books', name: 'Books', image: "/books.png" }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleCategoryClick = (categoryId: string) => {
    console.log('Selected category:', categoryId);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <div className="w-[90%] flex flex-col justify-center mx-auto">
      {/* Hero Banner */}
      <div className="relative rounded-2xl mx-4 mt-4 overflow-hidden">
        <div className="relative w-full h-[120px] sm:h-[300px]"> {/* Increased height for full image display */}
          
          {/* Full Width Image */}
          <div className="absolute inset-0 w-full h-[400px] sm:h-full">
            <img 
              src={currentSlideData.image} 
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-[30%] sm:h-full object-cover"
            />
            
            {/* Optional: Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10"></div>
          </div>

          {/* Content Area - You can add text/content here if needed */}
          <div className="absolute inset-0 flex items-center">
            <div className="p-8 text-white max-w-2xl">
              {/* Add your slide titles, subtitles, or buttons here if needed */}
              {/* Example:
              <h2 className="text-4xl font-bold mb-4">Slide Title</h2>
              <p className="text-lg mb-6">Slide subtitle goes here</p>
              <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold">
                Action Button
              </button>
              */}
            </div>
          </div>

          {/* Navigation Arrows */}
          {/* <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-20 hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-200 z-10"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-20 hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-200 z-10"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button> */}
        </div>

        {/* Carousel Indicators */}
        {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div> */}
      </div>

      {/* Categories Section */}
      <div className="px-4 py-8">
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/${category.id}`}
              className="flex flex-col items-center group"
            >
              {/* Image Circle */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-all duration-200 group-hover:scale-105 transform overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Category Name */}
              <span className="text-xs md:text-sm text-gray-700 text-center font-medium leading-tight">
                {category.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Slide Information */}
      
    </div>
  );
};

export default HeroCategoriesSection;