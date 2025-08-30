import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridValueGetter,
  GridToolbar,
  GridFilterModel,
  GridSortModel
} from '@mui/x-data-grid';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Payment as PaymentIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const RewardBalanceReport: React.FC = () => {
  const { data, loading, error, refreshData } = useData();
  const { theme } = useTheme();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: []
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [processPaymentDialogOpen, setProcessPaymentDialogOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const filteredRewards = useMemo(() => {
    if (!data) return [];
    
    let filtered = data.rewards;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(reward => reward.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(reward => reward.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(reward =>
        reward.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reward.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [data, filterStatus, filterType, searchTerm]);

  const handleViewDetails = (reward: any) => {
    setSelectedReward(reward);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedReward(null);
  };

  const handleProcessPayment = (reward: any) => {
    setSelectedReward(reward);
    setProcessPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setProcessPaymentDialogOpen(false);
    setSelectedReward(null);
  };

  const handleConfirmPayment = async () => {
    if (!selectedReward) return;
    
    setProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProcessingPayment(false);
    setProcessPaymentDialogOpen(false);
    setSnackbarMessage(`Payment processed successfully for ${selectedReward.userName}`);
    setSnackbarOpen(true);
    setSelectedReward(null);
    
    // Refresh data to reflect changes
    refreshData();
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'User', 'Type', 'Amount', 'Status', 'Date', 'Description'],
      ...filteredRewards.map(reward => [
        reward.id,
        reward.userName,
        reward.type,
        `$${reward.amount}`,
        reward.status,
        new Date(reward.date).toLocaleDateString(),
        reward.description
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reward-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    refreshData();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading data: {error}
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          No data available. Please check your CSV file.
        </Alert>
      </Box>
    );
  }

  const { rewards } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'referral':
        return '#6366f1';
      case 'bonus':
        return '#10b981';
      case 'promotion':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      sortable: false
    },
    {
      field: 'userName',
      headerName: 'User',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{ width: 32, height: 32, fontSize: '0.875rem' }}
          >
            {params.value.charAt(0)}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: getTypeColor(params.value),
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'capitalize'
          }}
        />
      )
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#10b981' }}>
          ${params.value}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: getStatusColor(params.value),
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'capitalize'
          }}
        />
      )
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 120,
      valueGetter: (params: any) => {
        return new Date(params.value).toLocaleDateString();
      }
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 250,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton 
              size="small" 
              color="primary"
              onClick={() => handleViewDetails(params.row)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          {params.row.status === 'pending' && (
            <Tooltip title="Process Payment">
              <IconButton 
                size="small" 
                color="success"
                onClick={() => handleProcessPayment(params.row)}
              >
                <PaymentIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ];

  const stats = [
    {
      title: 'Total Rewards',
      value: `$${rewards.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`,
      color: '#6366f1'
    },
    {
      title: 'Paid Rewards',
      value: `$${rewards.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`,
      color: '#10b981'
    },
    {
      title: 'Pending Rewards',
      value: `$${rewards.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`,
      color: '#f59e0b'
    },
    {
      title: 'Total Transactions',
      value: rewards.length,
      color: '#ef4444'
    }
  ];

  const rewardTypeData = [
    { name: 'Referral', value: rewards.filter(r => r.type === 'referral').length },
    { name: 'Bonus', value: rewards.filter(r => r.type === 'bonus').length },
    { name: 'Promotion', value: rewards.filter(r => r.type === 'promotion').length }
  ].filter(item => item.value > 0);

  const monthlyRewardData = [
    { month: 'Jan', amount: Math.floor(rewards.reduce((sum, r) => sum + r.amount, 0) * 0.15) },
    { month: 'Feb', amount: Math.floor(rewards.reduce((sum, r) => sum + r.amount, 0) * 0.25) },
    { month: 'Mar', amount: Math.floor(rewards.reduce((sum, r) => sum + r.amount, 0) * 0.35) },
    { month: 'Apr', amount: Math.floor(rewards.reduce((sum, r) => sum + r.amount, 0) * 0.45) },
    { month: 'May', amount: Math.floor(rewards.reduce((sum, r) => sum + r.amount, 0) * 0.65) },
    { month: 'Jun', amount: rewards.reduce((sum, r) => sum + r.amount, 0) }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Reward Balance Report
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{ borderColor: 'primary.main', color: 'primary.main' }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        {stats.map((stat, index) => (
          <Card
            key={index}
            sx={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid',
              borderColor: 'divider',
              backdropFilter: 'blur(10px)',
            }}
          >
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {stat.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Charts Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mb: 4 }}>
        {/* Monthly Rewards Chart */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid',
            borderColor: 'divider',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Monthly Reward Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRewardData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reward Types Distribution */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid',
            borderColor: 'divider',
            backdropFilter: 'blur(10px)',
            height: '100%'
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Reward Types
            </Typography>
            {rewardTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={rewardTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {rewardTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No reward data available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(10px)',
          mb: 3
        }}
      >
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, alignItems: 'center' }}>
            <TextField
              fullWidth
              label="Search rewards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                }
              }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{
                  backgroundColor: 'background.paper',
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                label="Type"
                onChange={(e) => setFilterType(e.target.value)}
                sx={{
                  backgroundColor: 'background.paper',
                }}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="referral">Referral</MenuItem>
                <MenuItem value="bonus">Bonus</MenuItem>
                <MenuItem value="promotion">Promotion</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setFilterModel({ items: [] });
                  setFilterStatus('all');
                  setFilterType('all');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={filteredRewards}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            slots={{
              toolbar: GridToolbar
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 }
              }
            }}
            sx={{
              border: 'none',
              backgroundColor: 'transparent',
              color: 'text.primary',
              '& .MuiDataGrid-root': {
                border: 'none',
                backgroundColor: 'transparent',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'transparent',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'action.hover',
                borderBottom: '2px solid',
                borderColor: 'divider',
                color: 'text.primary',
              },
              '& .MuiDataGrid-row': {
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&:nth-of-type(even)': {
                  backgroundColor: 'rgba(255,255,255,0.02)',
                },
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'action.hover',
              },
              '& .MuiDataGrid-toolbarContainer': {
                backgroundColor: 'transparent',
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: 'transparent',
              },
              '& .MuiDataGrid-virtualScrollerContent': {
                backgroundColor: 'transparent',
              },
              '& .MuiDataGrid-virtualScrollerRenderZone': {
                backgroundColor: 'transparent',
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: 'transparent',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-cellContent': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-selectedRowCount': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-footerTotalRow': {
                backgroundColor: 'action.hover',
              },
              '& .MuiDataGrid-footerRow': {
                backgroundColor: 'action.hover',
              },
              '& .MuiDataGrid-panel': {
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-panelContent': {
                backgroundColor: 'background.paper',
              },
              '& .MuiDataGrid-panelHeader': {
                backgroundColor: 'action.hover',
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-filterForm': {
                backgroundColor: 'background.paper',
              },
              '& .MuiDataGrid-filterFormDeleteIcon': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-filterFormOperatorInput': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-filterFormValueInput': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-filterFormColumnInput': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-filterFormLogicOperatorInput': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnMenu': {
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-menuList': {
                backgroundColor: 'background.paper',
              },
              '& .MuiDataGrid-menuItem': {
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              },
              '& .MuiDataGrid-sortIcon': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-menuIcon': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderSortIcon': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContent': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentTitle': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentSortIcon': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentMenuIcon': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentResizeHandle': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentResizeHandleLeft': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentResizeHandleRight': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentResizeHandleActive': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentResizeHandleHover': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentResizeHandleDisabled': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentResizeHandleVertical': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentResizeHandleHorizontal': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentResizeHandleCorner': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentResizeHandleCornerTopLeft': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentResizeHandleCornerTopRight': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentResizeHandleCornerBottomLeft': {
                color: 'text.primary',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContentResizeHandleCornerBottomRight': {
                color: 'text.primary',
              },
            }}
          />
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Reward Details</Typography>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedReward && (
            <List>
              <ListItem>
                <ListItemText
                  primary="Reward ID"
                  secondary={selectedReward.id}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="User"
                  secondary={selectedReward.userName}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Type"
                  secondary={
                    <Chip
                      label={selectedReward.type}
                      size="small"
                      sx={{
                        backgroundColor: getTypeColor(selectedReward.type),
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}
                    />
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Amount"
                  secondary={`$${selectedReward.amount}`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Status"
                  secondary={
                    <Chip
                      label={selectedReward.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(selectedReward.status),
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}
                    />
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Date"
                  secondary={new Date(selectedReward.date).toLocaleDateString()}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Description"
                  secondary={selectedReward.description}
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Process Payment Dialog */}
      <Dialog
        open={processPaymentDialogOpen}
        onClose={handleClosePaymentDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Process Payment</Typography>
          <IconButton onClick={handleClosePaymentDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedReward && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Are you sure you want to process payment for this reward?
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="User"
                    secondary={selectedReward.userName}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Amount"
                    secondary={`$${selectedReward.amount}`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Type"
                    secondary={selectedReward.type}
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog} disabled={processingPayment}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmPayment} 
            variant="contained" 
            color="success"
            disabled={processingPayment}
            startIcon={processingPayment ? <CircularProgress size={16} /> : null}
          >
            {processingPayment ? 'Processing...' : 'Confirm Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default RewardBalanceReport;
