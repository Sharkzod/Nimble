'use client'
import React, { useState } from 'react';
import { Star, ChevronRight } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

const ReviewsSectionComponent: React.FC = () => {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'Ogeyemi Anuolu',
      userAvatar: '/avatars/ogeyemi.jpg',
      rating: 4,
      date: '04 April 2024',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget euismod...'
    },
    {
      id: '2',
      userName: 'Ogeyemi Anuolu',
      userAvatar: '/avatars/ogeyemi2.jpg',
      rating: 4,
      date: '04 April 2024',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget euismod...'
    },
    {
      id: '3',
      userName: 'Ogeyemi Anuolu',
      userAvatar: '/avatars/ogeyemi3.jpg',
      rating: 4,
      date: '04 April 2024',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget euismod...'
    }
  ]);

  const userProfile = {
    name: 'Agnes David',
    initials: 'AD',
    totalReviews: 6,
    averageRating: 4.0
  };

  const renderStars = (rating: number, maxRating: number = 5) => {
    return Array.from({ length: maxRating }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'fill-orange-400 text-orange-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleViewAll = () => {
    console.log('View all reviews');
  };

  const handleVisitProfile = () => {
    console.log('Visit user profile');
  };

  return (
    <div className=" mx-auto bg-white rounded-lg p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {userProfile.initials}
            </span>
          </div>
          <span className="font-semibold text-gray-900">{userProfile.name}</span>
        </div>

        {/* Visit Profile Button */}
        <button
          onClick={handleVisitProfile}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Visit user profile
        </button>
      </div>

      {/* Reviews Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">
            Reviews ({userProfile.totalReviews})
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {renderStars(Math.floor(userProfile.averageRating))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {userProfile.averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* View All Button */}
        <button
          onClick={handleViewAll}
          className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            {/* Review Header */}
            <div className="flex items-center gap-1 mb-3">
              {renderStars(review.rating)}
            </div>

            {/* Date */}
            <div className="text-xs text-gray-500 mb-3">
              {review.date}
            </div>

            {/* User Info */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {review.userName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {review.userName}
              </span>
            </div>

            {/* Review Comment */}
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Demo Info */}
      {/* <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2 text-sm">Component Features:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• User profile header with avatar and visit profile button</li>
            <li>• Reviews summary with count, average rating, and view all link</li>
            <li>• 3-column responsive grid of review cards</li>
            <li>• Star ratings with orange fill color</li>
            <li>• User avatars with initials for each review</li>
            <li>• Hover effects and smooth transitions</li>
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default ReviewsSectionComponent;