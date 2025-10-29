'use client'
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, MapPin } from 'lucide-react';
import { useAuthStore } from '../lib/stores/useAuthStore';
import { authApi } from '../lib/api/authApi';

interface RatingBreakdown {
  stars: number;
  count: number;
  percentage: number;
}

interface VendorStats {
  overallRating: number;
  totalRatings: number;
  ratingBreakdown: RatingBreakdown[];
  totalSales?: number;
  responseRate?: number;
  joinDate?: string;
}

const SellRate: React.FC = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [vendorStats, setVendorStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();

  // Mock function to fetch vendor stats - replace with your actual API
  const fetchVendorStats = async (vendorId: string) => {
    try {
      // TODO: Replace with your actual vendor stats API endpoint
      // const response = await vendorApi.getVendorStats(vendorId);
      
      // Mock data for demonstration
      const mockStats: VendorStats = {
        overallRating: 4.6,
        totalRatings: 300,
        totalSales: 150,
        responseRate: 95,
        joinDate: '2023-01-15',
        ratingBreakdown: [
          { stars: 5, count: 150, percentage: 50 },
          { stars: 4, count: 90, percentage: 30 },
          { stars: 3, count: 45, percentage: 15 },
          { stars: 2, count: 9, percentage: 3 },
          { stars: 1, count: 6, percentage: 2 }
        ]
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockStats;
    } catch (err) {
      throw new Error('Failed to fetch vendor statistics');
    }
  };

  useEffect(() => {
  const loadVendorData = async () => {
    if (!isAuthenticated || !user || !user.id) { // Add !user.id check
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch vendor statistics - user.id is now guaranteed to be defined
      const stats = await fetchVendorStats(user.id);
      setVendorStats(stats);
    } catch (err: any) {
      console.error('Error loading vendor data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Only load if auth is not loading and we have a user
  if (!authLoading) {
    loadVendorData();
  }
}, [user, isAuthenticated, authLoading]);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const renderStars = (rating: number, maxRating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const starSize = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    }[size];
    
    return Array.from({ length: maxRating }, (_, index) => (
      <Star
        key={index}
        className={`${starSize} ${
          index < rating
            ? 'fill-blue-500 text-blue-500'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Default user info from authenticated user
  const userInfo = {
    name: user ? `${user.firstName} ${user.lastName}` : 'Guest User',
    businessName: user?.businessName || `${user?.firstName} ${user?.lastName}`,
    isVerified: user?.isVerified || false,
    location: user?.location || 'Location not specified',
    avatar: user?.avatar || '/avatars/default.jpg'
  };

  // Use API data or fallback to defaults
  const ratingData = vendorStats ? {
    overallRating: vendorStats.overallRating,
    totalRatings: vendorStats.totalRatings,
    ratingBreakdown: vendorStats.ratingBreakdown
  } : {
    overallRating: 0,
    totalRatings: 0,
    ratingBreakdown: []
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-lg mt-0 sm:mt-5 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
          <div className="h-8 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-lg mt-0 sm:mt-5">
        <div className="text-center text-red-600 py-4">
          <p>Failed to load vendor data: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-lg mt-0 sm:mt-5">
        <div className="text-center text-gray-500 py-4">
          <p>Please sign in to view seller information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-lg mt-0 sm:mt-5">
      {/* Mobile Layout */}
      <div className="lg:hidden space-y-6">
        {/* User Info Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* User Avatar */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
              {userInfo.avatar ? (
                <img 
                  src={userInfo.avatar} 
                  alt={userInfo.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              )}
            </div>
            
            {/* User Details */}
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                  {userInfo.businessName}
                </h3>
                {userInfo.isVerified && (
                  <div className="bg-green-500 rounded-full p-0.5 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-white" fill="currentColor" />
                  </div>
                )}
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex-shrink-0">
                  Verified ID
                </span>
              </div>
              <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                <MapPin className="w-3 h-3 mr-1" />
                {userInfo.location}
              </div>
            </div>
          </div>

          {/* Follow Button - Mobile */}
          <button
            onClick={toggleFollow}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 flex-shrink-0 ${
              isFollowing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Overall Rating - Mobile */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {ratingData.overallRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-0.5 mb-1">
              {renderStars(Math.floor(ratingData.overallRating), 5, 'sm')}
            </div>
            <p className="text-xs text-gray-500">{ratingData.totalRatings} ratings</p>
          </div>

          {/* Additional Stats */}
          {vendorStats && (
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">
                {vendorStats.totalSales}+ sales
              </div>
              <p className="text-xs text-gray-500">{vendorStats.responseRate}% response rate</p>
            </div>
          )}
        </div>

        {/* Rating Breakdown - Mobile */}
        {ratingData.ratingBreakdown.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Rating Breakdown</h4>
            {ratingData.ratingBreakdown.map((rating) => (
              <div key={rating.stars} className="flex items-center gap-2 text-xs">
                {/* Star Rating */}
                <div className="flex items-center gap-0.5 w-10 sm:w-12">
                  <span className="text-gray-600 w-3">{rating.stars}</span>
                  <Star className="w-3 h-3 text-blue-500 fill-blue-500" />
                </div>
                
                {/* Progress Bar */}
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${rating.percentage}%` }}
                  />
                </div>
                
                {/* Count */}
                <span className="text-gray-500 w-6 text-right text-xs">{rating.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between gap-4 xl:gap-6">
        {/* Left Section - User Info */}
        <div className="flex items-center gap-4 xl:gap-6">
          {/* User Avatar */}
          <div className="w-12 h-12 xl:w-14 xl:h-14 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            {userInfo.avatar ? (
              <img 
                src={userInfo.avatar} 
                alt={userInfo.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm xl:text-base">
                {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            )}
          </div>
          
          {/* User Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-base xl:text-lg">{userInfo.businessName}</h3>
              {userInfo.isVerified && (
                <div className="bg-green-500 rounded-full p-1 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 xl:w-4 xl:h-4 text-white" fill="currentColor" />
                </div>
              )}
              <span className="text-xs xl:text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Verified ID
              </span>
            </div>
            <div className="flex items-center text-gray-500 text-sm xl:text-base">
              <MapPin className="w-4 h-4 mr-1" />
              {userInfo.location}
            </div>
            
            {/* Additional Stats */}
            {vendorStats && (
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>{vendorStats.totalSales}+ sales</span>
                <span>•</span>
                <span>{vendorStats.responseRate}% response rate</span>
                {vendorStats.joinDate && (
                  <>
                    <span>•</span>
                    <span>Joined {new Date(vendorStats.joinDate).getFullYear()}</span>
                  </>
                )}
              </div>
            )}
            
            {/* Follow Button - Desktop */}
            <button
              onClick={toggleFollow}
              className={`mt-3 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                isFollowing
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        {/* Right Section - Rating Info */}
        <div className="flex items-center gap-6 xl:gap-8">
          {/* Overall Rating */}
          <div className="text-center flex-shrink-0">
            <div className="text-2xl xl:text-3xl font-bold text-gray-900 mb-1">
              {ratingData.overallRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-0.5 mb-1">
              {renderStars(Math.floor(ratingData.overallRating), 5, 'md')}
            </div>
            <p className="text-xs xl:text-sm text-gray-500">{ratingData.totalRatings} ratings</p>
          </div>

          {/* Rating Breakdown */}
          {ratingData.ratingBreakdown.length > 0 && (
            <div className="space-y-1 min-w-0 flex-shrink-0">
              <h4 className="font-semibold text-gray-900 text-sm mb-2 hidden xl:block">
                Rating Breakdown
              </h4>
              {ratingData.ratingBreakdown.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-2 text-xs xl:text-sm">
                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5 w-12 xl:w-14">
                    {renderStars(rating.stars, rating.stars, 'sm')}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-20 xl:w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                  
                  {/* Count */}
                  <span className="text-gray-500 w-6 text-right">{rating.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alternative Mobile Layout for Medium Screens */}
      <div className="hidden md:flex lg:hidden items-center justify-between gap-4">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            {userInfo.avatar ? (
              <img 
                src={userInfo.avatar} 
                alt={userInfo.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-base">{userInfo.businessName}</h3>
              {userInfo.isVerified && (
                <div className="bg-green-500 rounded-full p-0.5 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-white" fill="currentColor" />
                </div>
              )}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-3 h-3 mr-1" />
              {userInfo.location}
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mt-1">
              Verified ID
            </span>
          </div>
        </div>

        {/* Rating Info */}
        <div className="flex items-center gap-4">
          <div className="text-center flex-shrink-0">
            <div className="text-xl font-bold text-gray-900 mb-1">
              {ratingData.overallRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-0.5 mb-1">
              {renderStars(Math.floor(ratingData.overallRating), 5, 'sm')}
            </div>
            <p className="text-xs text-gray-500">{ratingData.totalRatings} ratings</p>
          </div>

          <button
            onClick={toggleFollow}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
              isFollowing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellRate;