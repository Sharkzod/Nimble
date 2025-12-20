import React from 'react';
import { MessageComponentProps } from '@/app/types/types';

export default function DeclinedOfferMessage({ 
  message, 
  currentUserId,
  chat,
  onDecline,
  onAcceptAndPay
}: MessageComponentProps) {
  const isSeller = chat && currentUserId === chat.seller._id;
  const sellerName = chat?.seller.firstName || 'Seller';

  if (isSeller) {
    return (
      <div className="flex justify-end gap-3">
        <div className="flex flex-col space-y-2 items-end max-w-xs">
          <div className="rounded-2xl p-4 bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <div className='bg-white rounded-full w-5 h-5 flex items-center justify-center'>
                  <svg className="w-5 h-5 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-700 font-medium">You declined the offer</p>
            </div>
            
            <div className="mb-2">
              <p className="text-xs text-gray-600 mb-1">Declined Amount</p>
              <span className="text-2xl font-bold text-red-700">
                ₦{message.offer?.amount?.toLocaleString()}
              </span>
            </div>

            {message.offer?.bestPrice && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 font-medium mb-1">
                  Your Best Price: <span className="font-bold">₦{message.offer.bestPrice.toLocaleString()}</span>
                </p>
                <p className="text-xs text-yellow-600">
                  This was sent to the buyer
                </p>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        </div>
        
        {/* User's profile picture for own messages */}
        <div className="flex-shrink-0">
          {chat?.seller.profilePic ? (
            <img 
              src={chat.seller.profilePic} 
              alt="You"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold">
              {chat?.seller.firstName?.[0]}{chat?.seller.lastName?.[0]}
            </div>
          )}
        </div>
      </div>
    );
  }

  // If current user is the buyer (the one whose offer was declined)
  return (
    <div className="flex gap-3">
      {/* Seller Avatar */}
      <div className="flex-shrink-0">
        {chat?.seller.profilePic ? (
          <img 
            src={chat.seller.profilePic} 
            alt={sellerName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold">
            {chat?.seller.firstName?.[0]}{chat?.seller.lastName?.[0]}
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex flex-col space-y-1 flex-1">
        <div className="rounded-2xl p-4 max-w-xs bg-[#FEE2E2] border border-[#FCA5A5]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-[#DC2626] flex items-center justify-center flex-shrink-0">
              <img src='/x.png' width={14} height={14}/>
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-black font-medium">
                {sellerName} declined your offer
              </p>
            </div>
          </div>

          {message.offer?.bestPrice && (
            <div className="rounded-lg">
              <p>
                <span className="text-[16px] font-bold text-black">
                  Best price: ₦{message.offer.bestPrice.toLocaleString()}
                </span>
              </p>
            </div>
          )}

          {onDecline && onAcceptAndPay && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={onDecline}
                className="flex-1 px-4 py-2 text-[#DC2626] font-medium bg-white border border-[#DC2626] rounded-full hover:bg-red-50 transition-colors text-xs"
              >
                Decline
              </button>
              <button
                onClick={() => onAcceptAndPay && onAcceptAndPay(message)}
                className="flex-1 px-4 py-2 bg-[#DC2626] text-white font-medium rounded-full hover:bg-red-700 transition-colors text-xs"
              >
                Accept & pay
              </button>
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-500 ml-1">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}