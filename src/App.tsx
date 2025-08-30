import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import ReferralReport from './components/Referrals/ReferralReport';
import RewardBalanceReport from './components/Rewards/RewardBalanceReport';
import Settings from './components/Settings/Settings';

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <DataProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/referrals" element={<ReferralReport />} />
              <Route path="/rewards" element={<RewardBalanceReport />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </DataProvider>
    </MuiThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
