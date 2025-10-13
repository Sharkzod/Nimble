// lib/hooks/useProductApis/useFetchProduct.ts
import { useState, useEffect } from 'react';
import { productApi } from '../../api/productsApi';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images?: string[];
  category?: string | { _id: string; name: string };
  vendor?: string | { _id: string; name: string };
  description?: string;
  stock?: number;
  [key: string]: any;
}

interface UseFetchProductReturn {
  product: Product | null;
  similarProducts: Product[];
  sellerProducts: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFetchProduct = (productId: string | undefined): UseFetchProductReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductData = async (): Promise<void> => {
    console.log('=== FETCH PRODUCT START ===');
    console.log('productId:', productId);
    
    if (!productId) {
      console.log('❌ No productId provided, skipping fetch');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching product details...');
      
      // Fetch main product details
      const productResponse = await productApi.getProductById(productId);
      console.log('✅ Product details:', productResponse.data);
      
      if (productResponse.data?.product) {
        const fetchedProduct = productResponse.data.product;
        setProduct(fetchedProduct);
        console.log('✅ Product name:', fetchedProduct.name);
        
        // Fetch similar products based on category
        const categoryId = typeof fetchedProduct.category === 'object' 
          ? fetchedProduct.category._id 
          : fetchedProduct.category;
          
        if (categoryId) {
          const similarResponse = await productApi.getSimilarProducts(categoryId, { limit: 8 });
          console.log('✅ Similar products:', similarResponse.data);
          setSimilarProducts(similarResponse.data.products || []);
        }
        
        // Fetch other products from the same seller
        if (fetchedProduct.vendor) {
          const vendorId = typeof fetchedProduct.vendor === 'object'
            ? fetchedProduct.vendor._id
            : fetchedProduct.vendor;
            
          try {
            // Option 1: Use getAllProducts with vendor filter
            const sellerResponse = await productApi.getAllProducts({ 
              vendor: vendorId,
              limit: 8 
            });
            console.log('✅ Seller products:', sellerResponse.data);
            setSellerProducts(sellerResponse.data.products || sellerResponse.data || []);
          } catch (vendorErr) {
            console.warn('⚠️ Could not fetch seller products:', vendorErr);
            // Don't fail the entire request if seller products fail
            setSellerProducts([]);
          }
        }
      } else {
        setError('Product not found');
      }

    } catch (err: any) {
      console.error('❌ Fetch failed!');
      console.error('Error:', err);
      console.error('Error Response:', err.response);
      
      const errorMessage = err.response?.data?.message || 'Failed to fetch product data';
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('=== FETCH PRODUCT END ===');
    }
  };

  useEffect(() => {
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return {
    product,
    similarProducts,
    sellerProducts,
    loading,
    error,
    refetch: fetchProductData
  };
};