import Papa from 'papaparse';
import { User, Referral, Reward } from '../types';
import { sampleUsers, sampleReferrals, sampleRewards, dashboardMetrics } from './sampleData';

export interface CSVUser {
  id: string;
  user_id: string;
  verified: string;
  referred_by: string;
  rewards_earned: string;
  referrals: string;
  user_name: string;
}

export interface ProcessedData {
  users: User[];
  referrals: Referral[];
  rewards: Reward[];
  dashboardMetrics: {
    totalUsers: number;
    activeUsers: number;
    totalReferrals: number;
    totalRewards: number;
    referralGrowth: number;
    averageReward: number;
  };
}

export const loadCSVData = async (): Promise<ProcessedData> => {
  try {
    console.log('Attempting to load CSV data...');
    const response = await fetch('/users_202508071211.csv');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('CSV loaded successfully, length:', csvText.length);
    
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim()
    });

    if (result.errors.length > 0) {
      console.warn('CSV parsing warnings:', result.errors);
    }

    const csvUsers: CSVUser[] = result.data as CSVUser[];
    console.log('Parsed CSV users:', csvUsers.length);
    
    // Process users
    const users: User[] = csvUsers.map((csvUser, index) => ({
      id: csvUser.id,
      name: csvUser.user_name || `User ${csvUser.user_id}`,
      email: `${csvUser.user_name?.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
      avatar: `https://i.pravatar.cc/150?img=${parseInt(csvUser.id) % 70 + 1}`,
      status: csvUser.verified === 'TRUE' ? 'active' : 'inactive',
      joinDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      totalReferrals: parseInt(csvUser.referrals) || 0,
      totalRewards: parseInt(csvUser.rewards_earned) || 0
    }));

    // Process referrals
    const referrals: Referral[] = [];
    const referralMap = new Map<string, string>();

    csvUsers.forEach((csvUser) => {
      if (csvUser.referred_by && csvUser.referred_by !== '') {
        const referrer = csvUsers.find(u => u.user_id === csvUser.referred_by);
        if (referrer) {
          const referralId = `${csvUser.id}-${csvUser.referred_by}`;
          if (!referralMap.has(referralId)) {
            referralMap.set(referralId, '1');
            referrals.push({
              id: referralId,
              referrerId: csvUser.referred_by,
              referrerName: referrer.user_name || `User ${referrer.user_id}`,
              referredId: csvUser.user_id,
              referredName: csvUser.user_name || `User ${csvUser.user_id}`,
              referredEmail: `${csvUser.user_name?.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
              status: csvUser.verified === 'TRUE' ? 'completed' : 'pending',
              date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
              reward: parseInt(csvUser.rewards_earned) > 0 ? 20 : 0
            });
          }
        }
      }
    });

    // Process rewards
    const rewards: Reward[] = [];
    csvUsers.forEach((csvUser) => {
      if (parseInt(csvUser.rewards_earned) > 0) {
        const rewardTypes = ['referral', 'bonus', 'promotion'];
        const rewardAmount = parseInt(csvUser.rewards_earned);
        
        // Split rewards into multiple transactions for more realistic data
        const numTransactions = Math.min(Math.floor(rewardAmount / 50) + 1, 3);
        const amountPerTransaction = Math.floor(rewardAmount / numTransactions);
        
        for (let i = 0; i < numTransactions; i++) {
          const remainingAmount = rewardAmount - (i * amountPerTransaction);
          const currentAmount = i === numTransactions - 1 ? remainingAmount : amountPerTransaction;
          
          rewards.push({
            id: `${csvUser.id}-reward-${i}`,
            userId: csvUser.user_id,
            userName: csvUser.user_name || `User ${csvUser.user_id}`,
            type: rewardTypes[i % rewardTypes.length] as 'referral' | 'bonus' | 'promotion',
            amount: currentAmount,
            status: csvUser.verified === 'TRUE' ? 'paid' : 'pending',
            date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            description: `${rewardTypes[i % rewardTypes.length]} reward for ${csvUser.user_name || `User ${csvUser.user_id}`}`
          });
        }
      }
    });

    // Calculate dashboard metrics
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const totalReferrals = referrals.length;
    const totalRewards = rewards.reduce((sum, r) => sum + r.amount, 0);
    const referralGrowth = totalReferrals > 0 ? 75.0 : 0;
    const averageReward = totalRewards > 0 ? totalRewards / rewards.length : 0;

    console.log('CSV data processed successfully:', {
      users: users.length,
      referrals: referrals.length,
      rewards: rewards.length,
      totalUsers,
      activeUsers,
      totalReferrals,
      totalRewards
    });

    return {
      users,
      referrals,
      rewards,
      dashboardMetrics: {
        totalUsers,
        activeUsers,
        totalReferrals,
        totalRewards,
        referralGrowth,
        averageReward
      }
    };

  } catch (error) {
    console.error('Error loading CSV data:', error);
    console.log('Falling back to sample data...');
    
    // Fallback to sample data
    return {
      users: sampleUsers,
      referrals: sampleReferrals,
      rewards: sampleRewards,
      dashboardMetrics: {
        totalUsers: dashboardMetrics.totalUsers,
        activeUsers: dashboardMetrics.activeUsers,
        totalReferrals: dashboardMetrics.totalReferrals,
        totalRewards: dashboardMetrics.totalRewards,
        referralGrowth: dashboardMetrics.referralGrowth,
        averageReward: dashboardMetrics.averageReward
      }
    };
  }
};
