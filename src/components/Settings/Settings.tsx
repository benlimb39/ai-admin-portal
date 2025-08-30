import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Button,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  TextField,
  Alert,
  Snackbar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Visibility as VisibilityIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Brightness4 as DarkGreyIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import { ThemeMode, UserSettings } from '../../types';

const Settings: React.FC = () => {
  const { themeMode, setThemeMode, themeSettings, updateThemeSettings } = useTheme();
  const [settings, setSettings] = useState<UserSettings>({
    theme: themeSettings,
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    display: {
      compactMode: false,
      showAvatars: true,
      autoRefresh: true,
    },
    language: 'en',
    timezone: 'UTC',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    setSnackbarMessage(`Theme changed to ${mode} mode`);
    setSnackbarOpen(true);
  };

  const handleSettingChange = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setSnackbarMessage('Settings saved successfully!');
    setSnackbarOpen(true);
  };

  const handleResetSettings = () => {
    const defaultSettings: UserSettings = {
      theme: {
        mode: 'light',
        primaryColor: '#6366f1',
        accentColor: '#10b981',
      },
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      display: {
        compactMode: false,
        showAvatars: true,
        autoRefresh: true,
      },
      language: 'en',
      timezone: 'UTC',
    };
    setSettings(defaultSettings);
    setThemeMode('light');
    setSnackbarMessage('Settings reset to default');
    setSnackbarOpen(true);
  };

  const themeOptions = [
    {
      mode: 'light' as ThemeMode,
      name: 'Light',
      description: 'Clean and bright interface',
      icon: <LightModeIcon />,
      color: '#f9fafb',
      activeColor: '#6366f1',
    },
    {
      mode: 'dark' as ThemeMode,
      name: 'Dark',
      description: 'Dark blue theme for night use',
      icon: <DarkModeIcon />,
      color: '#0f172a',
      activeColor: '#6366f1',
    },
    {
      mode: 'darkGrey' as ThemeMode,
      name: 'Dark Grey',
      description: 'Classic dark grey theme',
      icon: <DarkGreyIcon />,
      color: '#1a1a1a',
      activeColor: '#6366f1',
    },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'EST', label: 'EST (Eastern Standard Time)' },
    { value: 'PST', label: 'PST (Pacific Standard Time)' },
    { value: 'GMT', label: 'GMT (Greenwich Mean Time)' },
    { value: 'CET', label: 'CET (Central European Time)' },
    { value: 'JST', label: 'JST (Japan Standard Time)' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleResetSettings}
          >
            Reset to Default
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Theme Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PaletteIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Theme
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Choose your preferred theme for the admin portal
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {themeOptions.map((option) => (
                  <Card
                    key={option.mode}
                    sx={{
                      cursor: 'pointer',
                      border: themeMode === option.mode ? 2 : 1,
                      borderColor: themeMode === option.mode ? 'primary.main' : 'divider',
                      backgroundColor: themeMode === option.mode ? 'action.selected' : 'background.paper',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={() => handleThemeChange(option.mode)}
                  >
                    <CardContent sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              backgroundColor: option.color,
                              color: themeMode === option.mode ? option.activeColor : 'text.secondary',
                              width: 40,
                              height: 40,
                            }}
                          >
                            {option.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {option.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {option.description}
                            </Typography>
                          </Box>
                        </Box>
                        {themeMode === option.mode && (
                          <CheckIcon color="primary" />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Notifications
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Configure how you receive notifications
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive updates via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.notifications.email}
                      onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Receive browser notifications"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.notifications.push}
                      onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="SMS Notifications"
                    secondary="Receive updates via SMS"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.notifications.sms}
                      onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Display Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VisibilityIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Display
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Customize the display settings
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <VisibilityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Compact Mode"
                    secondary="Reduce spacing for more content"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.display.compactMode}
                      onChange={(e) => handleSettingChange('display', 'compactMode', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <VisibilityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Show Avatars"
                    secondary="Display user avatars in lists"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.display.showAvatars}
                      onChange={(e) => handleSettingChange('display', 'showAvatars', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <VisibilityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Auto Refresh"
                    secondary="Automatically refresh data"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.display.autoRefresh}
                      onChange={(e) => handleSettingChange('display', 'autoRefresh', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Language & Timezone */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LanguageIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Language & Timezone
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Set your preferred language and timezone
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={settings.language}
                  label="Language"
                  onChange={(e) => handleSettingChange('language', '', e.target.value)}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={settings.timezone}
                  label="Timezone"
                  onChange={(e) => handleSettingChange('timezone', '', e.target.value)}
                >
                  {timezones.map((tz) => (
                    <MenuItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Settings;
