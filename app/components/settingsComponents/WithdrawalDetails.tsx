'use client';

import { useState } from 'react';

// Types
interface WithdrawalOption {
  id: string;
  name: string;
  accountNumber: string;
  provider: string;
  isDefault: boolean;
}

// Withdrawal Details Component
export default function WithdrawalDetails() {
  const [options, setOptions] = useState<WithdrawalOption[]>([
    {
      id: '1',
      name: 'John Apaokagi',
      accountNumber: '81687587857',
      provider: 'Opay',
      isDefault: true
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Apaokagi',
    accountNumber: '',
    provider: '',
    isDefault: false
  });

  const banks = ['Opay', 'GTBank', 'Access Bank', 'First Bank', 'UBA', 'Zenith Bank', 'Kuda', 'Palmpay'];

  const handleAddNew = () => {
    setFormData({
      name: 'John Apaokagi',
      accountNumber: '',
      provider: '',
      isDefault: false
    });
    setIsModalOpen(true);
  };

  const handleSetDefault = (optionId: string) => {
    const updatedOptions = options.map(opt => ({
      ...opt,
      isDefault: opt.id === optionId
    }));
    setOptions(updatedOptions);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const newOption: WithdrawalOption = {
      id: Date.now().toString(),
      ...formData
    };

    setOptions(prev => [...prev, newOption]);
    setIsModalOpen(false);
    setFormData({
      name: 'John Apaokagi',
      accountNumber: '',
      provider: '',
      isDefault: false
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto p-8 bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Withdrawal details</h1>

        <div className="space-y-4 mb-6">
          {options.map((option) => (
            <div
              key={option.id}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    {option.name}
                  </h3>
                  <p className="text-base text-gray-700">
                    {option.accountNumber} · {option.provider}
                  </p>
                </div>
                {option.isDefault && (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded">
                    Default
                  </span>
                )}
              </div>
              {!option.isDefault && (
                <button
                  onClick={() => handleSetDefault(option.id)}
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
            Add new option
          </button>
        </div>
      </div>

      {/* Add Withdrawal Option Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-lg">
            {/* Close Button */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 w-8 h-8 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Withdrawal option</h2>

            <div className="space-y-6 mb-8">
              {/* Bank Name */}
              <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-800 mb-2">
                  Bank name
                </label>
                <select
                  id="provider"
                  name="provider"
                  value={formData.provider}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer text-gray-400"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5rem',
                    color: formData.provider ? '#1f2937' : '#9ca3af'
                  }}
                >
                  <option value="" disabled>Choose category</option>
                  {banks.map((bank) => (
                    <option key={bank} value={bank} className="text-gray-900">
                      {bank}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Number */}
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-800 mb-2">
                  Account number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSave}
                disabled={!formData.provider || !formData.accountNumber}
                className="w-64 px-8 py-4 bg-blue-400 text-white rounded-full font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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