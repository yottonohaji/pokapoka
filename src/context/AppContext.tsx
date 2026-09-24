import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CongestionLevel,
  StaffMember,
  CommunityEvent,
  RewardItem,
  UserProfile,
  RedeemedTicket,
  ActiveTab,
} from '../types';
import { INITIAL_STAFF_MEMBERS, INITIAL_EVENTS, INITIAL_REWARDS } from '../mockData';
import { sound } from '../utils/audio';

interface AppContextType {
  congestionLevel: CongestionLevel;
  congestionUpdatedAt: string;
  setCongestionLevel: (level: CongestionLevel) => void;

  staffMembers: StaffMember[];
  toggleStaffPresence: (id: string) => void;

  events: CommunityEvent[];
  rewards: RewardItem[];

  userProfile: UserProfile;
  registerUser: (data: { parentName: string; phone: string; childName: string; childAge: string }) => void;
  addStamp: (locationName?: string) => { success: boolean; bonus: boolean; newPoints: number };
  redeemReward: (rewardId: string) => { success: boolean; message?: string; ticket?: RedeemedTicket };
  markTicketUsed: (ticketId: string) => void;
  toggleBookmark: (eventId: string) => void;
  resetSampleData: () => void;

  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  isStaffMode: boolean;
  setIsStaffMode: (val: boolean) => void;

  showRegistrationModal: boolean;
  setShowRegistrationModal: (val: boolean) => void;

  selectedEvent: CommunityEvent | null;
  setSelectedEvent: (ev: CommunityEvent | null) => void;

  selectedReward: RewardItem | null;
  setSelectedReward: (reward: RewardItem | null) => void;

  activeTicketForViewing: RedeemedTicket | null;
  setActiveTicketForViewing: (ticket: RedeemedTicket | null) => void;
}

const LOCAL_STORAGE_KEY = 'pokapoka_app_data_v1';

