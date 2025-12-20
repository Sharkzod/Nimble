import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/lib/stores/useAuthStore';

interface CreateOrNavigateToChatParams {
  productId: string;
  sellerId: string;
  buyerId: string;
  productName: string;
  productPrice: number;
  productImages?: string[];
}

export const useChatNavigation = () => {
  const router = useRouter();
  const { user: currentUser, isAuthenticated, getToken } = useAuthStore();

  const navigateToChat = async (params: CreateOrNavigateToChatParams) => {
    // Check authentication
    if (!isAuthenticated || !currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return null;
    }

    // Get the authentication token safely
    const authToken = getToken();
    if (!authToken) {
      console.error('❌ No authentication token found');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return null;
    }

    try {
      console.log('🚀 Starting chat navigation with params:', params);
      console.log('🔐 Auth token:', authToken ? '✓ Present' : '✗ Missing');

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

      const response = await fetch(`${backendUrl}/api/chats/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: params.productId,
          seller: params.sellerId,
          buyer: params.buyerId,
          productDetails: {
            name: params.productName,
            price: params.productPrice,
            images: params.productImages || []
          }
        }),
      });

      console.log('📨 Chat creation response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Chat creation failed:', errorText);
        
        if (response.status === 401) {
          // Token is invalid, logout user
          useAuthStore.getState().logout();
          router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
          return null;
        }
        
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Chat creation response:', result);

      // Handle different response structures
      let chatData;
      if (result.data) {
        chatData = result.data.chat || result.data;
      } else {
        chatData = result.chat || result;
      }

      if (!chatData || !chatData._id) {
        throw new Error('Invalid chat data received from server');
      }

      console.log('✅ Chat ready, navigating to:', `/dashboard/message/${chatData._id}`);
      
      // Navigate to the chat page
      router.push(`/dashboard/message/${chatData._id}`);
      return chatData;

    } catch (error) {
      console.error('❌ Error in navigateToChat:', error);
      
      // Show specific error messages
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
          alert('Your session has expired. Please log in again.');
          useAuthStore.getState().logout();
          router.push('/login');
        } else {
          alert('Failed to start conversation. Please try again.');
          // Fallback: navigate to messages page
          router.push('/dashboard/message');
        }
      } else {
        alert('Failed to start conversation. Please try again.');
        router.push('/dashboard/message');
      }
      
      return null;
    }
  };

  return { navigateToChat };
};