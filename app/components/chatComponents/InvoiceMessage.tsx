'use client';
import React, { useState, useEffect } from 'react';
import { MessageComponentProps } from '@/app/types/types';
import PaymentPopup from './PaymentPopUp';

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

export default function InvoiceMessage({ 
  message, 
  currentUserId,
  chat,
  onPayInvoice,
  onDeclineInvoice
}: MessageComponentProps & {
  chat?: Chat;
  onPayInvoice?: (message: Message) => void;
  onDeclineInvoice?: (message: Message) => void;
}) {
  const [cachedInvoiceData, setCachedInvoiceData] = useState<any>(null);
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  const isUserMessage = message.sender._id === currentUserId;
  const invoiceStatus = message.invoice?.status || 'pending';
  
  // Store invoice data when available
  useEffect(() => {
    if (message.invoice && Object.keys(message.invoice).length > 0) {
      const invoiceCacheKey = `invoice_${message._id}`;
      const invoiceData = JSON.stringify(message.invoice);
      
      try {
        localStorage.setItem(invoiceCacheKey, invoiceData);
        console.log('💾 Stored invoice in cache:', invoiceCacheKey);
      } catch (error) {
        console.error('❌ Error storing invoice in localStorage:', error);
      }
    }
  }, [message.invoice, message._id]);

  // Retrieve cached invoice data
  useEffect(() => {
    if (!message.invoice || Object.keys(message.invoice).length === 0) {
      const invoiceCacheKey = `invoice_${message._id}`;
      const cachedData = localStorage.getItem(invoiceCacheKey);
      
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          console.log('📥 Retrieved cached invoice data:', parsedData);
          setCachedInvoiceData(parsedData);
        } catch (error) {
          console.error('❌ Error parsing cached invoice data:', error);
        }
      }
    }
  }, [message.invoice, message._id]);

  const effectiveInvoice = message.invoice && Object.keys(message.invoice).length > 0 
    ? message.invoice 
    : cachedInvoiceData;

  // Parse invoice data
  const parseInvoiceData = () => {
    const invoice = effectiveInvoice || {};
    const description = invoice.description || message.text || '';

    // Method 1: Use direct invoice data
    if (invoice.items && invoice.items.length > 0) {
      const quantity = invoice.items[0].quantity || 1;
      const pricePerUnit = invoice.items[0].price || 0;
      const deliveryFee = invoice.deliveryFee || 0;
      const subtotal = invoice.subtotal || (quantity * pricePerUnit);
      const commission = invoice.commission || (subtotal * 0.1);
      const total = invoice.amount || (subtotal + deliveryFee);
      const sellerReceives = invoice.youReceive || (subtotal - commission + deliveryFee);
      
      return {
        quantity,
        pricePerUnit,
        deliveryFee,
        subtotal,
        commission,
        total,
        sellerReceives,
        productName: invoice.items[0].name || chat?.product?.name || 'Product',
        size: invoice.items[0].size
      };
    }
    
    // Method 2: Parse from description
    if (description) {
      const quantityMatch = description.match(/Quantity:\s*(\d+)/i);
      const priceMatch = description.match(/Price per unit:\s*₦?\s*([\d,.]+)/i);
      const deliveryMatch = description.match(/Delivery:\s*₦?\s*([\d,.]+)/i);
      
      const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
      const pricePerUnit = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
      const deliveryFee = deliveryMatch ? parseFloat(deliveryMatch[1].replace(/,/g, '')) : 0;
      
      const subtotal = quantity * pricePerUnit;
      const commission = subtotal * 0.1;
      const total = invoice.amount || (subtotal + deliveryFee);
      const sellerReceives = subtotal - commission + deliveryFee;
      
      return {
        quantity,
        pricePerUnit,
        deliveryFee,
        subtotal,
        commission,
        total,
        sellerReceives,
        productName: chat?.product?.name || 'Product'
      };
    }
    
    // Method 3: Fallback to amount only
    if (invoice.amount && invoice.amount > 0) {
      return {
        quantity: 1,
        pricePerUnit: invoice.amount,
        deliveryFee: 0,
        subtotal: invoice.amount,
        commission: invoice.amount * 0.1,
        total: invoice.amount,
        sellerReceives: invoice.amount * 0.9,
        productName: chat?.product?.name || 'Product'
      };
    }
    
    return {
      quantity: 1,
      pricePerUnit: 0,
      deliveryFee: 0,
      subtotal: 0,
      commission: 0,
      total: 0,
      sellerReceives: 0,
      productName: chat?.product?.name || 'Product'
    };
  };

  const {
    quantity,
    pricePerUnit,
    deliveryFee,
    subtotal,
    commission,
    total,
    sellerReceives,
    productName,
    size
  } = parseInvoiceData();

  const displayTotal = total > 0 ? total : 0;
  const displaySubtotal = subtotal > 0 ? subtotal : 0;
  const displayCommission = commission > 0 ? commission : 0;
  const displaySellerReceives = sellerReceives > 0 ? sellerReceives : 0;
  const displayDeliveryFee = deliveryFee > 0 ? deliveryFee : 0;

  const firstName = `${message.sender.firstName}`;
  const capitalized = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  // Handle payment button click - opens popup
  const handlePayClick = () => {
    setIsPaymentPopupOpen(true);
  };

  // Handle payment confirmation from popup
  const handleConfirmPayment = async (paymentData: {
    paymentMethod: 'crypto' | 'bank-transfer';
    deliveryAddress: {
      name: string;
      phone: string;
      address: string;
    };
  }) => {
    console.log('💳 Payment confirmed with data:', paymentData);
    setPaymentLoading(true);

    try {
      // Call the parent's onPayInvoice handler if it exists
      if (onPayInvoice) {
        await onPayInvoice(message);
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsPaymentPopupOpen(false);
      setPaymentLoading(false);
      
      // Show success message
      alert('Payment processed successfully!');
    } catch (error) {
      console.error('❌ Payment error:', error);
      setPaymentLoading(false);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <>
      <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} gap-3`}>
        {/* Profile picture for messages from others */}
        {!isUserMessage && (
          <div className="flex-shrink-0">
            {message.sender.profilePic ? (
              <img 
                src={message.sender.profilePic} 
                alt={message.sender.firstName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold">
                {message.sender.firstName?.[0]}{message.sender.lastName?.[0]}
              </div>
            )}
          </div>
        )}

        <div className={`flex flex-col ${isUserMessage ? 'items-end' : 'items-start'}`}>
          <div className={`rounded-2xl p-0 max-w-xs ${isUserMessage ? 'bg-[#3652AD1A] border border-green-200' : 'bg-[#3652AD1A] border border-gray-200 shadow-sm'}`}>
            {/* Invoice Header */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3652AD] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {isUserMessage ? 'You sent an invoice' : `${capitalized} sent you an invoice`}
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    ₦{pricePerUnit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Product details</h3>
              
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{productName}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-600">
                      Qty: {quantity} 
                      {size && ` • Size: ${size}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Summary Table */}
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Summary</h3>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 text-sm text-gray-600">Sub-total</td>
                    <td className="py-1 text-sm text-gray-900 text-right">₦{displaySubtotal.toLocaleString()}</td>
                  </tr>
                  {isUserMessage && displayCommission > 0 && (
                    <tr>
                      <td className="py-1 text-sm text-gray-600">Commission (10%)</td>
                      <td className="py-1 text-sm text-red-600 text-right">-₦{displayCommission.toLocaleString()}</td>
                    </tr>
                  )}
                  {displayDeliveryFee > 0 && (
                    <tr>
                      <td className="py-1 text-sm text-gray-600">Delivery fee</td>
                      <td className="py-1 text-sm text-gray-900 text-right">₦{displayDeliveryFee.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr className="border-t">
                    <td className="py-2 text-sm font-semibold text-gray-900">
                      {isUserMessage ? 'You receive' : 'Total'}
                    </td>
                    <td className="py-2 text-sm font-semibold text-gray-900 text-right">
                      ₦{(isUserMessage ? displaySellerReceives : displayTotal).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Action Buttons - Only for buyer on pending invoices */}
            {!isUserMessage && displayTotal > 0 && (
              <div className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={handlePayClick}
                    className="flex-1 px-4 py-2 bg-transparent text-[#3652ADB2] font-medium rounded-[100px] border-[#3652ADB2] border text-sm hover:bg-[#3652AD] hover:text-white transition-colors"
                  >
                    Pay now
                  </button>
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {displayTotal === 0 && (
              <div className="p-4">
                <p className="text-sm text-center text-yellow-600">
                  ⚠️ Invoice details loading...
                </p>
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <p className="text-xs text-gray-500 mt-1 ml-1">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Profile picture for user's own messages */}
        {isUserMessage && (
          <div className="flex-shrink-0">
            {message.sender.profilePic ? (
              <img 
                src={message.sender.profilePic} 
                alt="You"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold">
                {message.sender.firstName?.[0]}{message.sender.lastName?.[0]}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Popup */}
      <PaymentPopup
        isOpen={isPaymentPopupOpen}
        onClose={() => setIsPaymentPopupOpen(false)}
        onConfirmPayment={handleConfirmPayment}
        orderDetails={{
          productName: productName,
          productImage: chat?.product?.images?.[0],
          size: size,
          quantity: quantity,
          unitPrice: pricePerUnit,
          deliveryFee: displayDeliveryFee,
          total: displayTotal
        }}
        loading={paymentLoading}
      />
    </>
  );
}