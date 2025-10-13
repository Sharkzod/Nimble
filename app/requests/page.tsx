'use client';
import React, { useState } from 'react';
import { Heart, Link, Star } from 'lucide-react';
import Header from '../components/TopBar';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNav';
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  maxRating: 5;
  image: string;
  location: string;
  isWishlisted: boolean;
}

const MostPurchasedSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Photopulse camera',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/camera.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    },
    {
      id: '2',
      name: 'Ordinary skincare set',
      price: 40000,
      rating: 5,
      maxRating: 5,
      image: '/body.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    },
    {
      id: '3',
      name: 'Ultra hydrating moisturizer',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/cream.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    },
    {
      id: '4',
      name: 'HP laptop',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/laptop2.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    },
    {
      id: '5',
      name: 'Photopulse camera',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/car.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    },
    {
      id: '6',
      name: 'Photopulse camera',
      price: 40000,
      rating: 5,
      maxRating: 5,
      image: '/camera.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    },
    {
      id: '7',
      name: 'Photopulse camera',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/body.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    },
    {
      id: '8',
      name: 'Photopulse camera',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/camera.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    }
  ]);

  const toggleWishlist = (productId: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, isWishlisted: !product.isWishlisted }
          : product
      )
    );
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const renderStars = (rating: number, maxRating: number) => {
    return Array.from({ length: maxRating }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleProductClick = (productId: string) => {
    console.log('Product clicked:', productId);
  };

  return (
    <div className='w-full min-h-screen bg-white'>
      {/* Header - Visible only on desktop/tablet */}
      <div className="hidden md:block">
        <Header/>
      </div>
      
      {/* Main Content with bottom padding for mobile nav */}
      <main className="pb-20 md:pb-0">
        <div className="w-full max-w-6xl mx-auto px-4 py-8 bg-white mt-0 sm:mt-[15px]">
          
          {/* Section Header */}
          <div className='flex justify-between items-center'>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Requests</h2>
            </div>
            <a href='/requests/create-request' className='bg-[#FE7A36] text-white px-4 py-2 rounded-[100px] mb-4'>
              Create request
            </a>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                onClick={() => handleProductClick(product.id)}
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      // Fallback to a placeholder if image doesn't load
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgMTEyLjVIMTc1VjE4Ny41SDEyNVYxMTIuNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                    }}
                  />
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-colors duration-200"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        product.isWishlisted
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600 hover:text-red-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(product.rating, product.maxRating)}
                  </div>

                  {/* Product Name */}
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Location */}
                  <p className="text-xs text-gray-500">
                    {product.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <Footer/>
      </main>
      
      {/* Bottom Navigation - Visible only on mobile */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default MostPurchasedSection;