import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  Snackbar,
  InputAdornment,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as VerifiedIcon,
  Warning as WarningIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useGetAllUsersQuery, useBanUserMutation, useUnbanUserMutation, useSendEmailToUserMutation, useUpdateUserRoleMutation } from '../../api';
import EmailModal from '../EmailModal/EmailModal';

const UserManagement = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState('');

  // Build query params
  const queryParams = {
    page: page + 1,
    limit: rowsPerPage,
    search,
  };
  
  // Add filters only if not 'all'
  if (roleFilter !== 'all') {
    queryParams.role = roleFilter;
  }
  
  // Status filter: verified, unverified, banned
  if (statusFilter === 'verified') {
    // Verified: Email verified AND account active
    queryParams.isEmailVerified = 'true';
    queryParams.isActive = 'true';
  } else if (statusFilter === 'unverified') {
    // Unverified: Email not verified yet (isActive will be false by default)
    queryParams.isEmailVerified = 'false';
  } else if (statusFilter === 'banned') {
    // Banned: Account was active but manually banned by admin
    // Email must be verified (true) but account is now inactive (false)
    queryParams.isActive = 'false';
    queryParams.isEmailVerified = 'true';
  }

  const { data: usersData, isLoading, refetch } = useGetAllUsersQuery(queryParams);

  const [banUser] = useBanUserMutation();
  const [unbanUser] = useUnbanUserMutation();
  const [sendEmailToUser] = useSendEmailToUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleAction = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (actionType === 'ban') {
        await banUser(selectedUser._id || selectedUser.id).unwrap();
        setToast({ 
          open: true, 
          message: 'Khóa người dùng thành công', 
          severity: 'success' 
        });
      } else if (actionType === 'unban') {
        await unbanUser(selectedUser._id || selectedUser.id).unwrap();
        setToast({ 
          open: true, 
          message: 'Mở khóa người dùng thành công', 
          severity: 'success' 
        });
      }
      refetch();
    } catch (error) {
      setToast({ 
        open: true, 
        message: 'Có lỗi xảy ra: ' + (error.data?.message || error.message), 
        severity: 'error' 
      });
    }
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleOpenEmailModal = (user) => {
    setSelectedUser(user);
    setEmailModalOpen(true);
  };

  const handleSendEmail = async (emailData) => {
    try {
      await sendEmailToUser({
        userId: selectedUser._id || selectedUser.id,
        subject: emailData.subject,
        message: emailData.message,
      }).unwrap();
      
      setToast({ 
        open: true, 
        message: 'Gửi email thành công', 
        severity: 'success' 
      });
      setEmailModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      setToast({ 
        open: true, 
        message: 'Có lỗi xảy ra khi gửi email: ' + (error.data?.message || error.message), 
        severity: 'error' 
      });
    }
  };

  const handleOpenRoleDialog = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    try {
      const userId = selectedUser._id || selectedUser.id;
      
      await updateUserRole({
        userId,
        role: newRole,
      }).unwrap();
      
      setToast({ 
        open: true, 
        message: 'Cập nhật quyền thành công', 
        severity: 'success' 
      });
      setRoleDialogOpen(false);
      setSelectedUser(null);
      refetch();
    } catch (error) {
      setToast({ 
        open: true, 
        message: 'Có lỗi xảy ra: ' + (error.data?.error?.message || error.data?.message || error.message), 
        severity: 'error' 
      });
    }
  };

  const getStatusChip = (isActive, isEmailVerified) => {
    if (!isEmailVerified) {
      return (
        <Chip 
          label="Chưa xác thực" 
          color="warning" 
          size="small"
          icon={<WarningIcon />}
        />
      );
    }
    if (!isActive) {
      return (
        <Chip 
          label="Bị khóa" 
          color="error" 
          size="small"
          icon={<BlockIcon />}
        />
      );
    }
    return (
      <Chip 
        label="Hoạt động" 
        color="success" 
        size="small"
        icon={<VerifiedIcon />}
      />
    );
  };

  const getRoleChip = (role, user) => {
    const roleConfig = {
      admin: { label: '👑 Admin', color: 'error' },
      staff: { label: '⭐ Staff', color: 'warning' },
      member: { label: '👤 Member', color: 'info' },
    };
    
    const config = roleConfig[role] || { label: role, color: 'default' };
    // Fix: So sánh đúng field - user table có _id, currentUser có id
    const userId = user._id || user.id;
    const currentUserId = currentUser?.id || currentUser?._id;
    const isOwnAccount = userId === currentUserId;
    
    return (
      <Chip 
        label={isOwnAccount ? config.label : `${config.label} ✏️`}
        color={config.color} 
        size="small" 
        variant="filled"
        onClick={!isOwnAccount ? () => handleOpenRoleDialog(user) : undefined}
        sx={{
          cursor: !isOwnAccount ? 'pointer' : 'default',
          fontWeight: 'bold',
          boxShadow: !isOwnAccount ? 1 : 0,
          '&:hover': !isOwnAccount ? {
            transform: 'scale(1.1)',
            boxShadow: 3,
            transition: 'all 0.2s'
          } : {}
        }}
      />
    );
  };

  const getActionTitle = () => {
    switch (actionType) {
      case 'ban': return 'Khóa tài khoản';
      case 'unban': return 'Mở khóa tài khoản';
      default: return 'Xác nhận';
    }
  };

  const getActionMessage = () => {
    switch (actionType) {
      case 'ban': return `Bạn có chắc chắn muốn khóa tài khoản của ${selectedUser?.fullName}?`;
      case 'unban': return `Bạn có chắc chắn muốn mở khóa tài khoản của ${selectedUser?.fullName}?`;
      default: return 'Bạn có chắc chắn muốn thực hiện hành động này?';
    }
  };

  // Statistics
  const totalUsers = usersData?.total || 0;
  const activeUsers = usersData?.data?.filter(u => u.isActive && u.isEmailVerified).length || 0;
  const blockedUsers = usersData?.data?.filter(u => !u.isActive).length || 0;
  const unverifiedUsers = usersData?.data?.filter(u => !u.isEmailVerified).length || 0;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Quản lý người dùng
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý và giám sát tất cả người dùng trong hệ thống
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Tổng người dùng
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {totalUsers}
                  </Typography>
                </Box>
                <PersonIcon sx={{ fontSize: 50, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Đang hoạt động
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {activeUsers}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 50, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Chưa xác thực
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {unverifiedUsers}
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 50, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Bị khóa
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {blockedUsers}
                  </Typography>
                </Box>
                <BlockIcon sx={{ fontSize: 50, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Search and Filter Box */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tìm kiếm người dùng"
              value={search}
              onChange={handleSearchChange}
              placeholder="Nhập tên hoặc email..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="role-filter-label">Vai trò</InputLabel>
              <Select
                labelId="role-filter-label"
                value={roleFilter}
                label="Vai trò"
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(0);
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">Tất cả vai trò</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="member">Member</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Trạng thái</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="verified">Đã xác thực</MenuItem>
                <MenuItem value="unverified">Chưa xác thực</MenuItem>
                <MenuItem value="banned">Bị khóa</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <TableContainer 
        component={Paper} 
        elevation={2}
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.light' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'white', width: 60 }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Người dùng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Vai trò</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Ngày tạo</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow key="loading">
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
                </TableCell>
              </TableRow>
            ) : usersData?.data?.length === 0 ? (
              <TableRow key="empty">
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Không tìm thấy người dùng nào</Typography>
                </TableCell>
              </TableRow>
            ) : (
              usersData?.data?.map((user, index) => (
                <TableRow 
                  key={user._id}
                  sx={{
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="600" color="text.secondary">
                      {page * rowsPerPage + index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar 
                        src={user.profilePicture} 
                        alt={user.fullName}
                        sx={{ width: 45, height: 45 }}
                      >
                        {user.fullName?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {user.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {user._id || user.id}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">{user.email}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {getRoleChip(user.role, user)}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(user.isActive, user.isEmailVerified)}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Gửi email">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleOpenEmailModal(user)}
                          sx={{
                            '&:hover': {
                              bgcolor: 'info.light',
                              color: 'white',
                            }
                          }}
                        >
                          <EmailIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {user.isActive ? (
                        <Tooltip key="ban" title="Khóa tài khoản">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleAction(user, 'ban')}
                            sx={{
                              '&:hover': {
                                bgcolor: 'warning.light',
                                color: 'white',
                              }
                            }}
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip key="unban" title="Mở khóa tài khoản">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleAction(user, 'unban')}
                            sx={{
                              '&:hover': {
                                bgcolor: 'success.light',
                                color: 'white',
                              }
                            }}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={usersData?.total || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: actionType === 'ban' ? 'warning.main' : 'primary.main',
          color: 'white',
          fontWeight: 'bold',
        }}>
          {getActionTitle()}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>{getActionMessage()}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined">
            Hủy
          </Button>
          <Button 
            onClick={handleConfirmAction} 
            color={actionType === 'delete' ? 'error' : 'primary'}
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Modal */}
      <EmailModal
        open={emailModalOpen}
        onClose={() => {
          setEmailModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleSendEmail}
        user={selectedUser}
      />

      {/* Role Update Dialog */}
      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)}>
        <DialogTitle>Thay đổi quyền người dùng</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, minWidth: 300 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Người dùng: <strong>{selectedUser?.fullName || selectedUser?.email}</strong>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Quyền hiện tại:
              </Typography>
              <Chip label={selectedUser?.role} size="small" color="primary" />
            </Box>
            
            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel>Quyền mới</InputLabel>
              <Select
                value={newRole}
                label="Quyền mới"
                onChange={(e) => setNewRole(e.target.value)}
              >
                <MenuItem value="member">👤 Member (Thành viên)</MenuItem>
                <MenuItem value="staff">⭐ Staff (Nhân viên)</MenuItem>
              </Select>
            </FormControl>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="caption">
                <strong>Lưu ý:</strong> Chỉ có thể thay đổi quyền thành Member hoặc Staff.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)} color="inherit">
            Hủy
          </Button>
          <Button 
            onClick={handleUpdateRole} 
            variant="contained" 
            color="primary"
            disabled={newRole === selectedUser?.role}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={toast.severity} 
          onClose={() => setToast({ ...toast, open: false })}
          variant="filled"
          elevation={6}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;
