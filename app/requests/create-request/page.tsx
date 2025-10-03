'use client'
import React, { useState, ChangeEvent } from 'react';
import { Plus, X } from 'lucide-react';
import Header from '@/app/components/TopBar';
import Footer from '@/app/components/Footer';

const PostListingForm = () => {
  const [category, setCategory] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [videoLink, setVideoLink] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [condition, setCondition] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [negotiable, setNegotiable] = useState<boolean>(false);

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Vehicles',
    'Books',
    'Toys',
    'Other'
  ];

  const cities = ['Lagos', 'Abuja', 'Ibadan', 'Kano', 'Port Harcourt'];
  const states = ['Lagos', 'FCT', 'Oyo', 'Kano', 'Rivers'];
  const conditions = ['New', 'Like new', 'Used'];

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...newImages].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log({
      category,
      images,
      videoLink,
      title,
      city,
      state,
      condition,
      description,
      price,
      negotiable
    });
  };

  return (
    <div className='w-full'>
      <Header/>
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-white mt-[15px]">      
        <div className="space-y-4 sm:space-y-6">
          <h1 className='text-black text-3xl font-bold text-center'>Create Request</h1>
          
          {/* Category Dropdown */}
          <div>
            <select
              value={category}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center'
              }}
            >
              <option value="">Choose category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Add Product Images */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Add product images
            </label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative w-16 h-16 sm:w-20 sm:h-20">
                  <img
                    src={img}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                  >
                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </label>
              )}
            </div>
          </div>

          {/* Video Link */}
          <div>
            <input
              type="url"
              value={videoLink}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setVideoLink(e.target.value)}
              placeholder="Youtube or tiktok video link"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Title*"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <select
                value={city}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setCity(e.target.value)}
                className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center'
                }}
              >
                <option value="">City</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={state}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setState(e.target.value)}
                className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center'
                }}
              >
                <option value="">State</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <select
              value={condition}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setCondition(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center'
              }}
            >
              <option value="">Condition</option>
              {conditions.map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <textarea
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Description"
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-sm sm:text-base text-gray-700 font-medium">
                ₦
              </span>
              <input
                type="number"
                value={price}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                placeholder="Price*"
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Negotiable Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Negotiable
            </label>
            <button
              type="button"
              onClick={() => setNegotiable(!negotiable)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                negotiable ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  negotiable ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-[#3652AD] text-white text-sm sm:text-base font-semibold rounded-full transition-colors"
          >
            Post request
          </button>

          {/* Terms and Privacy */}
          <p className="text-[10px] sm:text-xs text-gray-600 text-center leading-relaxed">
            By posting, you confirm you have read and agree to the{' '}
            <a href="#" className="text-orange-500 hover:underline">
              terms and conditions
            </a>{' '}
            and the{' '}
            <a href="#" className="text-orange-500 hover:underline">
              privacy policy
            </a>
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default PostListingForm;