import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import { Home, Calendar, QrCode, Gift, User } from 'lucide-react';
import { sound } from '../utils/audio';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, isStaffMode } = useApp();

  if (isStaffMode) return null;

  const tabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'events', label: 'イベント', icon: Calendar },
    { id: 'stamp', label: 'スタンプ', icon: QrCode },
    { id: 'rewards', label: 'ごほうび', icon: Gift },
    { id: 'mypage', label: 'マイページ', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-100 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] pb-safe">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isStampCenter = tab.id === 'stamp';

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playTap();
                setActiveTab(tab.id);
              }}
              className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-all relative"
              aria-label={tab.label}
            >
              {isStampCenter ? (
                <div
                  className={`-mt-5 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-orange-200'
                      : 'bg-white border-2 border-orange-400 text-orange-600'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              ) : (
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-orange-600 stroke-[2.5]' : 'text-stone-400'
                  }`}
                />
              )}
              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap ${
                  isActive ? 'text-orange-600 font-bold' : 'text-stone-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
