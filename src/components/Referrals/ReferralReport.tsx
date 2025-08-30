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
  Divider
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridFilterModel,
  GridSortModel
} from '@mui/x-data-grid';
import {
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useData } from '../../context/DataContext';

const ReferralReport: React.FC = () => {
  const { data, loading, error, refreshData } = useData();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: []
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [selectedReferral, setSelectedReferral] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Move useMemo before any early returns
  const filteredReferrals = useMemo(() => {
    if (!data) return [];
    
    let filtered = data.referrals;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(referral => referral.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(referral =>
        referral.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.referredName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.referredEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [data, filterStatus, searchTerm]);

  const handleViewDetails = (referral: any) => {
    setSelectedReferral(referral);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedReferral(null);
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Referrer', 'Referred User', 'Email', 'Status', 'Date', 'Reward'],
      ...filteredReferrals.map(referral => [
        referral.id,
        referral.referrerName,
        referral.referredName,
        referral.referredEmail,
        referral.status,
        new Date(referral.date).toLocaleDateString(),
        `$${referral.reward}`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referral-report-${new Date().toISOString().split('T')[0]}.csv`;
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

  const { referrals } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
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
      field: 'referrerName',
      headerName: 'Referrer',
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
      field: 'referredName',
      headerName: 'Referred User',
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
      field: 'referredEmail',
      headerName: 'Email',
      width: 220,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {params.value}
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
      field: 'reward',
      headerName: 'Reward',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#10b981' }}>
          ${params.value}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
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
        </Box>
      )
    }
  ];

  const stats = [
    {
      title: 'Total Referrals',
      value: referrals.length,
      color: '#6366f1'
    },
    {
      title: 'Completed',
      value: referrals.filter(r => r.status === 'completed').length,
      color: '#10b981'
    },
    {
      title: 'Pending',
      value: referrals.filter(r => r.status === 'pending').length,
      color: '#f59e0b'
    },
    {
      title: 'Total Rewards',
      value: `$${referrals.reduce((sum, r) => sum + r.reward, 0).toLocaleString()}`,
      color: '#ef4444'
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Referral Report
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
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, alignItems: 'center' }}>
            <TextField
              fullWidth
              label="Search referrals..."
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
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setFilterModel({ items: [] })}
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
            rows={filteredReferrals}
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
          <Typography variant="h6">Referral Details</Typography>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedReferral && (
            <List>
              <ListItem>
                <ListItemText
                  primary="Referral ID"
                  secondary={selectedReferral.id}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Referrer"
                  secondary={selectedReferral.referrerName}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Referred User"
                  secondary={selectedReferral.referredName}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Email"
                  secondary={selectedReferral.referredEmail}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Status"
                  secondary={
                    <Chip
                      label={selectedReferral.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(selectedReferral.status),
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
                  secondary={new Date(selectedReferral.date).toLocaleDateString()}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Reward Amount"
                  secondary={`$${selectedReferral.reward}`}
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReferralReport;
