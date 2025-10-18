import apiClient from './apiClient';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  maxRating: number;
  image: string;
  location: string;
  isWishlisted: boolean;
  // Add other fields that match your API response
  _id?: string;
  views?: number;
  purchases?: number;
  description?: string;
  category?: string;
  condition?: string;
  images?: string[];
  vendor?: string;
}


interface BaseResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface ProductListResponse {
  products: any[]; // Replace with Product interface
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
}

interface WishlistResponse {
  message: string;
  wishlist: string[]; // Array of product IDs
}

export const productApi = {
  // Get all products with pagination
  getAllProducts: (params: any = {}): Promise<any> => 
    apiClient.get('/products/get-products', { params }),

   getMostViewed: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products/most-viewed');
    
    console.log('Raw API Response:', response.data);
    
    // Extract products from the nested structure
    if (response.data && response.data.success && Array.isArray(response.data.products)) {
      const products = response.data.products;
      console.log('Extracted products:', products);
      
      // Transform the API data to match our Product interface
      return products.map((product: any) => ({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        rating: product.averageRating || product.rating || 0,
        maxRating: 5, // Default max rating
        image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg',
        location: product.location ? `${product.location.city}, ${product.location.state}` : 'Location not specified',
        isWishlisted: false, // Default value
        // Include other fields if needed
        views: product.views,
        purchases: product.purchases,
        description: product.description,
        category: product.category,
        condition: product.condition,
        images: product.images,
        vendor: product.vendor
      }));
    } else {
      console.warn('Unexpected API response format:', response.data);
      return [];
    }
  },

  getProductReviews: (productId: string): Promise<any> => 
    apiClient.get(`/products/${productId}/reviews`),

  getSimilarProducts: (categoryId: string, params: any = {}): Promise<any> => 
    apiClient.get(`/products/category/${categoryId}`, { params }),
  
  getProductById: (productId: string): Promise<any> => 
    apiClient.get(`/products/get-product/${productId}`),

  getProductsByCategory: (categoryId: string, params: any = {}): Promise<any> => 
    apiClient.get(`/products/category/${categoryId}`, { params }),

  searchProducts: (query: string, params: any = {}): Promise<any> => 
    apiClient.get('/products/search', { 
      params: { ...params, query } 
    }),

  getVendorProducts: (vendorId: string, params: any = {}): Promise<any> => 
    apiClient.get(`/products/vendor/${vendorId}`, { params }),

  addToWishlist: (productId: string): Promise<any> => 
    apiClient.post(`/wishlist/${productId}`),

  removeFromWishlist: (productId: string): Promise<any> => 
    apiClient.delete(`/wishlist/${productId}`),
};