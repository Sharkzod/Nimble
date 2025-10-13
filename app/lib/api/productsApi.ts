import apiClient from './apiClient';

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