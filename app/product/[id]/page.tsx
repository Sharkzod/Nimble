'use client'
import ProductDetailPage from '@/app/components/ProductDetail'
import ReviewsSectionComponent from '@/app/components/ProductReview'
import Header from '@/app/components/TopBar'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, Heart, MapPin, Camera, Trash2, Edit, Minus, Plus } from 'lucide-react';
import Footer from '@/app/components/Footer'
import { useFetchProduct } from '../../lib/hooks/useProductApis/useFetchProduct'
import { useWishlist } from '../../lib/hooks/useProductApis/useWishlist'
import BottomNavigation from '@/app/components/BottomNav'
// import { Product } from '@/app/lib/api/productsApi'

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
  } | string; // Allow vendor to be string or object
  category?: {
    _id: string;
    name: string;
  };
  description?: string;
  isWishlisted?: boolean;
  type?: string;
  color?: string;
  condition?: string;
  gender?: string;
  sizes?: string[];
  bulkPrices?: {
    quantity: number;
    price: number;
  }[];
  colours?: string[];
  status?: string; // Add missing status property
}

interface ColorOption {
  color: string;
  name: string;
}

const Product = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { 
    product, 
    similarProducts, 
    sellerProducts, 
    loading, 
    error 
  } = useFetchProduct(productId);

  const { toggleWishlist, loading: wishlistLoading } = useWishlist();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');

  // Initialize selected size when product loads
  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedSize]);

  const handleWishlistToggle = async (productId: string, currentStatus: boolean) => {
    try {
      await toggleWishlist(productId, currentStatus);
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
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const getVendorLocation = (vendor: Product['vendor']): string => {
  if (!vendor) return 'Location not specified';
  if (typeof vendor === 'string') return vendor;
  return vendor.location || 'Location not specified';
};

// Add a helper function to safely get vendor business name
const getVendorBusinessName = (vendor: Product['vendor']): string => {
  if (!vendor) return 'Unknown Vendor';
  if (typeof vendor === 'string') return vendor;
  return vendor.businessName || 'Unknown Vendor';
};

  // Image gallery functions
 const nextImage = () => {
  if (product && product.images && product.images.length > 0) {
    setCurrentImageIndex((prev) => 
      prev === product.images!.length - 1 ? 0 : prev + 1
    );
  }
};


 const prevImage = () => {
  if (product && product.images && product.images.length > 0) {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images!.length - 1 : prev - 1
    );
  }
};

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  // Get default colors from product or use fallback
const getProductColors = (): ColorOption[] => {
  if (product?.colours && product.colours.length > 0) {
    return product.colours.map((color: string) => ({
      color: color,
      name: color
    }));
  }
  return [
    { color: '#FF6B6B', name: 'Red' },
    { color: '#000000', name: 'Black' },
    { color: '#5B73E8', name: 'Blue' }
  ];
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

  // Desktop Product Detail Section
  const DesktopProductDetail = () => {
    if (loading || !product) {
      return (
        <div className="w-[90%] mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      );
    }

    const productColors = getProductColors();

    return (
      <div className="hidden lg:block w-[90%] mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images - Desktop */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col gap-3">
                {product.images && product.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-all border-2 ${
                    currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.png';
                    }}
                  />
                </div>
              ))}
              </div>
              
              <div className="flex-1 aspect-square bg-gray-900 rounded-2xl overflow-hidden">
               <img
                src={product.images && product.images[currentImageIndex] ? product.images[currentImageIndex] : '/placeholder-product.png'}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.png';
                }}
              />
              </div>
            </div>
          </div>

          {/* Product Details - Desktop */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{getVendorLocation(product.vendor)}</span>
              </div>
              <span className="text-sm text-gray-500">Promoted</span>
            </div>

            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <Camera className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </div>
                <span className="px-4 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  Active
                </span>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="flex-1 space-y-2 text-black">
                <h3 className="font-semibold text-gray-900 text-sm">Quantity:</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQuantity}
                    className="w-9 h-9 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-semibold min-w-8 text-center">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="w-9 h-9 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-gray-900 text-sm">Size:</h3>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-11 h-11 rounded-[100px] border-2 font-semibold transition-all ${
                          selectedSize === size 
                            ? 'border-[#3652AD] bg-[#3652AD] text-white' 
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {productColors.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm">Colors:</h3>
                <div className="flex gap-3">
                  {productColors.map((colorObj, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`w-11 h-11 rounded-full border-2 transition-all ${
                        selectedColor === index ? 'border-gray-800 scale-105' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: colorObj.color }}
                      title={colorObj.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-[#3652AD] border-2 cursor-pointer border-[#3652AD] rounded-[100px] transition-colors font-medium">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button className="flex-1 flex items-center justify-center cursor-pointer gap-2 px-6 py-3.5 bg-[#3652AD] text-white border-2 rounded-[100px] transition-colors font-medium">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Specifications and Description */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="grid grid-cols-2 gap-6">
              {product.type && (
                <div>
                  <h3 className="text-sm text-gray-600 mb-1">Type</h3>
                  <p className="font-semibold text-gray-900">{product.type}</p>
                </div>
              )}
              {product.gender && (
                <div>
                  <h3 className="text-sm text-gray-600 mb-1">Gender</h3>
                  <p className="font-semibold text-gray-900">{product.gender}</p>
                </div>
              )}
              {product.color && (
                <div>
                  <h3 className="text-sm text-gray-600 mb-1">Color</h3>
                  <p className="font-semibold text-gray-900">{product.color}</p>
                </div>
              )}
              {product.condition && (
                <div>
                  <h3 className="text-sm text-gray-600 mb-1">Condition</h3>
                  <p className="font-semibold text-gray-900">{product.condition}</p>
                </div>
              )}
              {product.sizes && product.sizes.length > 0 && (
                <div className="col-span-2">
                  <h3 className="text-sm text-gray-600 mb-2">Sizes</h3>
                  <div className="flex gap-2">
                    {product.sizes.map((size, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-0 sm:p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description || 'No description available'}
            </p>
          </div>
        </div>

        {/* Vendor Address */}
        {product.vendor && typeof product.vendor === 'object' && (
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Seller Address</h2>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-600 mr-2 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">{product.vendor.businessName}</p>
                <p className="text-sm text-gray-600 mt-1">{product.vendor.location || 'Location not specified'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Mobile Product Detail Section
  const MobileProductDetail = () => {
    if (loading || !product) {
      return (
        <div className="lg:hidden w-[90%] mx-auto py-4 animate-pulse">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="lg:hidden w-[90%] mx-auto py-4">
        <div className="space-y-6">
          

          <div className="relative">
            <div 
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
                        <img
            src={product.images && product.images[currentImageIndex] ? product.images[currentImageIndex] : '/placeholder-product.png'}
            alt={`${product.name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.png';
            }}
          />
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {(product.images && product.images.length) || 0}
            </div>
          </div>
           <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{getVendorLocation(product.vendor)}</span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-black text-2xl font-semilight">
               
                <span className="text-xl">{product.name}</span>
              </div>

             <div className="flex items-center text-2xl font-semilight text-[#0DBA37] bg-[#E6FFCF] px-[10px] rounded-[100px]">
               
                <span className="text-xl">{product.status}</span>
              </div>
              
            </div>
            <div className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-white text-[#3652AD] border-2 border-[#3652AD] py-3 px-4 rounded-[100px] cursor-pointer transition-colors font-medium text-sm">
                Message seller
              </button>
              <button className="flex-1 bg-[#3652AD] text-white py-3 px-4 rounded-[100px] transition-colors font-medium text-sm">
                Make an offer
              </button>
            </div>

            <div className="space-y-4">
              {product.bulkPrices && product.bulkPrices.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Bulk price</h3>
                  <div className="space-y-1">
                    {product.bulkPrices.map((bulk, index) => (
                      <div key={index} className="flex justify-between text-gray-700 text-sm">
                        <span>From {bulk.quantity} pieces</span>
                        <span className="font-semibold">{formatPrice(bulk.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {product.type && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Type</h4>
                      <p className="text-gray-600">{product.type}</p>
                    </div>
                  )}
                  {product.color && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Color</h4>
                      <p className="text-gray-600">{product.color}</p>
                    </div>
                  )}
                  {product.condition && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Condition</h4>
                      <p className="text-gray-600">{product.condition}</p>
                    </div>
                  )}
                  {product.gender && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Gender</h4>
                      <p className="text-gray-600">{product.gender}</p>
                    </div>
                  )}
                </div>
                
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Size</h4>
                    <div className="flex gap-2">
                      {product.sizes.map((size, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-lg p-0 sm:p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'No description available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render product card component
  const ProductCard = ({ product }: { product: Product }) => (
    <div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group"
      onClick={() => handleProductClick(product._id)}
    >
      <div className="relative aspect-square bg-gray-100">
        <img
          src={product.images?.[0] || '/placeholder-product.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-product.png';
          }}
        />
        
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

      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {renderStars(product.rating)}
          <span className="text-xs text-gray-500 ml-1">
            ({product.rating})
          </span>
        </div>

        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-xs text-gray-600 mb-2">
          By {getVendorBusinessName(product.vendor)}
        </p>

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

        <p className="text-xs text-gray-500">
          {getVendorLocation(product.vendor)}
        </p>
      </div>
    </div>
  );

  // Error state
  if (error && !product) {
    return (
      <div className='w-full '>
        <div className="hidden md:block">
        <Header />
      </div>
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
      <div className="hidden md:block">
        <Header />
      </div>

      <div className='bg-white shadow-sm w-full'>
        <div className=' flex space-x-2'>
<button
            // onClick={handleBackToTabs}
            className="flex items-center text-gray-600 hover:text-gray-900 py-3 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            
          </button>
  <h1 className='text-lg md:text-xl font-semibold text-gray-800 py-4 w-[100%]'>
    {product ? product.name : 'Loading...'}
  </h1>
  </div>
</div>
      
      <DesktopProductDetail />
      <MobileProductDetail />
      
      <ReviewsSectionComponent 
      productId={productId}
      vendor={typeof product?.vendor === 'object' ? product.vendor : undefined}
      loading={loading}
    />
      
      {/* Similar Items */}
      <div className='w-[90%] mx-auto'>
        <h2 className="text-2xl font-semibold mb-4 mt-10 text-black">Similar Items</h2>
        
        {loading ? (
          renderProductsSkeleton()
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarProducts?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {!loading && (!similarProducts || similarProducts.length === 0) && (
              <div className="text-center py-8">
                <div className="text-gray-500">No similar products found</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Other Items from Seller */}
      <div className='w-[90%] mx-auto mb-[30px]'>
        <h2 className="text-2xl font-semibold mb-4 mt-10 text-black">Other Items from seller</h2>
        
        {loading ? (
          renderProductsSkeleton()
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sellerProducts?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {!loading && (!sellerProducts || sellerProducts.length === 0) && (
              <div className="text-center py-8">
                <div className="text-gray-500">No other products from this seller</div>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation/>
      </div>
      <Footer/>
    </div>
  )
}

export default Product