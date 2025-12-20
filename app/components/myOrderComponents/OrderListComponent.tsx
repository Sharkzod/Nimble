'use client';

import BottomNavigation from '@/app/components/BottomNav';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/TopBar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/lib/stores/useAuthStore';
import { useCheckAuth } from '@/app/lib/hooks/useAuthApis/useCheckAuth';
import { useChats, Chat } from '@/app/lib/hooks/useChatApis/useChats';

type OrderTab = 'incoming' | 'my-orders';
type OrderStatus = 'all' | 'pending' | 'paid' | 'appeal' | 'completed' | 'failed';

interface Order {
  id: string;
  chatId: string;
  customerName: string;
  customerAvatar?: string;
  productName: string;
  productImage?: string;
  amount: number;
  time: string;
  status: OrderStatus;
  originalChat?: Chat;
}

interface OrdersListProps {
  initialOrders?: Order[];
}

export default function OrdersList({
  initialOrders = [],
}: OrdersListProps) {
  const [activeTab, setActiveTab] = useState<OrderTab>('incoming');
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('all');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const router = useRouter();

  // Use auth store
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuthStore();
  useCheckAuth();

  // Use chats hook
  const { 
    chats, 
    loading: chatsLoading, 
    error: chatsError, 
    refetch: refetchChats 
  } = useChats();

  const statusFilters: { id: OrderStatus; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'To pay' },
    { id: 'paid', label: 'Paid' },
    { id: 'appeal', label: 'Appeal' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' }
  ];

  // Get current user ID from auth store
  const getCurrentUserId = (): string => {
    return currentUser?._id || '';
  };

  // Transform chats to orders format
  const transformChatsToOrders = (chats: Chat[], tab: OrderTab): Order[] => {
    const currentUserId = getCurrentUserId();
    console.log('Current user ID:', currentUserId);

    if (!currentUserId) {
      console.warn('No current user ID found');
      return [];
    }

    // Filter chats based on active tab
    const filteredChats = chats.filter(chat => {
      // Skip chats where buyer or seller is null
      if (!chat.buyer || !chat.seller) {
        console.warn('Skipping chat with missing buyer/seller:', chat._id);
        return false;
      }

      if (tab === 'incoming') {
        // Show chats where current user is the seller (incoming orders)
        return chat.seller._id === currentUserId;
      } else {
        // Show chats where current user is the buyer (my orders)
        return chat.buyer._id === currentUserId;
      }
    });

    console.log(`Filtered chats for ${tab}:`, filteredChats.length);

    // Sort chats by lastMessageSentAt or updatedAt in descending order (recent first)
    const sortedChats = filteredChats.sort((a, b) => {
      const timeA = new Date(a.lastMessageSentAt || a.updatedAt).getTime();
      const timeB = new Date(b.lastMessageSentAt || b.updatedAt).getTime();
      return timeB - timeA; // Descending order (recent first)
    });

    console.log('Sorted chats (recent first):', sortedChats.map(chat => ({
      id: chat._id,
      time: chat.lastMessageSentAt || chat.updatedAt,
      lastMessage: chat.lastMessage
    })));

    return sortedChats.map(chat => {
      // Add null checks here as well for safety
      const isBuyer = chat.buyer?._id === currentUserId;
      const otherUser = isBuyer ? chat.seller : chat.buyer;
      
      // Ensure otherUser exists before accessing properties
      if (!otherUser) {
        console.warn('Skipping chat with missing other user:', chat._id);
        return null;
      }

      // Determine status based on chat properties and last message
      const status = determineOrderStatus(chat, isBuyer);
      
      return {
        id: chat._id,
        chatId: chat._id,
        customerName: `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() || 'Unknown User',
        customerAvatar: otherUser.profilePic,
        productName: chat.product?.name || 'Product',
        productImage: chat.product?.images?.[0],
        amount: chat.product?.price || 0,
        time: formatTime(chat.lastMessageSentAt || chat.updatedAt),
        status: status,
        originalChat: chat
      };
    }).filter((order): order is Order => order !== null); // Filter out null orders
  };

  // Determine order status based on chat
  const determineOrderStatus = (chat: Chat, isBuyer: boolean): OrderStatus => {
    if (chat.isReported) {
      return 'appeal';
    }
    
    // Use last message content to determine status
    const lastMessage = chat.lastMessage?.toLowerCase() || '';
    
    if (lastMessage.includes('paid') || lastMessage.includes('payment confirmed')) {
      return 'paid';
    } else if (lastMessage.includes('complete') || lastMessage.includes('delivered') || lastMessage.includes('received')) {
      return 'completed';
    } else if (lastMessage.includes('appeal') || lastMessage.includes('report') || lastMessage.includes('dispute')) {
      return 'appeal';
    } else if (lastMessage.includes('fail') || lastMessage.includes('cancel') || lastMessage.includes('refund')) {
      return 'failed';
    } else if (lastMessage.includes('offer') || lastMessage.includes('price') || lastMessage.includes('negotiate')) {
      return 'pending';
    }
    
    // Default status based on user role
    return isBuyer ? 'pending' : 'pending';
  };

  // Enhanced time formatting
  const formatTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);
      const diffInDays = diffInHours / 24;
      
      if (diffInHours < 1) {
        const diffInMinutes = diffInMs / (1000 * 60);
        if (diffInMinutes < 1) return 'Just now';
        return `${Math.floor(diffInMinutes)}m ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else if (diffInDays < 7) {
        return `${Math.floor(diffInDays)}d ago`;
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch (e) {
      return 'Recently';
    }
  };

  // Filter orders based on active status
  const filteredOrders = orders.filter(order => 
    activeStatus === 'all' || order.status === activeStatus
  );

  // Refresh data when tab or chats change
  useEffect(() => {
    if (chats.length > 0) {
      const transformedOrders = transformChatsToOrders(chats, activeTab);
      setOrders(transformedOrders);
    }
  }, [activeTab, chats]);

  const handleOrderClick = (orderId: string, chatId?: string) => {
    const targetChatId = chatId || orderId;
    console.log('Navigating to chat:', targetChatId);
    router.push(`/dashboard/message/${targetChatId}`);
  };

  const handleRetry = () => {
    refetchChats();
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'paid':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'appeal':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'failed':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusDisplayText = (status: OrderStatus, isIncoming: boolean) => {
    switch (status) {
      case 'pending':
        return isIncoming ? 'Waiting for payment' : 'To pay';
      case 'paid':
        return isIncoming ? 'Payment received' : 'Paid';
      case 'appeal':
        return 'Under review';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  // Combined loading state
  const loading = authLoading || chatsLoading;

  // Combined error state
  const error = chatsError;

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="w-full mx-auto bg-white min-h-screen">
      <div className="block">
        <Header />  
      </div>
      
      <div className='w-[90%] flex flex-col m-auto justify-center items-center mt-[20px]'>
        {/* Tabs */}
        <div className="flex w-full gap-8 border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`pb-4 px-2 text-base font-medium transition-colors relative ${
              activeTab === 'incoming'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Incoming orders
            {activeTab === 'incoming' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('my-orders')}
            className={`pb-4 px-2 text-base font-medium transition-colors relative ${
              activeTab === 'my-orders'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My orders
            {activeTab === 'my-orders' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex w-full flex-wrap gap-3 p-6 border-b border-gray-100">
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveStatus(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeStatus === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="w-full p-8 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-500 mt-4">Loading {activeTab === 'incoming' ? 'incoming' : 'your'} orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="w-full p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              {error.includes('log in') && (
                <button
                  onClick={handleLoginRedirect}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <div className="divide-y w-full divide-gray-100">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-lg font-medium text-gray-900 mb-2">No {activeTab === 'incoming' ? 'incoming' : ''} orders found</p>
                <p className="text-gray-500">
                  {activeStatus === 'all' 
                    ? `You don't have any ${activeTab === 'incoming' ? 'incoming' : ''} orders yet.`
                    : `No ${activeTab === 'incoming' ? 'incoming' : ''} orders with status "${activeStatus}" found.`
                  }
                </p>
                {activeTab === 'my-orders' && (
                  <p className="text-sm text-gray-400 mt-2">
                    Start shopping to see your orders here.
                  </p>
                )}
                {activeTab === 'incoming' && (
                  <p className="text-sm text-gray-400 mt-2">
                    Your incoming orders from customers will appear here.
                  </p>
                )}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => handleOrderClick(order.id, order.chatId)}
                  className="w-full p-6 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {order.customerAvatar ? (
                        <img
                          src={order.customerAvatar}
                          alt={order.customerName}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : null}
                      {!order.customerAvatar && (
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 font-semibold">
                            {getInitials(order.customerName)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className="text-base font-normal text-gray-600">
                          {order.customerName}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                            {getStatusDisplayText(order.status, activeTab === 'incoming')}
                          </span>
                          <span className="text-sm text-gray-500">
                            {order.time}
                          </span>
                        </div>
                      </div>
                      <p className="text-base font-semibold text-gray-900 mb-1">
                        {order.productName}
                      </p>
                      <p className="text-base text-gray-600">
                        {order.status === 'pending' && activeTab === 'incoming' 
                          ? 'Waiting for buyer payment' 
                          : order.status === 'pending' 
                            ? 'Make payment to complete order'
                            : order.status === 'paid' && activeTab === 'incoming'
                              ? 'Payment received - prepare order'
                              : order.status === 'paid'
                                ? 'Payment confirmed'
                                : order.status === 'completed'
                                  ? 'Order completed successfully'
                                  : order.status === 'appeal'
                                    ? 'Order under review'
                                    : order.status === 'failed'
                                      ? 'Payment failed'
                                      : `Offer: ₦${order.amount.toLocaleString()}`
                        }
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="w-full p-4 mt-8 bg-gray-100 rounded-lg">
            <details>
              <summary className="cursor-pointer font-medium text-gray-700">
                Debug Info (Development Only)
              </summary>
              <div className="mt-2 text-sm text-gray-600">
                <p>Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}</p>
                <p>Total Chats: {chats.length}</p>
                <p>Total Orders: {orders.length}</p>
                <p>Filtered Orders: {filteredOrders.length}</p>
                <p>Active Tab: {activeTab}</p>
                <p>Active Status: {activeStatus}</p>
                <p>Current User ID: {getCurrentUserId() || 'Not found'}</p>
                <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
                <p>Auth Loading: {authLoading ? 'Yes' : 'No'}</p>
                <button
                  onClick={() => {
                    console.log('Chats:', chats);
                    console.log('Orders:', orders);
                    console.log('Current User:', currentUser);
                  }}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
                >
                  Log Debug Info
                </button>
              </div>
            </details>
          </div>
        )}
      </div>
      
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation/>
      </div>
      <Footer/>
    </div>
  );
}