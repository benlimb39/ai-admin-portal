import { User, Referral, Reward, DashboardMetrics, ChartData, MonthlyData } from '../types';

export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'active',
    joinDate: '2024-01-15',
    totalReferrals: 12,
    totalRewards: 450
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'active',
    joinDate: '2024-02-20',
    totalReferrals: 8,
    totalRewards: 320
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'pending',
    joinDate: '2024-03-10',
    totalReferrals: 5,
    totalRewards: 180
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
    status: 'active',
    joinDate: '2024-01-05',
    totalReferrals: 15,
    totalRewards: 600
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'inactive',
    joinDate: '2024-02-15',
    totalReferrals: 3,
    totalRewards: 120
  }
];

export const sampleReferrals: Referral[] = [
  {
    id: '1',
    referrerId: '1',
    referrerName: 'John Doe',
    referredId: '6',
    referredName: 'Alice Cooper',
    referredEmail: 'alice@example.com',
    status: 'completed',
    date: '2024-03-15',
    reward: 50
  },
  {
    id: '2',
    referrerId: '2',
    referrerName: 'Jane Smith',
    referredId: '7',
    referredName: 'Bob Wilson',
    referredEmail: 'bob@example.com',
    status: 'pending',
    date: '2024-03-20',
    reward: 50
  },
  {
    id: '3',
    referrerId: '1',
    referrerName: 'John Doe',
    referredId: '8',
    referredName: 'Carol Davis',
    referredEmail: 'carol@example.com',
    status: 'completed',
    date: '2024-03-18',
    reward: 50
  },
  {
    id: '4',
    referrerId: '4',
    referrerName: 'Sarah Wilson',
    referredId: '9',
    referredName: 'Eve Johnson',
    referredEmail: 'eve@example.com',
    status: 'cancelled',
    date: '2024-03-22',
    reward: 0
  },
  {
    id: '5',
    referrerId: '2',
    referrerName: 'Jane Smith',
    referredId: '10',
    referredName: 'Frank Miller',
    referredEmail: 'frank@example.com',
    status: 'completed',
    date: '2024-03-25',
    reward: 50
  }
];

export const sampleRewards: Reward[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    type: 'referral',
    amount: 50,
    status: 'paid',
    date: '2024-03-15',
    description: 'Referral bonus for Alice Cooper'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    type: 'referral',
    amount: 50,
    status: 'pending',
    date: '2024-03-20',
    description: 'Referral bonus for Bob Wilson'
  },
  {
    id: '3',
    userId: '1',
    userName: 'John Doe',
    type: 'bonus',
    amount: 25,
    status: 'paid',
    date: '2024-03-18',
    description: 'Monthly activity bonus'
  },
  {
    id: '4',
    userId: '4',
    userName: 'Sarah Wilson',
    type: 'promotion',
    amount: 100,
    status: 'paid',
    date: '2024-03-22',
    description: 'Promotional campaign reward'
  },
  {
    id: '5',
    userId: '2',
    userName: 'Jane Smith',
    type: 'referral',
    amount: 50,
    status: 'paid',
    date: '2024-03-25',
    description: 'Referral bonus for Frank Miller'
  }
];

export const dashboardMetrics: DashboardMetrics = {
  totalUsers: 1250,
  activeUsers: 890,
  totalReferrals: 456,
  totalRewards: 280,
  monthlyGrowth: 15.5,
  referralGrowth: 75.0
};

export const monthlyData: MonthlyData[] = [
  { month: 'Jan', users: 120, referrals: 45, rewards: 280 },
  { month: 'Feb', users: 180, referrals: 52, rewards: 320 },
  { month: 'Mar', users: 220, referrals: 78, rewards: 450 },
  { month: 'Apr', users: 280, referrals: 95, rewards: 520 },
  { month: 'May', users: 320, referrals: 120, rewards: 680 },
  { month: 'Jun', users: 380, referrals: 145, rewards: 820 }
];

export const rewardDistribution: ChartData[] = [
  { name: 'Referral', value: 65, color: '#6366f1' },
  { name: 'Bonus', value: 20, color: '#10b981' },
  { name: 'Promotion', value: 15, color: '#f59e0b' }
];

export const topReferrers: ChartData[] = [
  { name: 'John Doe', value: 12, color: '#6366f1' },
  { name: 'Sarah Wilson', value: 10, color: '#10b981' },
  { name: 'Jane Smith', value: 8, color: '#f59e0b' },
  { name: 'Mike Johnson', value: 6, color: '#ef4444' },
  { name: 'David Brown', value: 4, color: '#8b5cf6' }
];
