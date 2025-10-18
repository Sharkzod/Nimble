import React, { useState } from 'react';
import Button from './ui/Button';

const DeleteAccount: React.FC = () => {
  const [confirmText, setConfirmText] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText === 'DELETE' && isConfirmed) {
      console.log('Account deletion confirmed');
      // Handle account deletion logic here
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Delete account</h2>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-red-800 mb-2">Warning</h3>
        <p className="text-red-700">
          Deleting your account is permanent and cannot be undone. All your data will be
          permanently removed from our systems.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To confirm, please type <span className="font-mono font-bold">DELETE</span> below:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full placeholder-gray-500 text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Type DELETE to confirm"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="confirm-delete"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="confirm-delete" className="ml-2 block text-sm text-gray-900">
            I understand that this action cannot be undone
          </label>
        </div>

        <Button
          type="submit"
          variant="danger"
          disabled={confirmText !== 'DELETE' || !isConfirmed}
        >
          Delete Account Permanently
        </Button>
      </form>
    </div>
  );
};

export default DeleteAccount;