'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PersonalDetailsProps {
  initialData?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    photoUrl: string;
  };
  onSave?: (data: PersonalDetailsFormData) => void;
  onCancel?: () => void;
}

interface PersonalDetailsFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  photoUrl: string;
}

export default function PersonalDetails({
  initialData = {
    firstName: 'Opeyemi',
    lastName: 'Ayeola',
    phoneNumber: '',
    gender: 'Female',
    photoUrl: '/profile-photo.jpg'
  },
  onSave,
  onCancel
}: PersonalDetailsProps) {
  const [formData, setFormData] = useState<PersonalDetailsFormData>(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpdate = () => {
    // Implement photo upload logic here
    console.log('Update photo clicked');
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
    <div className="w-full mx-auto p-8 bg-gray-50 text-black">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Personal details</h1>
      
      {/* Profile Photo */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={formData.photoUrl}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <button
          onClick={handlePhotoUpdate}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
        >
          <svg
            className="w-5 h-5"
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
          Update photo
        </button>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-base font-medium text-gray-800 mb-2">
            First name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-base font-medium text-gray-800 mb-2">
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-base font-medium text-gray-800 mb-2">
            Phone number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-base font-medium text-gray-800 mb-2">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base appearance-none bg-white cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5rem'
            }}
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
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