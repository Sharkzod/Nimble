'use client'
import ProductDetailPage from '@/app/components/ProductDetail'
import ReviewsSectionComponent from '@/app/components/ProductReview'
import Header from '@/app/components/TopBar'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Star, Heart } from 'lucide-react';
import Footer from '@/app/components/Footer'
import { useFetchProduct } from '../../lib/hooks/useProductApis/useFetchProduct'
import { useWishlist } from '../../lib/hooks/useProductApis/useWishlist'

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  images: string[];
  vendor?: {
    _id: string;
    businessName: string;
    location?: string;
  };
  category?: {
    _id: string;
    name: string;
  };
  description?: string;
  isWishlisted?: boolean;
}

const Product = () => {
  const params = useParams();
  const productId = params.id as string;

  const { 
    product, 
    similarProducts, 
    sellerProducts, 
    loading, 
    error 
  } = useFetchProduct(productId);

  const { toggleWishlist, loading: wishlistLoading } = useWishlist();

  // Vendor transformation function
  const transformVendor = (vendor: any): { _id: string; businessName: string; location?: string } | undefined => {
    if (!vendor) return undefined;
    
    console.log('🔄 Transforming vendor:', vendor);
    
    // If vendor is a string, convert to vendor object
    if (typeof vendor === 'string') {
      return {
        _id: '',
        businessName: vendor
      };
    }
    
    // If vendor is an object with _id and name properties
    if (typeof vendor === 'object' && vendor !== null) {
      return {
        _id: vendor._id || '',
        businessName: vendor.businessName || vendor.name || 'Unknown Vendor',
        location: vendor.location
      };
    }
    
    return undefined;
  };

  // Transform backend products to frontend format
  const transformProduct = (product: any): Product => ({
    _id: product._id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    rating: product.averageRating || product.rating || 4,
    images: product.images || ['/placeholder-product.png'],
    vendor: transformVendor(product.vendor), // Use the transform function here
    category: product.category,
    description: product.description,
    isWishlisted: product.isWishlisted || false
  });

  const [transformedSimilarProducts, setTransformedSimilarProducts] = useState<Product[]>([]);
  const [transformedSellerProducts, setTransformedSellerProducts] = useState<Product[]>([]);

  // Transform data when backend data changes
  useEffect(() => {
    console.log('🔄 Transforming product data...');
    
    if (similarProducts && similarProducts.length > 0) {
      const transformed = similarProducts.map(transformProduct);
      setTransformedSimilarProducts(transformed);
      console.log('✅ Transformed similar products:', transformed.length);
    } else {
      console.log('⚠️ No similar products from backend');
      setTransformedSimilarProducts([]);
    }

    if (sellerProducts && sellerProducts.length > 0) {
      const transformed = sellerProducts.map(transformProduct);
      setTransformedSellerProducts(transformed);
      console.log('✅ Transformed seller products:', transformed.length);
    } else {
      console.log('⚠️ No seller products from backend');
      setTransformedSellerProducts([]);
    }
  }, [similarProducts, sellerProducts]);

  const handleWishlistToggle = async (productId: string, currentStatus: boolean) => {
    try {
      const newStatus = await toggleWishlist(productId, currentStatus);
      
      // Update local state optimistically
      setTransformedSimilarProducts(prev => 
        prev.map(product => 
          product._id === productId 
            ? { ...product, isWishlisted: newStatus }
            : product
        )
      );
      
      setTransformedSellerProducts(prev => 
        prev.map(product => 
          product._id === productId 
            ? { ...product, isWishlisted: newStatus }
            : product
        )
      );
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const renderStars = (rating: number, maxRating: number = 5) => {
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

  // Error state
  if (error && !product) {
    return (
      <div className='w-full'>
        <Header/>
        <div className="w-[90%] mx-auto py-8">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">Error loading product</div>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <Header/>
      
      {/* Product Details */}
      <ProductDetailPage 
        product={product as any} 
        loading={loading} 
      />
      
      {/* Reviews Section - Use the transformed vendor */}
      <ReviewsSectionComponent 
        productId={productId}
        vendor={transformVendor(product?.vendor)}
        loading={loading}
      />
      
      {/* Similar Items Section */}
      <div className='w-[90%] mx-auto'>
        <h2 className="text-2xl font-semibold mb-4 mt-10 text-black">Similar Items</h2>
        
        {loading ? (
          renderProductsSkeleton()
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {transformedSimilarProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                  onClick={() => handleProductClick(product._id)}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={product.images[0]}
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
                        handleWishlistToggle(product._id, product.isWishlisted || false);
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
                      {renderStars(product.rating)}
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
                      By {product.vendor?.businessName || 'Unknown Vendor'}
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
                      {product.vendor?.location || 'Location not specified'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state for similar products */}
            {!loading && transformedSimilarProducts.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500">No similar products found</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Other Items from Seller Section */}
      <div className='w-[90%] mx-auto mb-[30px]'>
        <h2 className="text-2xl font-semibold mb-4 mt-10 text-black">Other Items from seller</h2>
        
        {loading ? (
          renderProductsSkeleton()
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {transformedSellerProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                  onClick={() => handleProductClick(product._id)}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={product.images[0]}
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
                        handleWishlistToggle(product._id, product.isWishlisted || false);
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
                      {renderStars(product.rating)}
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
                      By {product.vendor?.businessName || 'Unknown Vendor'}
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
                      {product.vendor?.location || 'Location not specified'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state for seller products */}
            {!loading && transformedSellerProducts.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500">No other products from this seller</div>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer/>
    </div>
  )
}

export default Product