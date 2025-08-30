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

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const RewardBalanceReport: React.FC = () => {
  const { data, loading, error, refreshData } = useData();
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

  // Move useMemo before any early returns
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
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
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
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
          Reward Balance Report
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{ borderColor: '#6366f1', color: '#6366f1' }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ backgroundColor: '#6366f1' }}
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
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
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
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#1f2937' }}>
              Monthly Reward Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRewardData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
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
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            height: '100%'
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#1f2937' }}>
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
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
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
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
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
            />
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
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
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
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
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #e5e7eb'
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f9fafb',
                borderBottom: '2px solid #e5e7eb'
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f3f4f6'
              }
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
