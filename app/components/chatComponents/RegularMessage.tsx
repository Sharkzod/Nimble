import React from 'react';
import { MessageComponentProps } from '@/app/types/types';

export default function RegularMessage({ 
  message, 
  currentUserId 
}: MessageComponentProps) {
  const isUserMessage = message.sender._id === currentUserId;
  const isAdminMessage = message.isFromAdmin;

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} gap-3`}>
      {/* Show profile picture for messages from others */}
      {!isUserMessage && (
        <div className="flex-shrink-0">
          {message.sender.profilePic ? (
            <img 
              src={message.sender.profilePic} 
              alt={`${message.sender.firstName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold">
              {message.sender.firstName?.[0]}{message.sender.lastName?.[0]}
            </div>
          )}
        </div>
      )}

      <div className={`flex flex-col ${isUserMessage ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl p-3 max-w-xs ${
          isUserMessage ? 'bg-[#3652AD] text-white' : 
          isAdminMessage ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-900'
        }`}>
          {!isUserMessage && !isAdminMessage && (
            <p className="text-xs font-medium mb-1 text-gray-600">
              {message.sender.firstName} {message.sender.lastName}
            </p>
          )}
          {isAdminMessage && (
            <p className="text-xs font-medium mb-1 text-purple-200">
              {message.sender.firstName} {message.sender.lastName} (Admin)
            </p>
          )}
          <p className="text-sm leading-relaxed">
            {message.text}
          </p>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-gray-500">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Show profile picture for user's own messages on the right side */}
      {isUserMessage && (
        <div className="flex-shrink-0">
          {message.sender.profilePic ? (
            <img 
              src={message.sender.profilePic} 
              alt="You"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold">
              {message.sender.firstName?.[0]}{message.sender.lastName?.[0]}
            </div>
          )}
        </div>
      )}
    </div>
  );
}