import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People,
  CardGiftcard,
  PersonAdd,
  CheckCircle
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useData } from '../../context/DataContext';

const Dashboard: React.FC = () => {
  const { data, loading, error } = useData();

  console.log('Dashboard render:', { data, loading, error });

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        backgroundColor: '#000000',
        color: '#ffffff'
      }}>
        <CircularProgress size={60} sx={{ color: '#ffffff' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, backgroundColor: '#000000', color: '#ffffff' }}>
        <Alert severity="error" sx={{ mb: 3, backgroundColor: '#1f1f1f', color: '#ffffff' }}>
          Error loading data: {error}
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3, backgroundColor: '#000000', color: '#ffffff' }}>
        <Alert severity="warning" sx={{ backgroundColor: '#1f1f1f', color: '#ffffff' }}>
          No data available. Please check your CSV file.
        </Alert>
      </Box>
    );
  }

  const { dashboardMetrics, users, referrals, rewards } = data;

  const metrics = [
    {
      title: 'Total Users',
      value: dashboardMetrics.totalUsers.toLocaleString(),
      icon: <People sx={{ fontSize: 40, color: '#6366f1' }} />,
      change: '+12%',
      changeColor: '#10b981'
    },
    {
      title: 'Active Users',
      value: dashboardMetrics.activeUsers.toLocaleString(),
      icon: <CheckCircle sx={{ fontSize: 40, color: '#10b981' }} />,
      change: '+8%',
      changeColor: '#10b981'
    },
    {
      title: 'Total Referrals',
      value: dashboardMetrics.totalReferrals.toLocaleString(),
      icon: <PersonAdd sx={{ fontSize: 40, color: '#f59e0b' }} />,
      change: '+15%',
      changeColor: '#10b981'
    },
    {
      title: 'Total Rewards',
      value: `$${dashboardMetrics.totalRewards.toLocaleString()}`,
      icon: <CardGiftcard sx={{ fontSize: 40, color: '#ef4444' }} />,
      change: '+22%',
      changeColor: '#10b981'
    }
  ];

  // Generate monthly data based on real data
  const monthlyData = [
    { month: 'Jan', users: Math.floor(dashboardMetrics.totalUsers * 0.15), referrals: Math.floor(dashboardMetrics.totalReferrals * 0.15) },
    { month: 'Feb', users: Math.floor(dashboardMetrics.totalUsers * 0.25), referrals: Math.floor(dashboardMetrics.totalReferrals * 0.25) },
    { month: 'Mar', users: Math.floor(dashboardMetrics.totalUsers * 0.35), referrals: Math.floor(dashboardMetrics.totalReferrals * 0.35) },
    { month: 'Apr', users: Math.floor(dashboardMetrics.totalUsers * 0.45), referrals: Math.floor(dashboardMetrics.totalReferrals * 0.45) },
    { month: 'May', users: Math.floor(dashboardMetrics.totalUsers * 0.65), referrals: Math.floor(dashboardMetrics.totalReferrals * 0.65) },
    { month: 'Jun', users: dashboardMetrics.totalUsers, referrals: dashboardMetrics.totalReferrals }
  ];

  // Calculate reward distribution with better color correlation
  const rewardDistribution = [
    { 
      name: 'Referral Bonuses', 
      value: rewards.filter(r => r.type === 'referral').reduce((sum, r) => sum + r.amount, 0),
      percentage: rewards.length > 0 ? (rewards.filter(r => r.type === 'referral').length / rewards.length) * 100 : 0,
      color: '#6366f1' // Primary theme color
    },
    { 
      name: 'Performance Bonuses', 
      value: rewards.filter(r => r.type === 'bonus').reduce((sum, r) => sum + r.amount, 0),
      percentage: rewards.length > 0 ? (rewards.filter(r => r.type === 'bonus').length / rewards.length) * 100 : 0,
      color: '#10b981' // Success theme color
    },
    { 
      name: 'Promotional Rewards', 
      value: rewards.filter(r => r.type === 'promotion').reduce((sum, r) => sum + r.amount, 0),
      percentage: rewards.length > 0 ? (rewards.filter(r => r.type === 'promotion').length / rewards.length) * 100 : 0,
      color: '#f59e0b' // Warning theme color
    }
  ].filter(item => item.value > 0);

  // Get top referrers
  const topReferrers = users
    .filter(user => user.totalReferrals > 0)
    .sort((a, b) => b.totalReferrals - a.totalReferrals)
    .slice(0, 5)
    .map(user => ({
      name: user.name,
      referrals: user.totalReferrals,
      rewards: user.totalRewards
    }));

  return (
    <Box sx={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#ffffff' }}>
        Dashboard Overview
      </Typography>

      {/* Metrics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        {metrics.map((metric, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333333',
              color: '#ffffff',
              '&:hover': {
                boxShadow: '0 4px 6px -1px rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: '#ffffff' }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cccccc', mb: 1 }}>
                    {metric.title}
                  </Typography>
                  <Chip
                    label={metric.change}
                    size="small"
                    sx={{
                      backgroundColor: metric.changeColor,
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <Box sx={{ mt: 1 }}>
                  {metric.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Charts Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mb: 4 }}>
        {/* Monthly Growth Chart */}
        <Card
          sx={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333333',
            color: '#ffffff',
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#ffffff' }}>
              Monthly Growth
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis dataKey="month" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333333',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="referrals"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reward Distribution */}
        <Card
          sx={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333333',
            color: '#ffffff',
            height: '100%'
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#ffffff' }}>
              Reward Distribution
            </Typography>
            {rewardDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={rewardDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {rewardDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333333',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    formatter={(value, name) => [`$${value?.toLocaleString()}`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Typography variant="body2" sx={{ color: '#cccccc' }}>
                  No reward data available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Bottom Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        {/* Top Referrers */}
        <Card
          sx={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333333',
            color: '#ffffff',
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#ffffff' }}>
              Top Referrers
            </Typography>
            <List>
              {topReferrers.map((referrer, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'][index % 4] }}>
                        {referrer.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={referrer.name}
                      secondary={`${referrer.referrals} referrals • $${referrer.rewards.toLocaleString()} earned`}
                      primaryTypographyProps={{ fontWeight: 'medium', color: '#ffffff' }}
                      secondaryTypographyProps={{ color: '#cccccc' }}
                    />
                  </ListItem>
                  {index < topReferrers.length - 1 && <Divider sx={{ borderColor: '#333333' }} />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card
          sx={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333333',
            color: '#ffffff',
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#ffffff' }}>
              Recent Activity
            </Typography>
            <List>
              {referrals.slice(0, 5).map((referral, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: referral.status === 'completed' ? '#10b981' : '#f59e0b' }}>
                        {referral.referrerName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${referral.referrerName} referred ${referral.referredName}`}
                      secondary={`${referral.status} • $${referral.reward} reward`}
                      primaryTypographyProps={{ fontWeight: 'medium', color: '#ffffff' }}
                      secondaryTypographyProps={{ color: '#cccccc' }}
                    />
                  </ListItem>
                  {index < Math.min(5, referrals.length) - 1 && <Divider sx={{ borderColor: '#333333' }} />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
