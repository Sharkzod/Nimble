'use client'
import React, { useState } from 'react';
import { SettingsTab } from '@/app/types/settings';
import SettingsLayout from '@/app/components/settingsComponents/SettingsLayout';
import PersonalDetails from '@/app/components/settingsComponents/PersonalDetails';
import BusinessDetails from '@/app/components/settingsComponents/BusinessDetails';
import ShippingAddress from '@/app/components/settingsComponents/ShippingAddress';
import WithdrawalDetails from '@/app/components/settingsComponents/WithdrawalDetails';
import ChangePassword from '@/app/components/settingsComponents/ChangePassword';
import NotificationSettings from '@/app/components/settingsComponents/NotificationSettings';
import DeleteAccount from '@/app/components/settingsComponents/DeleteAccount';
import Header from '@/app/components/TopBar';
import VerticalNavMenu from '@/app/components/SidebarNavigation';
import Footer from '@/app/components/Footer';
import BottomNavigation from '@/app/components/BottomNav';
import MobileTopBar from '@/app/components/MobileTopBar';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('personal');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalDetails />;
      case 'business':
        return <BusinessDetails />;
      case 'shipping':
        return <ShippingAddress />;
      case 'withdrawal':
        return <WithdrawalDetails />;
      case 'password':
        return <ChangePassword />;
      case 'notifications':
        return <NotificationSettings />;
      case 'delete':
        return <DeleteAccount />;
      default:
        return <PersonalDetails />;
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50">
       <div className="hidden md:block">
        <Header/>
      </div>

       <div className="block md:hidden fixed top-0 left-0 right-0 z-50">
              <MobileTopBar/>
            </div>
      <div className="w-full sm:w-[100%] flex flex-col sm:flex-row justify-between lg:flex-row mx-auto p-3 sm:p-4 md:p-6 bg-gray-50 mt-[50px] sm:mt-0">
        {/* Sidebar - hidden on mobile, shown on lg screens */}
        <div className="w-[0%]">
          <VerticalNavMenu/>
        </div>
        <div className='w-full sm:w-[80%]'>
    <SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveTab()}
    </SettingsLayout>
    </div>
    </div>
    <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation/>
      </div>
    <Footer/>
    </div>
  );
};

export default SettingsPage;