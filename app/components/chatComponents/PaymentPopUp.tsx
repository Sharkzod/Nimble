
'use client';
import React, { useState, useEffect } from 'react';

interface Message {
  _id: string;
  chatId?: string;
  chat?: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  type: 'text' | 'invoice' | 'payment' | 'offer' | 'extra-charge' | 'offer-accepted' | 'payment-request' | 'counter-declined';
  text?: string;
  offer?: {
    amount: number;
    status: 'sent' | 'accepted' | 'declined';
    proposedBy: string;
    bestPrice?: number;
    initialOfferMessageId?: string;
  };
  invoice?: {
    amount: number;
    description?: string;
    status: 'pending' | 'paid' | 'cancelled';
    currency?: string;
    dueDate?: string;
    items?: Array<{
      name: string;
      quantity: number;
      size?: string;
      price: number;
    }>;
    notes?: string;
    deliveryFee?: number;
    subtotal?: number;
    commission?: number;
    youReceive?: number;
  };
  payment?: any;
  extraCharge?: any;
  isFromAdmin?: boolean;
  readBy?: string[];
  tempId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Chat {
  _id: string;
  buyer: { _id: string; firstName: string; lastName: string; profilePic?: string };
  seller: { _id: string; firstName: string; lastName: string; profilePic?: string };
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
}

interface MessageComponentProps {
  message: Message;
  currentUserId: string;
}

// Payment Popup Component
export default function PaymentPopup({ 
  isOpen, 
  onClose, 
  onConfirmPayment,
  orderDetails,
  loading = false
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirmPayment: (paymentData: {
    paymentMethod: 'crypto' | 'bank-transfer';
    deliveryAddress: {
      name: string;
      phone: string;
      address: string;
    };
  }) => void;
  orderDetails: {
    productName: string;
    productImage?: string;
    size?: string;
    quantity: number;
    unitPrice: number;
    deliveryFee: number;
    total: number;
  };
  loading?: boolean;
}) {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'bank-transfer'>('crypto');
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: 'John Apologist',
    phone: '+254-687-587657',
    address: '177, Agbrey Road, Ibadan, Oyo state'
  });
  const [showAddressEdit, setShowAddressEdit] = useState(false);

  const handleConfirm = () => {
    onConfirmPayment({
      paymentMethod,
      deliveryAddress
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Place order</h2>
          <button 
            onClick={onClose}
            className="text-red-500 font-semibold text-sm"
            disabled={loading}
          >
            Cancel
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Safety Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-800 mb-1">
                  Your money is safe
                </p>
                <p className="text-xs text-orange-700">
                  Your payment will be held until you confirm the order has been delivered to you.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Delivery address
            </h3>
            
            {showAddressEdit ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={deliveryAddress.name}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, name: e.target.value})}
                  placeholder="Full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  value={deliveryAddress.phone}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                  placeholder="Phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={deliveryAddress.address}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, address: e.target.value})}
                  placeholder="Delivery address"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setShowAddressEdit(false)}
                  className="text-sm text-blue-600 font-medium"
                >
                  Save address
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 relative">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    O
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm mb-1">
                      {deliveryAddress.name}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      {deliveryAddress.phone}
                    </p>
                    <p className="text-xs text-gray-600">
                      {deliveryAddress.address}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddressEdit(true)}
                    className="text-blue-600 text-sm font-medium"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Options */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Select payment option
            </h3>
            
            <div className="space-y-3">
              {/* Crypto Currency */}
              <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="crypto"
                    checked={paymentMethod === 'crypto'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'crypto')}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="font-medium text-gray-900">Crypto currency</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold">T</div>
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">B</div>
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">E</div>
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs font-bold">○</div>
                </div>
              </label>

              {/* Bank Transfer */}
              <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="bank-transfer"
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'bank-transfer')}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="font-medium text-gray-900">Bank transfer</span>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Order Summary
            </h3>
            
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              {/* Product Item */}
              <div className="flex items-center gap-3">
                {orderDetails.productImage ? (
                  <img 
                    src={orderDetails.productImage} 
                    alt={orderDetails.productName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-300"></div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {orderDetails.productName}
                  </p>
                  {orderDetails.size && (
                    <p className="text-xs text-gray-500">Size: {orderDetails.size}</p>
                  )}
                  <p className="text-xs text-gray-500">Qty: {orderDetails.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">
                  ₦{orderDetails.unitPrice.toLocaleString()}
                </p>
              </div>

              {/* Delivery Fee */}
              {orderDetails.deliveryFee > 0 && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Delivery Fee</p>
                  <p className="font-semibold text-gray-900">
                    ₦{orderDetails.deliveryFee.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300">
                <p className="text-base font-bold text-gray-900">Total:</p>
                <p className="text-lg font-bold text-gray-900">
                  ₦{orderDetails.total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}