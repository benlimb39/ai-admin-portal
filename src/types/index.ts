export interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  totalReferrals: number;
  totalRewards: number;
  avatar?: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  referredId: string;
  referredName: string;
  referredEmail: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  reward: number;
}

export interface Reward {
  id: string;
  userId: string;
  userName: string;
  type: 'referral' | 'bonus' | 'promotion';
  amount: number;
  date: string;
  status: 'pending' | 'paid' | 'cancelled';
  description?: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalReferrals: number;
  totalRewards: number;
  referralGrowth: number;
  averageReward: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface MonthlyData {
  month: string;
  users: number;
  referrals: number;
  rewards: number;
}

export type ThemeMode = 'light' | 'dark' | 'darkGrey';

export interface ThemeSettings {
  mode: ThemeMode;
  primaryColor: string;
  accentColor: string;
}

export interface UserSettings {
  theme: {
    mode: ThemeMode;
    primaryColor: string;
    accentColor: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  display: {
    compact: boolean;
    showAvatars: boolean;
    autoRefresh: boolean;
  };
  language: string;
  timezone: string;
}
