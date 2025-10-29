'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import Footer from '@/app/components/Footer';

// Mock hook for demonstration
const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [product, setProduct] = useState(null);

  const createProduct = async (data: any) => {
    setLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Product data:', data);
      setLoading(false);
      setSuccess(true);
      setProduct(data);
    }, 2000);
  };

  return { createProduct, loading, error, success, product };
};

interface BulkPrice {
  minQuantity: number;
  price: number;
}

const categories = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Toys & Games',
  'Automotive',
  'Health & Beauty',
  'Food & Beverages',
  'Other'
];

const cities = ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Benin City', 'Kaduna'];
const states = ['Lagos', 'Abuja FCT', 'Rivers', 'Kano', 'Oyo', 'Edo', 'Kaduna'];
const conditions = ['New', 'Like New', 'Good', 'Fair', 'For Parts'];
const countries = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United States', 'United Kingdom'];
const deliveryLocations = ['Lagos', 'Abuja', 'Port Harcourt', 'Nationwide'];
const scopes = ['Nationwide', 'State-wide', 'City-only'];
const deliveryTypes = ['Same day', '1-2 days', '2-3 days', '4-6 days'];

export default function PostItemPage() {
  // Basic Product Information
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [condition, setCondition] = useState('New');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoLink, setVideoLink] = useState('');
  const { createProduct, loading, error, success, product } = useCreateProduct();
  const [bulkPrices, setBulkPrices] = useState<BulkPrice[]>([
    { minQuantity: 2, price: 10000 },
    { minQuantity: 4, price: 9800 }
  ]);
  const [editingBulkIndex, setEditingBulkIndex] = useState<number | null>(null);
  const [editBulkQuantity, setEditBulkQuantity] = useState('');
  const [editBulkPrice, setEditBulkPrice] = useState('');

  // Warranty
  const [warrantyValue, setWarrantyValue] = useState('');
  const [warrantyPeriod, setWarrantyPeriod] = useState<'Month' | 'Year'>('Month');

  // Shipping
  const [shippedFromAbroad, setShippedFromAbroad] = useState(false);
  const [showShippingDetails, setShowShippingDetails] = useState(true);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [scope, setScope] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingOptions, setShippingOptions] = useState<string[]>([]);

  // Dropdown states
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showWarrantyDropdown, setShowWarrantyDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showScopeDropdown, setShowScopeDropdown] = useState(false);
  const [showDeliveryTypeDropdown, setShowDeliveryTypeDropdown] = useState(false);
  const [showDaysDropdown, setShowDaysDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showShippingCityDropdown, setShowShippingCityDropdown] = useState(false);
  const [showShippingStateDropdown, setShowShippingStateDropdown] = useState(false);
  const [showShippingOptions, setShowShippingOptions] = useState(false);

  // Refs for click outside detection
  const categoryRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const conditionRef = useRef<HTMLDivElement>(null);
  const warrantyRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);
  const deliveryTypeRef = useRef<HTMLDivElement>(null);
  const daysRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const shippingCityRef = useRef<HTMLDivElement>(null);
  const shippingStateRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setShowStateDropdown(false);
      }
      if (conditionRef.current && !conditionRef.current.contains(event.target as Node)) {
        setShowConditionDropdown(false);
      }
      if (warrantyRef.current && !warrantyRef.current.contains(event.target as Node)) {
        setShowWarrantyDropdown(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (scopeRef.current && !scopeRef.current.contains(event.target as Node)) {
        setShowScopeDropdown(false);
      }
      if (deliveryTypeRef.current && !deliveryTypeRef.current.contains(event.target as Node)) {
        setShowDeliveryTypeDropdown(false);
      }
      if (daysRef.current && !daysRef.current.contains(event.target as Node)) {
        setShowDaysDropdown(false);
      }
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
      if (shippingCityRef.current && !shippingCityRef.current.contains(event.target as Node)) {
        setShowShippingCityDropdown(false);
      }
      if (shippingStateRef.current && !shippingStateRef.current.contains(event.target as Node)) {
        setShowShippingStateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  useEffect(() => {
    if (success) {
      console.log('Product created successfully:', product);
      alert('Product created successfully!');
    }
    
    if (error) {
      console.error('Product creation error:', error);
      alert(`Error: ${error}`);
    }
  }, [success, error, product]);

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const calculateCommission = (amount: number) => {
    return (amount * 0.1).toFixed(0);
  };

  const calculateYouReceive = (amount: number) => {
    return (amount * 0.9).toFixed(0);
  };

  const addBulkPrice = () => {
    if (bulkPrices.length === 0) {
      // If no bulk prices exist, create first one based on main price
      const basePrice = Number(price) || 10000;
      setBulkPrices([{ minQuantity: 2, price: basePrice - 200 }]);
    } else {
      const lastPrice = bulkPrices[bulkPrices.length - 1];
      setBulkPrices([...bulkPrices, { minQuantity: lastPrice.minQuantity + 2, price: lastPrice.price - 200 }]);
    }
  };

  const removeBulkPrice = (index: number) => {
    setBulkPrices(bulkPrices.filter((_, i) => i !== index));
  };

  const startEditingBulk = (index: number) => {
    setEditingBulkIndex(index);
    setEditBulkQuantity(bulkPrices[index].minQuantity.toString());
    setEditBulkPrice(bulkPrices[index].price.toString());
  };

  const saveEditingBulk = () => {
    if (editingBulkIndex !== null) {
      const updated = [...bulkPrices];
      updated[editingBulkIndex] = {
        minQuantity: Number(editBulkQuantity),
        price: Number(editBulkPrice)
      };
      setBulkPrices(updated);
      setEditingBulkIndex(null);
      setEditBulkQuantity('');
      setEditBulkPrice('');
    }
  };

  const cancelEditingBulk = () => {
    setEditingBulkIndex(null);
    setEditBulkQuantity('');
    setEditBulkPrice('');
  };

  const handleWarrantyChange = (value: string, period: 'Month' | 'Year') => {
    setWarrantyValue(value);
    setWarrantyPeriod(period);
    setShowWarrantyDropdown(false);
  };

  const handleShippingOptionToggle = (option: string) => {
    if (shippingOptions.includes(option)) {
      setShippingOptions(shippingOptions.filter(o => o !== option));
    } else {
      setShippingOptions([...shippingOptions, option]);
    }
  };

  const toggleShippedFromAbroad = () => {
    setShippedFromAbroad(!shippedFromAbroad);
    if (!shippedFromAbroad) {
      setShowShippingDetails(true);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!title || !category || !price || !city || !state || !description) {
      alert('Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    // Prepare the data for API
    const productData = {
      name: title,
      description: description,
      price: Number(price),
      condition: condition,
      location: {
        city: city,
        state: state
      },
      category: category,
      images: images,
      isNegotiable: false,
      isShippedFromAbroad: shippedFromAbroad,
      shippingAddress: {
        country: shippingCountry || 'Nigeria',
        city: shippingCity || city,
        state: shippingState || state
      },
      shippingOption: shippingOptions,
      deliveryTimelines: [{
        location: deliveryLocation || city,
        scope: scope || 'Nationwide',
        deliveryType: deliveryType || 'Same day',
        numberOfDays: numberOfDays || '1-2 days'
      }],
      videoLink: videoLink || undefined,
      bulkPrices: bulkPrices.length > 0 ? bulkPrices : undefined,
      warranty: warrantyValue ? {
        value: warrantyValue,
        period: warrantyPeriod
      } : undefined
    };

    console.log('Submitting product data:', productData);
    
    try {
      await createProduct(productData);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-900 font-medium">Creating your product...</p>
          <p className="text-gray-600 text-sm mt-2">Please wait while we upload your product</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 shadow sticky top-0 z-10">
        <button className="text-gray-700 hover:text-gray-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Post item</h1>
      </div>

      {success && (
        <div className="mx-4 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Product created successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                Error: {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Form Container */}
      <div className="space-y-4 mt-4">
        {/* Choose Categories Section */}
        <div className="p-4 w-[90%] mx-auto bg-white rounded-2xl border border-gray-200">
          {/* Category Dropdown */}
          <div className="mb-6" ref={categoryRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className={category ? 'text-gray-900' : 'text-gray-500'}>
                  {category || 'Choose category'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCategoryDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-900 font-medium mb-3">
              Add product images
            </label>
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-gray-900 bg-opacity-60 rounded-full p-1 hover:bg-opacity-80"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              
              <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 bg-gray-50">
                <Plus className="w-8 h-8 text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Video Link */}
          <div className="mb-6">
            <input
              type="text"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="Youtube or tiktok video link"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Basic Product Information */}
        <div className="p-4 w-[90%] mx-auto bg-white rounded-2xl border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Product Details</h2>
          
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title*"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Location Section */}
          <div>
            <label className="block text-gray-900 font-medium mb-3">Location</label>
            <div className="grid grid-cols-2 gap-3">
              {/* City Dropdown */}
              <div className="relative" ref={cityRef}>
                <button
                  type="button"
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className={city ? 'text-gray-900' : 'text-gray-500'}>
                    {city || 'City'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCityDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {cities.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setCity(c);
                          setShowCityDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* State Dropdown */}
              <div className="relative" ref={stateRef}>
                <button
                  type="button"
                  onClick={() => setShowStateDropdown(!showStateDropdown)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className={state ? 'text-gray-900' : 'text-gray-500'}>
                    {state || 'State'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showStateDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showStateDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {states.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setState(s);
                          setShowStateDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Condition Dropdown */}
          <div className="relative" ref={conditionRef}>
            <button
              type="button"
              onClick={() => setShowConditionDropdown(!showConditionDropdown)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-gray-900">{condition}</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showConditionDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showConditionDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                {conditions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCondition(c);
                      setShowConditionDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={5}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-medium">₦</div>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
                placeholder="Price*"
                className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Commission Calculation */}
          {price && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Commission: 10%</div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-medium">₦</span>
                  <span className="text-gray-700 text-lg">{calculateCommission(Number(price))}</span>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">You will receive</div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-medium">₦</span>
                  <span className="text-gray-700 text-lg">{calculateYouReceive(Number(price))}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Pricing */}
          <div className="space-y-3">
            {bulkPrices.map((bulk, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                {editingBulkIndex === index ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-gray-600 mb-1 block">Min Quantity</label>
                        <input
                          type="number"
                          value={editBulkQuantity}
                          onChange={(e) => setEditBulkQuantity(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-600 mb-1 block">Price (₦)</label>
                        <input
                          type="number"
                          value={editBulkPrice}
                          onChange={(e) => setEditBulkPrice(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={saveEditingBulk}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#3652AD]"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditingBulk}
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      From {bulk.minQuantity} pieces
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-gray-900">₦{bulk.price.toLocaleString()}</div>
                      <button
                        type="button"
                        onClick={() => removeBulkPrice(index)}
                        className="text-red-500 text-sm font-medium hover:text-red-600"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => startEditingBulk(index)}
                        className="text-blue-600 text-sm font-medium hover:text-[#3652AD]"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addBulkPrice}
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-[#3652AD]"
            >
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
              Add Bulk price
            </button>
          </div>
        </div>

        {/* Warranty Section */}
        <div className='p-4 w-[90%] mx-auto bg-white rounded-2xl border border-gray-200'>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Warranty Information</h2>
          <label className="block text-gray-900 text-sm font-medium mb-2">
            Warranty <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <input
              type="text"
              value={warrantyValue}
              onChange={(e) => handleWarrantyChange(e.target.value.replace(/\D/g, ''), warrantyPeriod)}
              placeholder="No. of months/years"
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="relative w-32" ref={warrantyRef}>
              <button
                type="button"
                onClick={() => setShowWarrantyDropdown(!showWarrantyDropdown)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <span className="text-gray-900">{warrantyPeriod}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showWarrantyDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showWarrantyDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleWarrantyChange(warrantyValue, 'Month')}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100"
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWarrantyChange(warrantyValue, 'Year')}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900"
                  >
                    Year
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Section */}
        <div className="p-4 w-[90%] mx-auto bg-white rounded-2xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-900 font-medium">Shipped from abroad</span>
            <button
              type="button"
              onClick={toggleShippedFromAbroad}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                shippedFromAbroad ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  shippedFromAbroad ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              shippedFromAbroad && showShippingDetails ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-6 pt-4">
              <div>
                <label className="block text-gray-900 font-medium mb-3">Delivery timeline</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="relative" ref={locationRef}>
                    <button
                      type="button"
                      onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className={deliveryLocation ? 'text-gray-900' : 'text-gray-400'}>
                        {deliveryLocation || 'Lagos'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {showLocationDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {deliveryLocations.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => {
                              setDeliveryLocation(loc);
                              setShowLocationDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={deliveryTypeRef}>
                    <button
                      type="button"
                      onClick={() => setShowDeliveryTypeDropdown(!showDeliveryTypeDropdown)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className={deliveryType ? 'text-gray-900' : 'text-gray-400'}>
                        {deliveryType || 'Same day'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {showDeliveryTypeDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {deliveryTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setDeliveryType(type);
                              setShowDeliveryTypeDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative" ref={scopeRef}>
                    <button
                      type="button"
                      onClick={() => setShowScopeDropdown(!showScopeDropdown)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className={scope ? 'text-gray-900' : 'text-gray-400'}>
                        {scope || 'Nationwide'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {showScopeDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {scopes.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setScope(s);
                              setShowScopeDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={daysRef}>
                    <button
                      type="button"
                      onClick={() => setShowDaysDropdown(!showDaysDropdown)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className={numberOfDays ? 'text-gray-900' : 'text-gray-400'}>
                        {numberOfDays || 'Number of days'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {showDaysDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {['1-2 days', '2-3 days', '4-6 days'].map((days) => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => {
                              setNumberOfDays(days);
                              setShowDaysDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            {days}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-2 text-blue-600 font-medium text-sm mt-3 hover:text-[#3652AD]"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <Plus className="w-3 h-3 text-white" />
                  </div>
                  Add another location
                </button>
              </div>

              <div>
                <label className="block text-gray-900 font-medium mb-3">Shipping address</label>
                
                <div className="relative mb-3" ref={countryRef}>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className={shippingCountry ? 'text-gray-900' : 'text-gray-400'}>
                      {shippingCountry || 'Country'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {showCountryDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {countries.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setShippingCountry(c);
                            setShowCountryDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative" ref={shippingCityRef}>
                    <button
                      type="button"
                      onClick={() => setShowShippingCityDropdown(!showShippingCityDropdown)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className={shippingCity ? 'text-gray-900' : 'text-gray-400'}>
                        {shippingCity || 'City'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {showShippingCityDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {cities.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setShippingCity(c);
                              setShowShippingCityDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={shippingStateRef}>
                    <button
                      type="button"
                      onClick={() => setShowShippingStateDropdown(!showShippingStateDropdown)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className={shippingState ? 'text-gray-900' : 'text-gray-400'}>
                        {shippingState || 'State'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {showShippingStateDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {states.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setShippingState(s);
                              setShowShippingStateDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowShippingOptions(!showShippingOptions)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="text-gray-900 font-medium">Shipping option</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showShippingOptions ? 'rotate-180' : ''}`} />
                </button>

                {showShippingOptions && (
                  <div className="mt-3 space-y-3 pl-1">
                    {['Waybill', 'Courier service', 'Dispatch service'].map((option) => (
                      <label key={option} className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-900">{option}</span>
                        <input
                          type="checkbox"
                          checked={shippingOptions.includes(option)}
                          onChange={() => handleShippingOptionToggle(option)}
                          className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:bg-[#3652AD] checked:border-[#3652AD]"
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-4 w-[90%] mx-auto">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full font-semibold py-3 rounded-[100px] transition-colors ${
              loading 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-[#3652AD] text-white hover:bg-[#3652AD]'
            }`}
          >
            {loading ? 'Creating Product...' : 'Post Item'}
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}