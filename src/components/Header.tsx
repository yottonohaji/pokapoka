import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import { Sparkles, ShieldCheck, ArrowLeft } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, isStaffMode, setIsStaffMode, userProfile } = useApp();

  const navTabs: { id: ActiveTab; label: string }[] = [
    { id: 'home', label: 'ホーム' },
    { id: 'events', label: 'イベント' },
    { id: 'stamp', label: 'スタンプ' },
    { id: 'rewards', label: 'ごほうび' },
    { id: 'mypage', label: 'マイページ' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-100/80 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Wordmark */}
        <div className="flex items-center gap-2">
          {isStaffMode ? (
            <button
              onClick={() => setIsStaffMode(false)}
              className="flex items-center gap-1.5 text-sm font-semibold text-amber-900 hover:text-amber-700 min-h-[44px] -ml-2 px-2"
              aria-label="利用者画面に戻る"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ぽかぽか広場（管理）</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('home')}
              className="text-lg sm:text-xl font-extrabold tracking-tight text-amber-900 flex items-center gap-1.5 focus:outline-none"
            >
              <span className="text-orange-500 font-black">●</span>
              <span>ぽかぽか広場</span>
            </button>
          )}
        </div>

        {/* Zone 2: Navigation Links (Desktop/Tablet) */}
        {!isStaffMode && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`transition-colors relative py-1 hover:text-orange-600 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-orange-600 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 after:rounded-full'
                    : ''
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}

        {/* Zone 3: Primary Action (Staff Toggle & Quick Point Badge) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isStaffMode && (
            <button
              onClick={() => setActiveTab('rewards')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/70 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors tabular-nums min-h-[36px]"
              title="保有ポイント"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{userProfile.points}</span>
              <span className="text-[10px] text-amber-700">pt</span>
            </button>
          )}

          <button
            onClick={() => setIsStaffMode(!isStaffMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[44px] ${
              isStaffMode
                ? 'bg-stone-800 text-white hover:bg-stone-900'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isStaffMode ? '通常画面へ' : 'スタッフ専用'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
