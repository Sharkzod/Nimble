// app/components/settingsComponents/ShippingAddress.tsx
'use client';

import { useState } from 'react';
import SettingsComponentFactory from './SettingsComponentFactory';

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
  onSave?: (addresses: Address[]) => void;
  onCancel?: () => void;
  settingsRoute?: string;
  showFullLayout?: boolean;
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
  onSave,
  onCancel,
  settingsRoute = '/settings',
  showFullLayout = false,
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
    setEditingAddress(null);
    setFormData({
      name: '',
      phone: '',
      address: '',
      zipcode: '',
      city: '',
      state: '',
      isDefault: false
    });
    setIsModalOpen(true);
  };

  const handleSetDefault = (addressId: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    setAddresses(updatedAddresses);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveAddress = () => {
    let updatedAddresses;
    
    if (editingAddress) {
      // Update existing address
      updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id ? { ...editingAddress, ...formData } : addr
      );
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData
      };
      updatedAddresses = [...addresses, newAddress];
    }
    
    setAddresses(updatedAddresses);
    
    if (formData.isDefault) {
      // Set as default if checked
      const finalAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === (editingAddress?.id || Date.now().toString())
      }));
      setAddresses(finalAddresses);
    }
    
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleSaveAll = () => {
    if (onSave) {
      onSave(addresses);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      <SettingsComponentFactory
        title="Delivery address"
        settingsRoute={settingsRoute}
        showFullLayout={showFullLayout}
        onSave={handleSaveAll}
        onCancel={handleCancel}
        showActionButtons={false}
      >
        <div className="flex flex-col min-h-screen">
          {/* Main Content */}
          <div className="flex-1 py-6">
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-white rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    {/* Radio Button */}
                    <div className="pt-1">
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor: address.isDefault ? '#ff6b35' : '#d1d5db',
                          backgroundColor: 'white'
                        }}
                      >
                        {address.isDefault && (
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        )}
                      </button>
                    </div>

                    {/* Address Content */}
                    <div className="flex-1">
                      {address.isDefault && (
                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded mb-2">
                          Default Address
                        </span>
                      )}
                      <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                        {address.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-0.5">
                        {address.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.address}
                      </p>
                    </div>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(address.id)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleAddNew}
                className="w-[80%] inline-flex items-center justify-center gap-2 px-6 py-3 bg-pink-50 text-red-500 rounded-lg font-medium hover:bg-pink-100 transition-colors"
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
        </div>
      </SettingsComponentFactory>

      {/* Edit/Add Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>

              {/* Zipcode */}
              <div>
                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-900 mb-2">
                  Zipcode
                </label>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.25rem'
                  }}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.25rem'
                  }}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Save as Default Checkbox */}
            <div className="mb-6">
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

            {/* Modal Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 bg-orange-50 text-orange-500 rounded-full font-medium hover:bg-orange-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 