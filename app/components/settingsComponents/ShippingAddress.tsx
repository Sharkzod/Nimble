'use client';

import { useState } from 'react';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  zipcode: string;
  city: string;
  state: string;
  isDefault: boolean;
}

interface ShippingAddressProps {
  initialAddresses?: Address[];
  onAddNew?: () => void;
  onSetDefault?: (addressId: string) => void;
  onSaveAddress?: (address: Address) => void;
  cities?: string[];
  states?: string[];
}

export default function ShippingAddress({
  initialAddresses = [
    {
      id: '1',
      name: 'John Apaokagi',
      phone: '+234-687-5878-57',
      address: '177, Aggrey Road,Ibadan, Oyo state.',
      zipcode: '',
      city: 'Nsukka',
      state: 'Enugu',
      isDefault: true
    },
    {
      id: '2',
      name: 'John Apaokagi',
      phone: '+234-687-5878-57',
      address: '177, Aggrey Road,Ibadan, Oyo state.',
      zipcode: '',
      city: 'Nsukka',
      state: 'Enugu',
      isDefault: false
    }
  ],
  onAddNew,
  onSetDefault,
  onSaveAddress,
  cities = ['Nsukka', 'Enugu', 'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan'],
  states = ['Enugu', 'Lagos', 'FCT', 'Rivers', 'Oyo', 'Kano']
}: ShippingAddressProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    name: '',
    phone: '',
    address: '',
    zipcode: '',
    city: '',
    state: '',
    isDefault: false
  });

  const handleEdit = (addressId: string) => {
    const address = addresses.find(addr => addr.id === addressId);
    if (address) {
      setEditingAddress(address);
      setFormData({
        name: address.name,
        phone: address.phone,
        address: address.address,
        zipcode: address.zipcode,
        city: address.city,
        state: address.state,
        isDefault: address.isDefault
      });
      setIsModalOpen(true);
    }
  };

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew();
    }
  };

  const handleSetDefault = (addressId: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    setAddresses(updatedAddresses);
    if (onSetDefault) {
      onSetDefault(addressId);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    if (editingAddress) {
      const updatedAddress = {
        ...editingAddress,
        ...formData
      };
      
      const updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id ? updatedAddress : addr
      );
      
      setAddresses(updatedAddresses);
      
      if (onSaveAddress) {
        onSaveAddress(updatedAddress);
      }
    }
    
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto p-8 bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Shipping address</h1>

        <div className="space-y-4 mb-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              {address.isDefault && (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded mb-3">
                  Default Address
                </span>
              )}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    {address.name}
                  </h3>
                  <p className="text-base text-gray-700 mb-1">
                    {address.phone}
                  </p>
                  <p className="text-base text-gray-700">
                    {address.address}
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(address.id)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium ml-4"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
              </div>
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-pink-50 text-red-500 rounded-lg font-medium hover:bg-pink-100 transition-colors"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add new delivery address
          </button>
        </div>
      </div>

      {/* Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative">
            {/* Close Button */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 w-8 h-8 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-2">
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-800 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Zipcode */}
              <div>
                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-800 mb-2">
                  Zipcode
                </label>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-800 mb-2">
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5rem'
                  }}
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-800 mb-2">
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5rem'
                  }}
                >
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Save as Default Checkbox */}
            <div className="mb-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Save address as default</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-8 py-4 bg-orange-50 text-orange-500 rounded-full font-medium hover:bg-orange-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}