import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme as useMuiTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Brightness4 as DarkGreyIcon
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { ThemeMode } from '../../types';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { themeMode, setThemeMode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    handleMenuClose();
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'dark':
        return <DarkModeIcon />;
      case 'darkGrey':
        return <DarkGreyIcon />;
      default:
        return <LightModeIcon />;
    }
  };

  const getNextTheme = (): ThemeMode => {
    switch (themeMode) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'darkGrey';
      case 'darkGrey':
        return 'light';
      default:
        return 'light';
    }
  };

  const handleThemeToggle = () => {
    setThemeMode(getNextTheme());
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Admin Portal
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${getNextTheme()} mode`}>
            <IconButton
              color="inherit"
              onClick={handleThemeToggle}
              sx={{ mr: 1 }}
            >
              {getThemeIcon()}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Menu */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: 'primary.main',
                  fontSize: '0.875rem',
                }}
              >
                A
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <AccountIcon sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={() => handleThemeChange('light')}>
            <LightModeIcon sx={{ mr: 2 }} />
            Light Mode
          </MenuItem>
          <MenuItem onClick={() => handleThemeChange('dark')}>
            <DarkModeIcon sx={{ mr: 2 }} />
            Dark Mode
          </MenuItem>
          <MenuItem onClick={() => handleThemeChange('darkGrey')}>
            <DarkGreyIcon sx={{ mr: 2 }} />
            Dark Grey Mode
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
