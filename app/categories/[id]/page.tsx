'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '../../components/TopBar'
import { Heart, Star, RefreshCw } from 'lucide-react';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFetchParentCategory } from '../../lib/hooks/useCategoryApis/useFetchParentCategory';
import { useWishlist } from '../../lib/hooks/useProductApis/useWishlist';

// Interfaces
interface SubCategory {
  id: string;
  name: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  maxRating: number;
  image: string;
  location: string;
  isWishlisted: boolean;
  vendor: string;
}

interface BackendSubCategory {
  _id: string;
  name: string;
  image?: string;
}

interface BackendProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  images?: string[];
  vendor?: {
    location?: string;
    businessName?: string;
  };
}

interface ParentCategory {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

const Category = () => {
  const router = useRouter();
  const params = useParams();
  const parentCategoryId = params.id as string;

  // Use the hook - now it returns real data from API including parent category details
  const { 
    category, 
    subCategories: backendSubCategories, 
    products: backendProducts, 
    loading, 
    error,
    pagination,
    loadMoreProducts
  } = useFetchParentCategory(parentCategoryId);

  

  console.log('🔍 DEBUG Category Component:');
  console.log('🔍 parentCategoryId:', parentCategoryId);
  console.log('🔍 category data:', category);
  console.log('🔍 loading:', loading);
  console.log('🔍 error:', error);
  console.log('🔍 backendSubCategories:', backendSubCategories?.length);
  console.log('🔍 backendProducts:', backendProducts?.length);

  const { toggleWishlist, loading: wishlistLoading } = useWishlist();

  // Transform backend subcategories to frontend format
  const transformSubCategories = (subCategories: BackendSubCategory[]): SubCategory[] => {
    return subCategories.map(subCategory => ({
      id: subCategory._id,
      name: subCategory.name,
      image: subCategory.image || getFallbackImage(subCategory.name)
    }));
  };

  // Transform backend products to frontend format
  const transformProduct = (product: BackendProduct): Product => ({
    id: product._id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    rating: product.rating || 4,
    maxRating: 5,
    image: product.images?.[0] || '/placeholder-product.png',
    location: product.vendor?.location || 'Location not specified',
    isWishlisted: false,
    vendor: product.vendor?.businessName || 'Unknown Vendor'
  });

  // Get fallback image based on category name
  const getFallbackImage = (categoryName: string): string => {
    const fallbackImages: Record<string, string> = {
      'skincare': '/electronics.png',
      'hair': '/home.png',
      'oral': '/health.png',
      'makeup': '/babies.png',
      'fragrance': '/sports.png',
      'wellness': '/automotive.png',
      'beauty': '/food.png'
    };

    const key = Object.keys(fallbackImages).find(k => 
      categoryName.toLowerCase().includes(k)
    );
    return key ? fallbackImages[key] : '/placeholder-category.png';
  };

  const [transformedSubCategories, setTransformedSubCategories] = useState<SubCategory[]>([]);
  const [transformedProducts, setTransformedProducts] = useState<Product[]>([]);

  // Transform data when backend data changes
  useEffect(() => {
    console.log('🔄 Transforming backend data...');
    
    if (backendSubCategories && backendSubCategories.length > 0) {
      const transformed = transformSubCategories(backendSubCategories);
      setTransformedSubCategories(transformed);
      console.log('✅ Transformed subcategories:', transformed.length);
    } else {
      console.log('⚠️ No subcategories from backend');
      setTransformedSubCategories([]);
    }

    if (backendProducts && backendProducts.length > 0) {
      const transformed = backendProducts.map(transformProduct);
      setTransformedProducts(transformed);
      console.log('✅ Transformed products:', transformed.length);
    } else {
      console.log('⚠️ No products from backend');
      setTransformedProducts([]);
    }
  }, [backendSubCategories, backendProducts]);

  const handleWishlistToggle = async (productId: string, currentStatus: boolean) => {
    try {
      const newStatus = await toggleWishlist(productId, currentStatus);
      
      // Update local state optimistically
      setTransformedProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, isWishlisted: newStatus }
            : product
        )
      );
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
    }
  };

  const formatPrice = (price: number): string => {
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
    router.push(`/product/${productId}`);
  };

  // Loading skeleton for subcategories
  const renderSubCategoriesSkeleton = () => (
    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-6 max-w-6xl mx-auto">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-full mb-3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  // Loading skeleton for products
  const renderProductsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Use actual category name from API - this is now the parent category name
const typedCategory = category as ParentCategory | null | undefined;
  const categoryName = typedCategory?.name || 'Category';


  return (
    <div className='w-full h-full flex flex-col text-black justify-center items-center'>
      <Header/>
      <div className='w-[90%]'>
        {/* Category Title - Now shows actual parent category name from API */}
        <div className="my-6">
          <h1 className='text-2xl font-bold'>{categoryName}</h1>
          {typedCategory?.description && (
            <p className="text-gray-600 mt-2">{typedCategory.description}</p>
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">Error loading category: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* SubCategories Section */}
        <div className="px-4 mb-8">
          {loading ? (
            renderSubCategoriesSkeleton()
          ) : (
            <>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-6 max-w-6xl mx-auto">
                {transformedSubCategories.map((subCategory) => (
                  <Link
                    key={subCategory.id}
                    href={`/subcategory/${subCategory.id}`}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    {/* Image Circle */}
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-all duration-200 group-hover:scale-105 transform overflow-hidden">
                      <img 
                        src={subCategory.image} 
                        alt={subCategory.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNGM0Y0RjYiLz4KPC9zdmc+';
                        }}
                      />
                    </div>
                    
                    {/* SubCategory Name */}
                    <span className="text-[10px] md:text-[11.3px] text-gray-700 text-center font-medium leading-tight group-hover:text-blue-600 transition-colors">
                      {subCategory.name}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Empty state for subcategories */}
              {!loading && transformedSubCategories.length === 0 && !error && (
                <div className="text-center py-8">
                  <div className="text-gray-500">No subcategories found for {categoryName}</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Products Section */}
        <h1 className='mt-[30px] mb-[20px] font-bold text-[22px]'>Trending from {categoryName}</h1>
        
        {loading ? (
          renderProductsSkeleton()
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {transformedProducts.map((product) => (
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
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgMTEyLjVIMTc1VjE4Ny41SDEyNVYxMTIuNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                      }}
                    />
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(product.id, product.isWishlisted);
                      }}
                      disabled={wishlistLoading}
                      className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-colors duration-200 disabled:opacity-50"
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
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.rating})
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Vendor */}
                    <p className="text-xs text-gray-600 mb-2">
                      By {product.vendor}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
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

            {/* Load More Button */}
            {pagination?.hasNext && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMoreProducts}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2 font-medium"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Products'
                  )}
                </button>
              </div>
            )}

            {/* Empty state for products */}
            {!loading && transformedProducts.length === 0 && !error && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No products found in {categoryName}</div>
                <p className="text-gray-400">Check back later for new products</p>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="w-[98.8vw] relative left-0 overflow-x-hidden mt-10">
        <Footer/>
      </div>
    </div>
  )
}

export default Category