const DEFAULT_USER_PROFILE: UserProfile = {
  isRegistered: false, // Starts as guest per requirement
  parentName: 'ゲスト保護者',
  phone: '',
  childName: 'ゆうと',
  childAge: '2歳3ヶ月',
  points: 40,
  stampCount: 4,
  stampHistory: [
    {
      id: 'stamp-init-1',
      locationName: 'ぽかぽか広場 入口チェックイン',
      timestamp: '2026-09-20 10:45',
      pointsEarned: 10,
    },
    {
      id: 'stamp-init-2',
      locationName: '大型えほん読み聞かせ会',
      timestamp: '2026-09-21 11:30',
      pointsEarned: 10,
    },
    {
      id: 'stamp-init-3',
      locationName: 'ぽかぽか広場 入口チェックイン',
      timestamp: '2026-09-22 14:15',
      pointsEarned: 10,
    },
    {
      id: 'stamp-init-4',
      locationName: '木のおもちゃあそび広場',
      timestamp: '2026-09-23 15:00',
      pointsEarned: 10,
    },
  ],
  tickets: [],
  bookmarkedEventIds: ['event-1'],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [congestionLevel, setCongestionLevelState] = useState<CongestionLevel>('open');
  const [congestionUpdatedAt, setCongestionUpdatedAt] = useState<string>('たった今');
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF_MEMBERS);
  const [events] = useState<CommunityEvent[]>(INITIAL_EVENTS);
  const [rewards] = useState<RewardItem[]>(INITIAL_REWARDS);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isStaffMode, setIsStaffMode] = useState<boolean>(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [activeTicketForViewing, setActiveTicketForViewing] = useState<RedeemedTicket | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.congestionLevel) setCongestionLevelState(parsed.congestionLevel);
        if (parsed.congestionUpdatedAt) setCongestionUpdatedAt(parsed.congestionUpdatedAt);
        if (parsed.staffMembers) setStaffMembers(parsed.staffMembers);
        if (parsed.userProfile) setUserProfile(parsed.userProfile);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage when critical state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          congestionLevel,
          congestionUpdatedAt,
          staffMembers,
          userProfile,
        })
      );
    } catch {
      // ignore
    }
  }, [congestionLevel, congestionUpdatedAt, staffMembers, userProfile]);

  const setCongestionLevel = (level: CongestionLevel) => {
    sound.playTap();
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 更新`;
    setCongestionLevelState(level);
    setCongestionUpdatedAt(timeString);
  };

  const toggleStaffPresence = (id: string) => {
    sound.playTap();
    setStaffMembers((prev) =>
      prev.map((staff) => (staff.id === id ? { ...staff, isPresentToday: !staff.isPresentToday } : staff))
    );
  };

  const registerUser = (data: { parentName: string; phone: string; childName: string; childAge: string }) => {
    sound.playCelebration();
    setUserProfile((prev) => ({
      ...prev,
      isRegistered: true,
      parentName: data.parentName || '保護者さま',
      phone: data.phone,
      childName: data.childName || 'お子さま',
      childAge: data.childAge || '2歳',
      points: prev.points + 20, // Registration welcome bonus!
    }));
    setShowRegistrationModal(false);
  };

  const addStamp = (locationName = 'ぽかぽか広場 受付チェックイン') => {
    sound.playStampPop();
    const newStampCount = (userProfile.stampCount % 10) + 1;
    const isBonus = newStampCount === 10;
    const pointsToAdd = isBonus ? 40 : 10; // +10pt normally, +40pt on card completion!

    if (isBonus) {
      setTimeout(() => sound.playCelebration(), 300);
    }

    const now = new Date();
    const stampRecord = {
      id: `stamp-${Date.now()}`,
      locationName,
      timestamp: `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      pointsEarned: pointsToAdd,
    };

    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + pointsToAdd,
      stampCount: newStampCount,
      stampHistory: [stampRecord, ...prev.stampHistory],
    }));

    return {
      success: true,
      bonus: isBonus,
      newPoints: userProfile.points + pointsToAdd,
    };
  };

  const redeemReward = (rewardId: string) => {
    const item = rewards.find((r) => r.id === rewardId);
    if (!item) return { success: false, message: '商品が見つかりません' };

    if (userProfile.points < item.requiredPoints) {
      return { success: false, message: 'ポイントが不足しています' };
    }

    sound.playCelebration();

    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newTicket: RedeemedTicket = {
      id: `ticket-${Date.now()}`,
      rewardId: item.id,
      rewardTitle: item.title,
      pointsSpent: item.requiredPoints,
      ticketCode: randomCode,
      redeemedAt: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      isUsed: false,
    };

    setUserProfile((prev) => ({
      ...prev,
      points: prev.points - item.requiredPoints,
      tickets: [newTicket, ...prev.tickets],
    }));

    return {
      success: true,
      ticket: newTicket,
    };
  };

  const markTicketUsed = (ticketId: string) => {
    sound.playTap();
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setUserProfile((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) => (t.id === ticketId ? { ...t, isUsed: true, usedAt: timeStr } : t)),
    }));
  };

  const toggleBookmark = (eventId: string) => {
    sound.playTap();
    setUserProfile((prev) => {
      const exists = prev.bookmarkedEventIds.includes(eventId);
      return {
        ...prev,
        bookmarkedEventIds: exists
          ? prev.bookmarkedEventIds.filter((id) => id !== eventId)
          : [...prev.bookmarkedEventIds, eventId],
      };
    });
  };

  const resetSampleData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setCongestionLevelState('open');
    setCongestionUpdatedAt('たった今');
    setStaffMembers(INITIAL_STAFF_MEMBERS);
    setUserProfile(DEFAULT_USER_PROFILE);
    sound.playTap();
  };

  return (
    <AppContext.Provider
      value={{
        congestionLevel,
        congestionUpdatedAt,
        setCongestionLevel,
        staffMembers,
        toggleStaffPresence,
        events,
        rewards,
        userProfile,
        registerUser,
        addStamp,
        redeemReward,
        markTicketUsed,
        toggleBookmark,
        resetSampleData,
        activeTab,
        setActiveTab,
        isStaffMode,
        setIsStaffMode,
        showRegistrationModal,
        setShowRegistrationModal,
        selectedEvent,
        setSelectedEvent,
        selectedReward,
        setSelectedReward,
        activeTicketForViewing,
        setActiveTicketForViewing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
