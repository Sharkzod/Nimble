// app/components/settingsComponents/PersonalDetails.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import SettingsComponentFactory from './SettingsComponentFactory';

interface PersonalDetailsProps {
  initialData?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    photoUrl: string | null;
  };
  onSave?: (data: PersonalDetailsFormData) => void;
  onCancel?: () => void;
  settingsRoute?: string;
  showFullLayout?: boolean;
}

interface PersonalDetailsFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  photoUrl: string | null;
}

export default function PersonalDetails({
  initialData = {
    firstName: 'Opeyemi',
    lastName: 'Ayeola',
    phoneNumber: '',
    gender: 'Female',
    photoUrl: null  // Changed to null for default
  },
  onSave,
  onCancel,
  settingsRoute = '/settings',
  showFullLayout = false
}: PersonalDetailsProps) {
  const [formData, setFormData] = useState<PersonalDetailsFormData>(initialData);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpdate = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        setPhotoFile(file);
        
        // Create a local URL for preview
        const photoUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, photoUrl }));
      }
    };
    
    input.click();
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

  // Determine which image to display
  const displayImageUrl = formData.photoUrl || '/default-profile.jpg';

  return (
    <SettingsComponentFactory
      title="Personal Details"
      settingsRoute={settingsRoute}
      showFullLayout={showFullLayout}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <div className="flex flex-col min-h-screen">
        {/* Main Content */}
        <div className=" px-6 py-6">
          {/* Profile Photo - Centered */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3 bg-gray-200">
              {formData.photoUrl ? (
                <Image
                  src={formData.photoUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // If image fails to load, show default
                    const img = e.target as HTMLImageElement;
                    img.src = '/human.png';
                  }}
                />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src="/default-profile.jpg"
                    alt="Default Profile"
                    fill
                    className="object-cover"
                  />
                  {/* Optional: Add a user icon overlay on default image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handlePhotoUpdate}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              {formData.photoUrl ? 'Update photo' : 'Upload photo'}
            </button>
            {formData.photoUrl && (
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, photoUrl: null }));
                  setPhotoFile(null);
                }}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Remove photo
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-6 text-black">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                First name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full text-black placeholder-gray-500 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900 mb-2">
                Phone number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+234"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white"
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-900 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base appearance-none bg-white cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.25rem'
                }}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
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