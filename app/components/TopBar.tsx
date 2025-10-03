'use client'
import React, { useState } from 'react';
import { Search, Bell, MessageCircle, ChevronDown, Menu, User, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const Header: React.FC = () => {
  // Simulate authentication state - in real app this would come from context/redux
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);

  // Mock login/logout functions
  const handleLogin = () => {
    setIsLoggedIn(true);
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    });
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const handleSearch = () => {
    console.log('Search query:', searchQuery);
    setShowMobileSearch(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  // Common search component
  const SearchBar = ({ placeholder = "Search", isMobile = false }: { placeholder?: string; isMobile?: boolean }) => (
    <div className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-lg'}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className={`w-full pl-10 pr-4 py-1.5 text-gray-600 bg-gray-100 border border-gray-200 rounded-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            isMobile ? 'text-base' : 'text-sm'
          }`}
        />
        {isMobile && (
          <button
            onClick={() => setShowMobileSearch(false)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white h-[60px] shadow-sm w-full">
      {/* Demo Controls - Uncomment if needed */}
      {/* <div className="bg-yellow-50 border-b border-yellow-200 p-3">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 flex-wrap">
          <span className="text-sm font-medium text-yellow-800">Demo Controls:</span>
          <button
            onClick={handleLogin}
            disabled={isLoggedIn}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded disabled:bg-gray-400"
          >
            Login
          </button>
          <button
            onClick={handleLogout}
            disabled={!isLoggedIn}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded disabled:bg-gray-400"
          >
            Logout
          </button>
          <span className="text-sm text-yellow-700">
            Status: {isLoggedIn ? 'Logged In' : 'Logged Out'}
          </span>
        </div>
      </div> */}

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 p-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <span className="text-lg font-medium">Search</span>
          </div>
          <SearchBar placeholder="What are you looking for?" isMobile={true} />
        </div>
      )}

      {/* Header for Logged Out Users */}
      {!isLoggedIn && (
        <div className="pb-0">
          <div className="max-w-6xl mx-auto px-4 pt-3">
            {/* Top Bar - Mobile */}
            <div className="flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-black">LOGO</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMobileSearch}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                <a
                  href='/sell'
                  className="px-4 py-2 bg-[#3652AD] text-sm text-white rounded-[100px] hover:bg-blue-700 transition-colors"
                >
                  Sell
                </a>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between gap-4">
              {/* Logo and Menu */}
              <div className="flex items-center justify-between w-auto lg:w-[12%]">
                <a href='/' className="flex items-center gap-2">
                  <img src='/Navigation.png' alt='menu' className='w-8 h-6'/>
                </a>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-black">LOGO</span>
                </div>
              </div>

              {/* Search Bar */}
              <SearchBar />

              {/* Navigation Links */}
              <nav className="flex items-center gap-6">
                <a href="/feed" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Feed
                </a>
                <a href="/requests" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Requests
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-space-grotesk">
                  Login
                </a>
                <a href='/sell' className="px-5 py-2 bg-[#3652AD] text-sm text-white rounded-[100px] hover:bg-blue-700 transition-colors">
                  Sell
                </a>
              </nav>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden fixed inset-0 bg-white z-40 pt-16 px-4">
              <div className="flex flex-col space-y-4">
                <a
                  href="/feed"
                  className="py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Feed
                </a>
                <a
                  href="/requests"
                  className="py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Requests
                </a>
                <a
                  href="#"
                  className="py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Login
                </a>
                <div className="pt-4">
                  <a
                    href='/sell'
                    className="block w-full text-center px-5 py-3 bg-[#3652AD] text-white rounded-[100px] hover:bg-blue-700 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sell
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header for Logged In Users */}
      {isLoggedIn && (
        <div className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-3">
            {/* Mobile Layout */}
            <div className="flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-black">LOGO</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMobileSearch}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <a
                  href='/sell'
                  className="px-4 py-2 bg-[#3652AD] text-sm text-white rounded-[100px] hover:bg-blue-700 transition-colors"
                >
                  Sell
                </a>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex items-center justify-between">
                <img src='/Navigation.png' alt='menu' className='w-8 h-6'/>
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-2xl font-bold text-black font-space-grotesk">LOGO</span>
                </div>
              </div>

              {/* Search Bar */}
              <SearchBar />

              {/* User Actions */}
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* Messages */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Orders
                      </a>
                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sell Button */}
                <button className="px-6 py-2 bg-[#3652AD] text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Sell
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu for Logged In Users */}
          {showMobileMenu && isLoggedIn && (
            <div className="lg:hidden fixed inset-0 bg-white z-40 pt-16 px-4">
              <div className="flex flex-col space-y-4">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                
                <a
                  href="/feed"
                  className="py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Feed
                </a>
                <a
                  href="/requests"
                  className="py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Requests
                </a>
                <a
                  href="#"
                  className="py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Settings
                </a>
                <a
                  href="#"
                  className="py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  My Orders
                </a>
                
                <div className="pt-4 flex flex-col gap-3">
                  <a
                    href='/sell'
                    className="block w-full text-center px-5 py-3 bg-[#3652AD] text-white rounded-[100px] hover:bg-blue-700 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sell
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full px-5 py-3 text-red-600 border border-red-600 rounded-[100px] hover:bg-red-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;