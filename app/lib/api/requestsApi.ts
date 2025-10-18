import apiClient from './apiClient';

export interface Request {
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
  description?: string;
  category?: string;
  condition?: string;
  images?: string[];
  status?: string;
  createdAt?: string;
}

export const requestsApi = {
  // Fetch all requests
  getRequests: async (): Promise<Request[]> => {
    const response = await apiClient.get('/requests/');
    
    console.log('Raw Requests API Response:', response.data);
    
    // Extract requests from the nested structure (adjust based on your API response)
    if (response.data && response.data.success && Array.isArray(response.data.requests)) {
      const requests = response.data.requests;
      console.log('Extracted requests:', requests);
      
      // Transform the API data to match our Request interface
      return requests.map((request: any) => ({
        id: request._id || request.id,
        name: request.name || request.title || 'Untitled Request',
        price: request.price || request.budget || 0,
        originalPrice: request.originalPrice,
        rating: request.averageRating || request.rating || 0,
        maxRating: 5,
        image: request.images && request.images.length > 0 ? request.images[0] : '/placeholder-request.jpg',
        location: request.location ? 
          `${request.location.city || ''}, ${request.location.state || ''}`.trim() : 
          'Location not specified',
        isWishlisted: false,
        description: request.description,
        category: request.category,
        condition: request.condition,
        status: request.status,
        createdAt: request.createdAt
      }));
    } else if (Array.isArray(response.data)) {
      // If the API directly returns an array
      return response.data.map((request: any) => ({
        id: request._id || request.id,
        name: request.name || request.title || 'Untitled Request',
        price: request.price || request.budget || 0,
        originalPrice: request.originalPrice,
        rating: request.averageRating || request.rating || 0,
        maxRating: 5,
        image: request.images && request.images.length > 0 ? request.images[0] : '/placeholder-request.jpg',
        location: request.location ? 
          `${request.location.city || ''}, ${request.location.state || ''}`.trim() : 
          'Location not specified',
        isWishlisted: false,
        description: request.description,
        category: request.category,
        condition: request.condition,
        status: request.status,
        createdAt: request.createdAt
      }));
    } else {
      console.warn('Unexpected requests API response format:', response.data);
      return [];
    }
  },

  // You can add other request-related API calls here
  getRequestById: async (id: string): Promise<Request> => {
    const response = await apiClient.get(`/requests/${id}`);
    return response.data;
  },

  createRequest: async (requestData: any): Promise<Request> => {
    const response = await apiClient.post('/requests/', requestData);
    return response.data;
  },
};