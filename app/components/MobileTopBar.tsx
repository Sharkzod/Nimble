import { Settings, LogOut, LogIn } from 'lucide-react';
import { useCheckAuth } from '../lib/hooks/useAuthApis/useCheckAuth';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogout } from '../lib/hooks/useAuthApis/useLogout'; // Import your logout hook

export default function MobileTopBar() {
  const { user, isLoading } = useCheckAuth();
  const { signOut } = useLogout(); // Use your logout hook
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Function to get initials from first and last name
  const getInitials = (user: any) => {
    if (!user) return 'GU';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (lastName) {
      return lastName[0].toUpperCase();
    } else if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return 'GU';
  };

  // Function to get display name
  const getDisplayName = (user: any) => {
    if (!user) return 'Guest User';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    } else if (user.email) {
      return user.email;
    }
    
    return 'Guest User';
  };

  // Handle logout using your API
  const handleLogout = async () => {
    try {
      await signOut(); // This calls your API logout and clears local state
      setIsSettingsOpen(false);
      // No redirect - user stays on current page but as logged out state
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API call fails, clear local state
      setIsSettingsOpen(false);
    }
  };

  // Handle login
  const handleLogin = () => {
    setIsSettingsOpen(false);
    router.push('/login');
  };

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show loading state or placeholder while checking auth
  if (isLoading) {
    return (
      <div className="w-full bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
          </div>
          <div className="w-9 h-9 bg-gray-300 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  const isLoggedIn = !!user;

  return (
    <div className="w-full bg-white border-b border-gray-200 relative">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(user)}
          </div>
          <span className="text-gray-900 font-medium text-base">
            {getDisplayName(user)}
          </span>
        </div>
        
        {/* Right side - Settings */}
        <div className="relative" ref={settingsRef}>
          <button 
            className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
              isSettingsOpen ? 'bg-gray-100' : ''
            }`}
            aria-label="Settings"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Settings className="w-5 h-5 text-gray-700" />
          </button>

          {/* Slide-out menu */}
          <div
            className={`absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[140px] transition-all duration-200 z-50 ${
              isSettingsOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-green-600 hover:bg-gray-50 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when settings is open */}
      {isSettingsOpen && (
        <div 
          className="fixed z-40 md:hidden"
          onClick={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}