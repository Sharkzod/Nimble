import React, { useState, useEffect } from 'react';
import { SettingsTab, MobileViewState } from '../../types/settings';
import { useLogout } from '@/app/lib/hooks/useAuthApis/useLogout';
import { useRouter } from 'next/navigation';

interface SettingsLayoutProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  children: React.ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  activeTab,
  onTabChange,
  children
}) => {
  const [mobileView, setMobileView] = useState<MobileViewState>({
    isMobile: false,
    showTabList: true,
    showContent: false
  });

  const router = useRouter()

  const tabs = [
    { id: 'personal' as SettingsTab, label: 'Personal profile' },
    { id: 'business' as SettingsTab, label: 'Business details' },
    { id: 'shipping' as SettingsTab, label: 'Shipping address' },
    { id: 'withdrawal' as SettingsTab, label: 'Withdrawal details' },
    { id: 'password' as SettingsTab, label: 'Change password' },
    { id: 'notifications' as SettingsTab, label: 'Notification settings' },
    { id: 'delete' as SettingsTab, label: 'Delete account' },
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 1024;
      setMobileView(prev => ({
        isMobile,
        showTabList: isMobile ? prev.showTabList : true,
        showContent: isMobile ? prev.showContent : true
      }));
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleTabClick = (tab: SettingsTab) => {
    if (mobileView.isMobile) {
      setMobileView({
        isMobile: true,
        showTabList: false,
        showContent: true
      });
    }
    onTabChange(tab);
  };

  const handleBackToTabs = () => {
    setMobileView({
      isMobile: true,
      showTabList: true,
      showContent: false
    });
  };

  const { signOut } = useLogout(); // ✅ Call hook at component level


  const handleLogout = async () => {
    try {
      await signOut(); 
      
      router.push('/login'); 
      
    } catch (err) {
      console.log('Logout error message: ', err)
      console.error('Logout failed:', err);
    }
  };


  // Mobile: Show only tab list (full width)
  if (mobileView.isMobile && mobileView.showTabList) {
    return (
      <div className="min-h-screen bg-white w-[100%] sm:w-[60%]">
        {/* Remove max-width container for full width */}
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
          <nav className="space-y-0"> {/* Remove space between items */}
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full text-left px-4 py-4 text-base font-normal border-b border-gray-200 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
            
            <div className=" border-gray-200 my-2"></div>
            
            <button onClick={() => handleLogout()} className="w-full text-left px-4 py-3 text-base font-normal text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200">
                Log out
              </button>
          </nav>
        </div>
      </div>
    );
  }

  // Mobile: Show only content with back button (full width)
  if (mobileView.isMobile && mobileView.showContent) {
    return (
      <div className="min-h-screen bg-white">
        {/* Full width container */}
        <div className="px-4 py-6">
          {/* Back button - full width */}
          <button
            onClick={handleBackToTabs}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 py-3 transition-colors duration-200 w-full border-b border-gray-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Settings
          </button>
          
          {/* Content - full width */}
          <div className="bg-white w-full">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Desktop: Show both side by side with centered container
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-80">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full text-left px-4 py-3 text-base font-normal transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              
              <div className="border-t border-gray-200 my-4"></div>
              
              <button onClick={() => handleLogout()} className="w-full text-left px-4 py-3 text-base font-normal text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200">
                Log out
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;