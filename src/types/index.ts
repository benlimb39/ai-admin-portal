export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  totalReferrals: number;
  totalRewards: number;
}

export interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  referredId: string;
  referredName: string;
  referredEmail: string;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  reward: number;
}

export interface Reward {
  id: string;
  userId: string;
  userName: string;
  type: 'referral' | 'bonus' | 'promotion';
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  date: string;
  description: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalReferrals: number;
  totalRewards: number;
  monthlyGrowth: number;
  conversionRate: number;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}

export interface MonthlyData {
  month: string;
  users: number;
  referrals: number;
  rewards: number;
}
