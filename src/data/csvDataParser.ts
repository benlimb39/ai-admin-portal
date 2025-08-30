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

// Embedded CSV data as fallback
const EMBEDDED_CSV_DATA = `id,user_id,verified,referred_by,rewards_earned,referrals,user_name
66,6215593875,TRUE,794424543,700,0,graceva🐥
76,6700758081,TRUE,794424543,250,0,Rin
78,6174588119,TRUE,794424543,0,0,ichaa
1601,6457189435,TRUE,7074159944,0,0,Ishak
1602,6457189436,TRUE,7074159944,150,2,John Doe
1603,6457189437,FALSE,7074159944,300,1,Jane Smith
1604,6457189438,TRUE,7074159944,450,3,Sarah Wilson
1605,6457189439,TRUE,7074159944,200,1,Mike Johnson
1606,6457189440,FALSE,7074159944,100,0,David Brown
1607,6457189441,TRUE,7074159944,600,4,Alice Cooper
1608,6457189442,TRUE,7074159944,350,2,Bob Wilson
1609,6457189443,TRUE,7074159944,400,3,Emma Davis
1610,6457189444,FALSE,7074159944,250,1,Frank Miller
1611,6457189445,TRUE,7074159944,500,2,Grace Lee
1612,6457189446,TRUE,7074159944,150,0,Henry Taylor`;

export const loadCSVData = async (): Promise<ProcessedData> => {
  try {
    console.log('Attempting to load CSV data from file...');
    
    // Try to load from file first
    let csvText: string;
    try {
      const response = await fetch('/users_202508071211.csv');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      csvText = await response.text();
      console.log('CSV file loaded successfully, length:', csvText.length);
    } catch (fileError) {
      console.warn('Failed to load CSV file, using embedded data:', fileError);
      csvText = EMBEDDED_CSV_DATA;
      console.log('Using embedded CSV data, length:', csvText.length);
    }
    
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
    
    if (csvUsers.length === 0) {
      throw new Error('No users found in CSV data');
    }
    
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
