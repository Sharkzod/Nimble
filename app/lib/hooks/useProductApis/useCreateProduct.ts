import { useState } from 'react';
import { productApi, CreateProductData, Product } from '../../api/productsApi';

interface UseCreateProductReturn {
  createProduct: (productData: CreateProductData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  product: Product | null;
}

export const useCreateProduct = (): UseCreateProductReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);

  const createProduct = async (productData: CreateProductData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      console.log('Creating product with data:', productData);
      
      const response = await productApi.createProduct(productData);
      
      console.log('Product creation response:', response);
      
      setProduct(response.product);
      setSuccess(true);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      console.error('Error creating product:', err);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    loading,
    error,
    success,
    product,
  };
};