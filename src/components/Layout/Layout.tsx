import React, { useState } from 'react';
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <Header onMenuClick={handleDrawerToggle} />
      
      {/* Desktop Sidebar - Always visible */}
      {!isMobile && (
        <Sidebar 
          open={true} 
          onClose={() => {}} 
          variant="permanent"
        />
      )}
      
      {/* Mobile Sidebar - Only visible when opened */}
      {isMobile && (
        <Sidebar 
          open={mobileOpen} 
          onClose={() => setMobileOpen(false)} 
          variant="temporary"
        />
      )}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          backgroundColor: 'background.default',
          color: 'text.primary',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
