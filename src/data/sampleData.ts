import { User, Referral, Reward, DashboardMetrics, MonthlyData } from '../types';

export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'active',
    joinDate: '2024-01-15',
    totalReferrals: 12,
    totalRewards: 240
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'active',
    joinDate: '2024-02-03',
    totalReferrals: 8,
    totalRewards: 160
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'active',
    joinDate: '2024-01-28',
    totalReferrals: 15,
    totalRewards: 300
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
    status: 'inactive',
    joinDate: '2024-03-10',
    totalReferrals: 3,
    totalRewards: 60
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'active',
    joinDate: '2024-02-18',
    totalReferrals: 20,
    totalRewards: 400
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    avatar: 'https://i.pravatar.cc/150?img=6',
    status: 'pending',
    joinDate: '2024-04-05',
    totalReferrals: 0,
    totalRewards: 0
  },
  {
    id: '7',
    name: 'Robert Taylor',
    email: 'robert.taylor@example.com',
    avatar: 'https://i.pravatar.cc/150?img=7',
    status: 'active',
    joinDate: '2024-01-10',
    totalReferrals: 18,
    totalRewards: 360
  },
  {
    id: '8',
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@example.com',
    avatar: 'https://i.pravatar.cc/150?img=8',
    status: 'active',
    joinDate: '2024-03-22',
    totalReferrals: 6,
    totalRewards: 120
  }
];

export const sampleReferrals: Referral[] = [
  {
    id: '1',
    referrerId: '1',
    referrerName: 'John Smith',
    referredId: '9',
    referredName: 'Alex Thompson',
    referredEmail: 'alex.thompson@example.com',
    status: 'completed',
    date: '2024-04-01',
    reward: 20
  },
  {
    id: '2',
    referrerId: '1',
    referrerName: 'John Smith',
    referredId: '10',
    referredName: 'Maria Garcia',
    referredEmail: 'maria.garcia@example.com',
    status: 'pending',
    date: '2024-04-03',
    reward: 20
  },
  {
    id: '3',
    referrerId: '2',
    referrerName: 'Sarah Johnson',
    referredId: '11',
    referredName: 'James Lee',
    referredEmail: 'james.lee@example.com',
    status: 'completed',
    date: '2024-04-02',
    reward: 20
  },
  {
    id: '4',
    referrerId: '3',
    referrerName: 'Michael Brown',
    referredId: '12',
    referredName: 'Emma White',
    referredEmail: 'emma.white@example.com',
    status: 'completed',
    date: '2024-04-01',
    reward: 20
  },
  {
    id: '5',
    referrerId: '3',
    referrerName: 'Michael Brown',
    referredId: '13',
    referredName: 'Daniel Clark',
    referredEmail: 'daniel.clark@example.com',
    status: 'cancelled',
    date: '2024-04-04',
    reward: 0
  },
  {
    id: '6',
    referrerId: '5',
    referrerName: 'David Wilson',
    referredId: '14',
    referredName: 'Sophie Turner',
    referredEmail: 'sophie.turner@example.com',
    status: 'completed',
    date: '2024-04-05',
    reward: 20
  },
  {
    id: '7',
    referrerId: '7',
    referrerName: 'Robert Taylor',
    referredId: '15',
    referredName: 'Chris Evans',
    referredEmail: 'chris.evans@example.com',
    status: 'pending',
    date: '2024-04-06',
    reward: 20
  },
  {
    id: '8',
    referrerId: '1',
    referrerName: 'John Smith',
    referredId: '16',
    referredName: 'Rachel Green',
    referredEmail: 'rachel.green@example.com',
    status: 'completed',
    date: '2024-04-07',
    reward: 20
  }
];

export const sampleRewards: Reward[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Smith',
    type: 'referral',
    amount: 20,
    status: 'paid',
    date: '2024-04-01',
    description: 'Referral bonus for Alex Thompson'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah Johnson',
    type: 'referral',
    amount: 20,
    status: 'paid',
    date: '2024-04-02',
    description: 'Referral bonus for James Lee'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Michael Brown',
    type: 'referral',
    amount: 20,
    status: 'paid',
    date: '2024-04-01',
    description: 'Referral bonus for Emma White'
  },
  {
    id: '4',
    userId: '5',
    userName: 'David Wilson',
    type: 'referral',
    amount: 20,
    status: 'paid',
    date: '2024-04-05',
    description: 'Referral bonus for Sophie Turner'
  },
  {
    id: '5',
    userId: '1',
    userName: 'John Smith',
    type: 'referral',
    amount: 20,
    status: 'paid',
    date: '2024-04-07',
    description: 'Referral bonus for Rachel Green'
  },
  {
    id: '6',
    userId: '3',
    userName: 'Michael Brown',
    type: 'bonus',
    amount: 50,
    status: 'paid',
    date: '2024-04-08',
    description: 'Monthly performance bonus'
  },
  {
    id: '7',
    userId: '7',
    userName: 'Robert Taylor',
    type: 'promotion',
    amount: 100,
    status: 'pending',
    date: '2024-04-09',
    description: 'Spring promotion campaign'
  },
  {
    id: '8',
    userId: '2',
    userName: 'Sarah Johnson',
    type: 'bonus',
    amount: 30,
    status: 'paid',
    date: '2024-04-10',
    description: 'Early adopter bonus'
  }
];

export const dashboardMetrics: DashboardMetrics = {
  totalUsers: 8,
  activeUsers: 6,
  totalReferrals: 8,
  totalRewards: 280,
  monthlyGrowth: 15.5,
  conversionRate: 75.0
};

export const monthlyData: MonthlyData[] = [
  { month: 'Jan', users: 120, referrals: 45, rewards: 900 },
  { month: 'Feb', users: 180, referrals: 67, rewards: 1340 },
  { month: 'Mar', users: 220, referrals: 89, rewards: 1780 },
  { month: 'Apr', users: 280, referrals: 112, rewards: 2240 },
  { month: 'May', users: 320, referrals: 134, rewards: 2680 },
  { month: 'Jun', users: 380, referrals: 156, rewards: 3120 }
];

export const topReferrers = [
  { name: 'David Wilson', referrals: 20, rewards: 400 },
  { name: 'Robert Taylor', referrals: 18, rewards: 360 },
  { name: 'Michael Brown', referrals: 15, rewards: 300 },
  { name: 'John Smith', referrals: 12, rewards: 240 },
  { name: 'Sarah Johnson', referrals: 8, rewards: 160 }
];

export const rewardDistribution = [
  { type: 'Referral Bonuses', amount: 160, percentage: 57.1 },
  { type: 'Performance Bonuses', amount: 80, percentage: 28.6 },
  { type: 'Promotional Rewards', amount: 40, percentage: 14.3 }
];
