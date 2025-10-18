'use client';

import { useState } from 'react';

interface BusinessDetailsProps {
  initialData?: {
    businessName: string;
    about: string;
    address: string;
    city: string;
    state: string;
  };
  cities?: string[];
  states?: string[];
  onSave?: (data: BusinessDetailsFormData) => void;
  onCancel?: () => void;
}

interface BusinessDetailsFormData {
  businessName: string;
  about: string;
  address: string;
  city: string;
  state: string;
}

export default function BusinessDetails({
  initialData = {
    businessName: 'Opeyemi',
    about: '',
    address: '',
    city: '',
    state: ''
  },
  cities = ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Benin City'],
  states = ['Lagos', 'FCT', 'Rivers', 'Kano', 'Oyo', 'Edo'],
  onSave,
  onCancel
}: BusinessDetailsProps) {
  const [formData, setFormData] = useState<BusinessDetailsFormData>(initialData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="w-full mx-auto p-8 bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Business details</h1>

      <div className="space-y-6 mb-8">
        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-base font-medium text-gray-800 mb-2">
            Business name
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
        </div>

        {/* About */}
        <div>
          <label htmlFor="about" className="block text-base font-medium text-gray-800 mb-2">
            About
          </label>
          <textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            placeholder="This will be displayed on your profile"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base placeholder:text-gray-400 resize-none"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-base font-medium text-gray-800 mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
        </div>

        {/* City and State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-base font-medium text-gray-800 mb-2">
              City
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base appearance-none bg-white cursor-pointer text-gray-400"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5rem',
                color: formData.city ? '#1f2937' : '#9ca3af'
              }}
            >
              <option value="" disabled>City</option>
              {cities.map((city) => (
                <option key={city} value={city} className="text-gray-900">
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-base font-medium text-gray-800 mb-2">
              State
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base appearance-none bg-white cursor-pointer text-gray-400"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5rem',
                color: formData.state ? '#1f2937' : '#9ca3af'
              }}
            >
              <option value="" disabled>State</option>
              {states.map((state) => (
                <option key={state} value={state} className="text-gray-900">
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleCancel}
          className="flex-1 px-8 py-4 bg-orange-50 text-orange-500 rounded-full font-medium hover:bg-orange-100 transition-colors text-base"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors text-base"
        >
          Save
        </button>
      </div>
    </div>
  );
}