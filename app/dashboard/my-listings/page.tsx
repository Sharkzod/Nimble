'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Search, MoreVertical, Edit, Eye, Share2, Trash2, Home, FileText, MessageSquare, User, PlusCircle } from 'lucide-react';

type ListingTab = 'active' | 'pending' | 'renew' | 'closed' | 'drafts' | 'rejected';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  status: ListingTab;
  listedOn: string;
  expiresOn?: string;
  reason?: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Photopulse camera',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
    status: 'active',
    listedOn: '4/10/2023'
  },
  {
    id: '2',
    name: 'Photopulse camera',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1606933248010-ef7a8c02e1b8?w=400',
    status: 'active',
    listedOn: '4/10/2023'
  },
  {
    id: '3',
    name: 'Vintage Watch',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
    status: 'pending',
    listedOn: '5/10/2023'
  },
  {
    id: '4',
    name: 'Wireless Headphones',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    status: 'renew',
    listedOn: '1/10/2023',
    expiresOn: '15/10/2023'
  },
  {
    id: '5',
    name: 'Gaming Console',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
    status: 'closed',
    listedOn: '20/09/2023'
  },
  {
    id: '6',
    name: 'Smartphone',
    price: 80000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    status: 'drafts',
    listedOn: '6/10/2023'
  },
  {
    id: '7',
    name: 'Designer Bag',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
    status: 'rejected',
    listedOn: '3/10/2023',
    reason: 'Inappropriate category'
  }
];

