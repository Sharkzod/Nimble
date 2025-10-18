'use client';

import BottomNavigation from '@/app/components/BottomNav';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/TopBar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type OrderTab = 'incoming' | 'my-orders';
type OrderStatus = 'all' | 'to-pay' | 'paid' | 'appeal' | 'completed' | 'failed';

interface Order {
  id: string;
  customerName: string;
  customerAvatar?: string;
  productName: string;
  productImage?: string;
  amount: number;
  time: string;
  status: OrderStatus;
}

interface OrdersListProps {
  initialOrders?: Order[];
}

export default function OrdersList({
  initialOrders = [
    {
      id: '1',
      customerName: 'Agnes David',
      productName: 'Crownfield delicious granola cereal',
      productImage: '',
      amount: 10000,
      time: '9:00pm',
      status: 'to-pay'
    },
    {
      id: '2',
      customerName: 'Susan',
      productName: 'Cerave eczema face cleanser',
      productImage: '',
      amount: 40000,
      time: '4 April',
      status: 'paid'
    }
  ],
}: OrdersListProps) {
  const [activeTab, setActiveTab] = useState<OrderTab>('my-orders');
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('all');
  const [orders] = useState<Order[]>(initialOrders);
  const router = useRouter();

  const statusFilters: { id: OrderStatus; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'to-pay', label: 'To pay' },
    { id: 'paid', label: 'Paid' },
    { id: 'appeal', label: 'Appeal' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' }
  ];

  const filteredOrders = orders.filter(order => 
    activeStatus === 'all' || order.status === activeStatus
  );

  const handleOrderClick = (orderId: string) => {
    // Navigate to the chat page with the order ID
    router.push(`/dashboard/message/${orderId}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full mx-auto bg-white">
      <div className="block">
        <Header />  
      </div>
      
      <div className='w-[90%] flex flex-col m-auto justify-center items-center mt-[20px]'>
        {/* Tabs */}
        <div className="flex w-full gap-8 border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`pb-4 px-2 text-base font-medium transition-colors relative ${
              activeTab === 'incoming'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Incoming orders
            {activeTab === 'incoming' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('my-orders')}
            className={`pb-4 px-2 text-base font-medium transition-colors relative ${
              activeTab === 'my-orders'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My orders
            {activeTab === 'my-orders' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex w-full flex-wrap gap-3 p-6 border-b border-gray-100">
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveStatus(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeStatus === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="divide-y w-full divide-gray-100">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No orders found
            </div>
          ) : (
            filteredOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => handleOrderClick(order.id)}
                className="w-full p-6 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {order.customerAvatar ? (
                      <img
                        src={order.customerAvatar}
                        alt={order.customerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {getInitials(order.customerName)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="text-base font-normal text-gray-600">
                        {order.customerName}
                      </h3>
                      <span className="text-sm text-gray-500 flex-shrink-0">
                        {order.time}
                      </span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 mb-1">
                      {order.productName}
                    </p>
                    <p className="text-base text-gray-600">
                      You sent an offer of ₦{order.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation/>
      </div>
      <Footer/>
    </div>
  );
}