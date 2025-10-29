'use client';

import { useState } from 'react';

interface Order {
  id: string;
  customerName: string;
  customerAvatar?: string;
  productName: string;
  productImage?: string;
  amount: number;
  time: string;
  status: string;
}

// Remove the old PageProps interface and use this instead
interface OrderChatPageProps {
  params: Promise<{
    chat: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function OrderChatPage(props: OrderChatPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatId, setChatId] = useState<string>('default');

  // Since we can't use async/await directly in a client component with params Promise,
  // we'll use a useEffect to handle the params when they resolve
  // However, for client components, we might need a different approach

  // For now, let's use a default approach that works with client components
  const currentOrder: Order = {
    id: chatId,
    customerName: 'Agnes David',
    productName: 'Run your own for...',
    amount: 15000,
    time: 'Now',
    status: 'active'
  };

  // Default handlers
  const handleBack = () => {
    console.log('Navigating back');
    // You can use router.back() here if needed
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  const handleReportUser = () => {
    console.log('Reporting user');
  };

  const handleFollowUser = () => {
    console.log('Following user');
  };

  const handleViewProfile = () => {
    console.log('Viewing profile');
  };

  const handleAppeal = () => {
    console.log('Appealing');
  };

  const handleDelete = () => {
    console.log('Deleting chat');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMenuAction = (action: () => void) => {
    setIsMenuOpen(false);
    if (action) {
      action();
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Avatar */}
          {currentOrder.customerAvatar ? (
            <img
              src={currentOrder.customerAvatar}
              alt={currentOrder.customerName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-sm font-semibold">
              {getInitials(currentOrder.customerName)}
            </div>
          )}

          <h1 className="text-lg font-semibold text-gray-900">
            {currentOrder.customerName}
          </h1>
        </div>

        {/* Three-dot Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                <button
                  onClick={() => handleMenuAction(handleReportUser)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="text-base text-gray-900">Report user</span>
                </button>

                <button
                  onClick={() => handleMenuAction(handleFollowUser)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span className="text-base text-gray-900">Follow user</span>
                </button>

                <button
                  onClick={() => handleMenuAction(handleViewProfile)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span className="text-base text-gray-900">View profile</span>
                </button>

                <button
                  onClick={() => handleMenuAction(handleAppeal)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span className="text-base text-gray-900">Appeal</span>
                </button>

                <div className="border-t border-gray-200 my-2" />

                <button
                  onClick={() => handleMenuAction(handleDelete)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span className="text-base text-red-500 font-medium">Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Product Card */}
         <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            {currentOrder.productImage ? (
              <img
                src={currentOrder.productImage}
                alt={currentOrder.productName}
                className="w-14 h-14 rounded-lg object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-orange-200 flex items-center justify-center">
                <div className="w-8 h-10 bg-orange-500 rounded" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-900 font-medium">
                {currentOrder.productName}
              </p>
              <p className="text-lg font-bold text-gray-900">
                ₦{currentOrder.amount.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 text-orange-600 font-medium text-[12px] hover:bg-orange-50 rounded-lg transition-colors">
              View product details
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white font-medium text-[12px] rounded-full hover:bg-blue-700 transition-colors">
              Make an offer
            </button>
          </div>
          </div>
          
          {/* Action Buttons */}
          
        </div>

        {/* Warning Banner */}
        <div className="bg-pink-50 border-l-4 border-red-500 p-3 rounded-r-lg mb-4">
          <div className="flex gap-2">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm text-red-700">
              Do not consent to payment outside platform
            </p>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="space-y-4 mb-4">
          {/* Empty state - no messages yet */}
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No messages yet</p>
            <p className="text-gray-400 text-xs mt-1">Start a conversation</p>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
            />
            {/* Attachment button */}
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}