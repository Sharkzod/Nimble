'use client'
import React, { useState } from 'react';
import Header from '@/app/components/TopBar';
import VerticalNavMenu from '@/app/components/SidebarNavigation';
import Footer from '@/app/components/Footer';
import ToPayTab from '@/app/components/myOrderComponents/ToPayTab';
import PaidTab from '@/app/components/myOrderComponents/PaidTab';
import AppealTab from '@/app/components/myOrderComponents/Appealtab';
import CompletedOrdersComponent from '@/app/components/myOrderComponents/NewCompleted';
import FailedOrdersComponent from '@/app/components/myOrderComponents/NewFailed';
import ActiveListingsComponent from '@/app/components/myRequestsComponents/ActiveComponent';
import UnderReview from '@/app/components/myRequestsComponents/UnderReview';
import Closed from '@/app/components/myRequestsComponents/Closed';
import DraftsRequestsComponent from '@/app/components/myRequestsComponents/Drafts';

type OrderTab = 'active' | 'under review' | 'close' | 'drafts';

const MyListingsComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderTab>('active');

  const tabs: { id: OrderTab; label: string }[] = [
    { id: 'active', label: 'Active' },
    { id: 'under review', label: 'Under review' },
    { id: 'close', label: 'Close' },
    { id: 'drafts', label: 'Drafts' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'active':
        return <ActiveListingsComponent />;
      case 'under review':
        return <UnderReview />;
      case 'close':
        return <Closed />;
      case 'drafts':
        return <DraftsRequestsComponent/>;
      default:
        return <ActiveListingsComponent />;
    }
  };

  return (
    <div className="w-full flex flex-col">
      <Header/>
      <div className="w-full flex mx-auto p-6 bg-gray-50">
        <VerticalNavMenu/>     
        <div className="flex flex-col ml-[5%] mt-[30px] w-[70%]">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Requests</h1>

          {/* Tabs */}
          <div className="bg-white border-b border-gray-200 mb-6">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium transition-colors duration-200 relative ${
                    activeTab === tab.id
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default MyListingsComponent;