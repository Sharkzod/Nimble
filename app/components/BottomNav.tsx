import React, { useState } from 'react';
import { Home, FileText, HelpCircle, Plus, MessageSquare, User } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const BottomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('account');

  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'feed', label: 'Feed', icon: FileText },
    { id: 'requests', label: 'Requests', icon: HelpCircle },
    { id: 'sell', label: 'Sell', icon: Plus },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'account', label: 'Account', icon: User },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      {/* Main content area - you can add your page content here */}
      {/* <div className="h-96 bg-gray-50 flex items-center justify-center mb-4">
        <p className="text-gray-600">Content for {activeTab} tab</p>
      </div> */}

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-2 py-2">
        <div className="flex items-center justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 transition-colors duration-200 ${
                  isActive ? '' : 'hover:bg-gray-50'
                } rounded-lg`}
              >
                {/* Icon container with background for active state */}
                <div className={`p-2 rounded-full mb-1 transition-colors duration-200 ${
                  isActive 
                    ? tab.id === 'sell' 
                      ? 'bg-black text-white' 
                      : 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon 
                    className={`w-5 h-5 ${
                      tab.id === 'sell' && isActive ? 'text-white' : ''
                    }`} 
                  />
                </div>
                
                {/* Label */}
                <span className={`text-xs font-medium transition-colors duration-200 ${
                  isActive 
                    ? tab.id === 'sell' 
                      ? 'text-black' 
                      : 'text-blue-600'
                    : 'text-gray-600'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;