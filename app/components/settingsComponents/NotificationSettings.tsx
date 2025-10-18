'use client';

import { useState } from 'react';

interface NotificationSettings {
  email: {
    messages: boolean;
    offers: boolean;
    paymentApproval: boolean;
    newsletter: boolean;
  };
  inApp: {
    messages: boolean;
    offers: boolean;
    paymentApproval: boolean;
    newsletter: boolean;
  };
}

interface NotificationSettingsProps {
  initialSettings?: NotificationSettings;
  onChange?: (settings: NotificationSettings) => void;
}

export default function NotificationSettings({
  initialSettings = {
    email: {
      messages: true,
      offers: true,
      paymentApproval: true,
      newsletter: true
    },
    inApp: {
      messages: true,
      offers: true,
      paymentApproval: true,
      newsletter: true
    }
  },
  onChange
}: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings>(initialSettings);

  const handleToggle = (category: 'email' | 'inApp', setting: keyof NotificationSettings['email']) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: !settings[category][setting]
      }
    };
    setSettings(newSettings);
    if (onChange) {
      onChange(newSettings);
    }
  };

  const Toggle = ({ 
    isOn, 
    onToggle 
  }: { 
    isOn: boolean; 
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isOn ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          isOn ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Notification settings</h1>

      {/* Email Notifications */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Email notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-base text-gray-700">Messages</span>
            <Toggle
              isOn={settings.email.messages}
              onToggle={() => handleToggle('email', 'messages')}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-base text-gray-700">Offers</span>
            <Toggle
              isOn={settings.email.offers}
              onToggle={() => handleToggle('email', 'offers')}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-base text-gray-700">Payment approval</span>
            <Toggle
              isOn={settings.email.paymentApproval}
              onToggle={() => handleToggle('email', 'paymentApproval')}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-base text-gray-700">Newsletter</span>
            <Toggle
              isOn={settings.email.newsletter}
              onToggle={() => handleToggle('email', 'newsletter')}
            />
          </div>
        </div>
      </div>

      {/* In-app Notifications */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-4">In-app notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-base text-gray-700">Messages</span>
            <Toggle
              isOn={settings.inApp.messages}
              onToggle={() => handleToggle('inApp', 'messages')}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-base text-gray-700">Offers</span>
            <Toggle
              isOn={settings.inApp.offers}
              onToggle={() => handleToggle('inApp', 'offers')}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-base text-gray-700">Payment approval</span>
            <Toggle
              isOn={settings.inApp.paymentApproval}
              onToggle={() => handleToggle('inApp', 'paymentApproval')}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-base text-gray-700">Newsletter</span>
            <Toggle
              isOn={settings.inApp.newsletter}
              onToggle={() => handleToggle('inApp', 'newsletter')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}