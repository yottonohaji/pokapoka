import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { EventCalendarScreen } from './components/EventCalendarScreen';
import { StampScreen } from './components/StampScreen';
import { RewardScreen } from './components/RewardScreen';
import { MyPageScreen } from './components/MyPageScreen';
import { StaffAdminScreen } from './components/StaffAdminScreen';
import { RegistrationModal } from './components/RegistrationModal';
import { EventDetailModal } from './components/EventDetailModal';

const MainContent: React.FC = () => {
  const { activeTab, isStaffMode } = useApp();

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-4 pb-20 md:pb-10">
        {isStaffMode ? (
          <StaffAdminScreen />
        ) : (
          <>
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'events' && <EventCalendarScreen />}
            {activeTab === 'stamp' && <StampScreen />}
            {activeTab === 'rewards' && <RewardScreen />}
            {activeTab === 'mypage' && <MyPageScreen />}
          </>
        )}
      </main>

      <BottomNav />
      <RegistrationModal />
      <EventDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
