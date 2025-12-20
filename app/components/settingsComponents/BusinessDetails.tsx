// app/components/settingsComponents/BusinessDetails.tsx
'use client';

import { useState } from 'react';
import SettingsComponentFactory from './SettingsComponentFactory';

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
  settingsRoute?: string;
  showFullLayout?: boolean;
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
  onCancel,
  settingsRoute = '/settings',
  showFullLayout = false
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
    <SettingsComponentFactory
      title="Business Details"
      settingsRoute={settingsRoute}
      showFullLayout={showFullLayout}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <div className="flex flex-col">
        {/* Main Content */}
        <div className="flex-1 px-6 py-6">
          <div className="space-y-6">
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-900 mb-2">
                Business name
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white"
              />
            </div>

            {/* About */}
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-900 mb-2">
                About
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="This will be displayed on your profile"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base placeholder:text-gray-400 resize-none bg-white"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white"
              />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-900 mb-2">
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base appearance-none bg-white cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.25rem',
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
                <label htmlFor="state" className="block text-sm font-medium text-gray-900 mb-2">
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base appearance-none bg-white cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.25rem',
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
        </div>

        {/* Action Buttons - Fixed at bottom */}
       
          <div className="px-6 bg-white border-t border-gray-100 mt-[40px]">
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
            className="flex-1 px-6 py-2 bg-[#FE7A3633] cursor-pointer text-[#FE7A36] rounded-full font-medium text-base transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-2 bg-[#3652AD] text-white rounded-full font-medium text-base transition-colors"
            >
              Save
            </button>
          </div>
        </div>
        </div>
      
    </SettingsComponentFactory>
  );
}