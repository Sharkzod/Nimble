// app/components/settingsComponents/NotificationSettings.tsx
'use client';

import { useState } from 'react';
import SettingsComponentFactory from './SettingsComponentFactory';

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
  onSave?: (settings: NotificationSettings) => void;
  onCancel?: () => void;
  settingsRoute?: string;
  showFullLayout?: boolean;
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
  onSave,
  onCancel,
  settingsRoute = '/settings',
  showFullLayout = false
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
  };

  const handleSave = () => {
    if (onSave) {
      onSave(settings);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
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
    <SettingsComponentFactory
      title="Notification settings"
      settingsRoute={settingsRoute}
      showFullLayout={showFullLayout}
      onSave={handleSave}
      onCancel={handleCancel}
      showActionButtons={false}
    >
      <div className="flex flex-col min-h-screen">
        {/* Main Content */}
        <div className="flex-1 px-6 py-6">
          <div className="space-y-8">
            {/* Email Notifications */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Email notifications</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Messages</span>
                  
                  <Toggle
                    isOn={settings.email.messages}
                    onToggle={() => handleToggle('email', 'messages')}
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Offers</span>
                  <Toggle
                    isOn={settings.email.offers}
                    onToggle={() => handleToggle('email', 'offers')}
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Payment approval</span>
                  <Toggle
                    isOn={settings.email.paymentApproval}
                    onToggle={() => handleToggle('email', 'paymentApproval')}
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Newsletter</span>
                  <Toggle
                    isOn={settings.email.newsletter}
                    onToggle={() => handleToggle('email', 'newsletter')}
                  />
                </div>
              </div>
            </div>

            {/* In-app Notifications */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-4">In-app notifications</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Messages</span>
                  <Toggle
                    isOn={settings.inApp.messages}
                    onToggle={() => handleToggle('inApp', 'messages')}
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Offers</span>
                  <Toggle
                    isOn={settings.inApp.offers}
                    onToggle={() => handleToggle('inApp', 'offers')}
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Payment approval</span>
                  <Toggle
                    isOn={settings.inApp.paymentApproval}
                    onToggle={() => handleToggle('inApp', 'paymentApproval')}
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">Newsletter</span>
                  <Toggle
                    isOn={settings.inApp.newsletter}
                    onToggle={() => handleToggle('inApp', 'newsletter')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsComponentFactory>
  );
}