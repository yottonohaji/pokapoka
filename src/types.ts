export type CongestionLevel = 'open' | 'moderate' | 'crowded';

export interface StaffMember {
  id: string;
  name: string;
  nickname: string;
  role: string;
  avatarUrl: string;
  comment: string;
  specialty: string;
  isPresentToday: boolean;
  presentStartTime?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  targetAge: string;
  fee: string;
  capacity: number;
  currentBookings: number;
  description: string;
  imageUrl?: string;
  isFeatured?: boolean;
  tags: string[];
}

export interface RewardItem {
  id: string;
  title: string;
  requiredPoints: number;
  description: string;
  category: 'snack' | 'gacha' | 'play' | 'gift';
  iconName: string;
  badge: string;
}

export interface RedeemedTicket {
  id: string;
  rewardId: string;
  rewardTitle: string;
  pointsSpent: number;
  ticketCode: string;
  redeemedAt: string;
  isUsed: boolean;
  usedAt?: string;
}

export interface StampRecord {
  id: string;
  locationName: string;
  timestamp: string;
  pointsEarned: number;
}

export interface UserProfile {
  isRegistered: boolean;
  parentName: string;
  phone: string;
  childName: string;
  childAge: string;
  points: number;
  stampCount: number;
  stampHistory: StampRecord[];
  tickets: RedeemedTicket[];
  bookmarkedEventIds: string[];
}

export type ActiveTab = 'home' | 'events' | 'stamp' | 'rewards' | 'mypage';