const MyListingsPage = () => {
  const [activeTab, setActiveTab] = useState<ListingTab>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const tabs: { id: ListingTab; label: string }[] = [
    { id: 'active', label: 'Active' },
    { id: 'pending', label: 'Pending' },
    { id: 'renew', label: 'To renew' },
    { id: 'closed', label: 'Closed' },
    { id: 'drafts', label: 'Drafts' },
    { id: 'rejected', label: 'Rejected' },
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  
  const router = useRouter();
  const navigateBack = () => {
    router.push('/dashboard/user');
  }

  const toggleMenu = (productId: string) => {
    setOpenMenuId(openMenuId === productId ? null : productId);
  };

  const handleMenuAction = (action: string, productId: string) => {
    console.log(`${action} product:`, productId);
    
    switch (action) {
      case 'edit':
        // Navigate to edit page or open edit modal
        console.log('Editing product:', productId);
        break;
      case 'view':
        // Navigate to product detail page
        console.log('Viewing product:', productId);
        break;
      case 'markSold':
        markAsSold(productId);
        break;
      case 'share':
        shareProduct(productId);
        break;
      case 'delete':
        deleteProduct(productId);
        break;
      case 'renew':
        renewProduct(productId);
        break;
      case 'republish':
        republishProduct(productId);
        break;
    }
    setOpenMenuId(null);
  };

  const markAsSold = (productId: string) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, status: 'Sold' as ListingTab }
        : product
    ));
    console.log('Product marked as sold:', productId);
  };

  const deleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId));
      console.log('Product deleted:', productId);
    }
  };

  const shareProduct = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} for ${formatPrice(product.price)}`,
          url: window.location.href,
        });
        console.log('Product shared successfully');
      } catch (error) {
        console.log('Error sharing product:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const renewProduct = (productId: string) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { 
            ...product, 
            status: 'active' as ListingTab,
            listedOn: new Date().toLocaleDateString(),
            expiresOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
          }
        : product
    ));
    console.log('Product renewed:', productId);
  };

  const republishProduct = (productId: string) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, status: 'pending' as ListingTab }
        : product
    ));
    console.log('Product republished:', productId);
  };

  const getStatusColor = (status: ListingTab) => {
    const colors = {
      active: 'text-green-600',
      pending: 'text-yellow-600',
      renew: 'text-orange-600',
      closed: 'text-[#0DBA37]',
      drafts: 'text-[#EF4444]',
      rejected: 'text-red-600'
    };
    return colors[status];
  };

  const getStatusText = (status: ListingTab) => {
    const texts = {
      active: 'Active',
      pending: 'Pending Review',
      renew: 'Pending',
      closed: 'Sold',
      drafts: 'Draft',
      rejected: 'Rejected'
    };
    return texts[status];
  };

  const getActionButtons = (product: Product) => {
    switch (product.status) {
      case 'active':
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => markAsSold(product.id)}
              className="flex-1 py-2 px-4 border border-[#3652AD] text-[#3652AD] text-[11px] font-medium rounded-full hover:bg-blue-50"
            >
              Mark as sold out
            </button>
            <button 
              onClick={() => handleMenuAction('edit', product.id)}
              className="flex-1 py-2 px-4 bg-[#3652AD] text-white text-[11px] font-medium rounded-full hover:bg-[#3652AD]"
            >
              Edit
            </button>
          </div>
        );
      case 'pending':
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => handleMenuAction('edit', product.id)}
              className="flex-1 py-2 px-4 border border-[#3652AD] text-[#3652AD] text-xs font-medium rounded-full hover:bg-blue-50"
            >
              Edit
            </button>
            {/* <button 
              onClick={() => deleteProduct(product.id)}
              className="flex-1 py-2 px-4 bg-red-600 text-white text-xs font-medium rounded-full hover:bg-red-700"
            >
              Delete
            </button> */}
          </div>
        );
      case 'renew':
        return (
          <div className="flex gap-2">
            {/* <button 
              onClick={() => handleMenuAction('renew', product.id)}
              className="flex-1 py-2 px-4 bg-green-600 text-white text-xs font-medium rounded-full hover:bg-green-700"
            >
              Renew Now
            </button> */}
            <button 
              onClick={() => handleMenuAction('edit', product.id)}
              className="flex-1 py-2 px-4 border border-[#3652AD] text-[#3652AD] text-xs font-medium rounded-full hover:bg-blue-50"
            >
              Edit
            </button>
          </div>
        );
      case 'closed':
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => handleMenuAction('republish', product.id)}
              className="flex-1 py-2 px-4 bg-white border border-[#3652AD] text-[#3652AD] text-xs font-medium rounded-full hover:bg-blue-700"
            >
              Edit
            </button>
            <button 
              onClick={() => deleteProduct(product.id)}
              className="flex-1 py-2 px-4 border bg-[#3652AD] text-white text-xs font-medium rounded-full hover:bg-red-50"
            >
              Re-list
            </button>
          </div>
        );
      case 'drafts':
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => handleMenuAction('edit', product.id)}
              className="flex-1 py-2 px-4 border border-[#3652AD] text-[#3652AD] text-xs font-medium rounded-full hover:bg-blue-700"
            >
              Edit
            </button>
            <button 
              onClick={() => handleMenuAction('republish', product.id)}
              className="flex-1 py-2 px-4 border bg-[#3652AD] text-xs font-medium rounded-full hover:bg-green-50"
            >
              Publish
            </button>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => handleMenuAction('edit', product.id)}
              className="flex-1 py-2 px-4 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700"
            >
              Edit & Resubmit
            </button>
            <button 
              onClick={() => deleteProduct(product.id)}
              className="flex-1 py-2 px-4 border border-red-600 text-red-600 text-xs font-medium rounded-full hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const getMenuItems = (product: Product) => {
    const baseItems = [
      { icon: <Edit className="w-4 h-4" />, label: 'Edit', action: 'edit' },
      { icon: <Eye className="w-4 h-4" />, label: 'View', action: 'view' },
      { icon: <Share2 className="w-4 h-4" />, label: 'Share', action: 'share' },
    ];

    const statusSpecificItems = {
      active: [
        ...baseItems,
        { 
          icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 12l2 2 4-4" />
          </svg>, 
          label: 'Mark as sold out', 
          action: 'markSold' 
        },
      ],
      pending: baseItems,
      renew: [
        ...baseItems,
        { 
          icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>, 
          label: 'Renew', 
          action: 'renew' 
        },
      ],
      closed: [
        ...baseItems,
        { 
          icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>, 
          label: 'Republish', 
          action: 'republish' 
        },
      ],
      drafts: baseItems,
      rejected: baseItems,
    };

    const items = statusSpecificItems[product.status] || baseItems;

    return [
      ...items,
      { icon: <Trash2 className="w-4 h-4" />, label: 'Delete', action: 'delete', isDestructive: true }
    ];
  };

  const filteredProducts = products.filter(product => 
    product.status === activeTab && 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button onClick={navigateBack} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">My listing</h1>
        </div>
        <button className="p-1">
          <Settings className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full placeholder-gray-500 pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap relative flex-shrink-0 ${
              activeTab === tab.id
                ? 'text-[#3652AD]'
                : 'text-gray-600'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3652AD]" />
            )}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FileText className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-sm">No {tabs.find(tab => tab.id === activeTab)?.label?.toLowerCase()} listings found</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="px-4 py-4 border-b border-gray-100">
              <div className="flex gap-3">
                {/* Product Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex justify-between items-start mb-1 w-full">
                    <div className="w-full">
                      <div className='border-b border-gray-400 pb-1'>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-base font-bold text-gray-900 mb-2">
                        {formatPrice(product.price)}
                      </p>
                      </div>
                      <div className='flex w-full justify-between mt-3'>
                      <p className="text-xs text-gray-500 mb-1">
                        Listed on: {product.listedOn}
                      </p>
                       <span className={`text-xs font-medium ${getStatusColor(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                      </div>
                      {/* {product.expiresOn && (
                        <p className="text-xs text-orange-500 mb-1">
                          Expires on: {product.expiresOn}
                        </p>
                      )} */}
                      {product.reason && (
                        <p className="text-xs text-red-500 mb-1">
                          Reason: {product.reason}
                        </p>
                      )}
                    </div>

                    {/* Status and Menu */}
                    <div className="flex items-center gap-2">
                     
                      <div className="relative">
                        <button 
                          onClick={() => toggleMenu(product.id)}
                          className="p-1"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === product.id && (
                          <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                            {getMenuItems(product).map((item, index) => (
                              <button
                                key={index}
                                onClick={() => handleMenuAction(item.action, product.id)}
                                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${
                                  item.isDestructive 
                                    ? 'text-red-600 hover:bg-red-50' 
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {item.icon}
                                {item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {getActionButtons(product)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      {/* <div className="border-t border-gray-200 bg-white">
        <div className="flex items-center justify-around py-2">
          <button className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <FileText className="w-5 h-5" />
            <span className="text-xs">Feed</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">Requests</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <PlusCircle className="w-5 h-5" />
            <span className="text-xs">Sell</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">Messages</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-blue-600">
            <User className="w-5 h-5" />
            <span className="text-xs">Account</span>
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default MyListingsPage;