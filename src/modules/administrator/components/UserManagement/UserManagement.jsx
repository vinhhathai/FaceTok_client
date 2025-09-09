import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useGetAllUsersQuery, useUpdateUserStatusMutation, useDeleteUserMutation } from '../../api';

const UserManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const { data: usersData, isLoading, refetch } = useGetAllUsersQuery({
    page: page + 1,
    limit: rowsPerPage,
    search,
  });

  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

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
      if (actionType === 'delete') {
        await deleteUser(selectedUser._id).unwrap();
        setToast({ open: true, message: 'Xóa người dùng thành công', severity: 'success' });
      } else {
        await updateUserStatus({ 
          userId: selectedUser._id, 
          status: actionType 
        }).unwrap();
        setToast({ 
          open: true, 
          message: `Cập nhật trạng thái người dùng thành công`, 
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

  const getStatusChip = (status) => {
    const statusConfig = {
      active: { label: 'Hoạt động', color: 'success' },
      blocked: { label: 'Bị khóa', color: 'error' },
      pending: { label: 'Chờ duyệt', color: 'warning' },
    };
    
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getActionTitle = () => {
    switch (actionType) {
      case 'active': return 'Kích hoạt tài khoản';
      case 'blocked': return 'Khóa tài khoản';
      case 'delete': return 'Xóa tài khoản';
      default: return 'Xác nhận';
    }
  };

  const getActionMessage = () => {
    switch (actionType) {
      case 'active': return `Bạn có chắc chắn muốn kích hoạt tài khoản của ${selectedUser?.fullName}?`;
      case 'blocked': return `Bạn có chắc chắn muốn khóa tài khoản của ${selectedUser?.fullName}?`;
      case 'delete': return `Bạn có chắc chắn muốn xóa tài khoản của ${selectedUser?.fullName}? Hành động này không thể hoàn tác.`;
      default: return 'Bạn có chắc chắn muốn thực hiện hành động này?';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý người dùng
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Tìm kiếm người dùng"
          value={search}
          onChange={handleSearchChange}
          placeholder="Nhập tên hoặc email..."
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : (
              usersData?.users?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Avatar src={user.profilePicture} alt={user.fullName}>
                      {user.fullName?.charAt(0)}
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getStatusChip(user.status)}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {user.status !== 'active' && (
                        <IconButton
                          color="success"
                          onClick={() => handleAction(user, 'active')}
                          title="Kích hoạt"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                      {user.status !== 'blocked' && (
                        <IconButton
                          color="warning"
                          onClick={() => handleAction(user, 'blocked')}
                          title="Khóa tài khoản"
                        >
                          <BlockIcon />
                        </IconButton>
                      )}
                      <IconButton
                        color="error"
                        onClick={() => handleAction(user, 'delete')}
                        title="Xóa tài khoản"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
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
        />
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{getActionTitle()}</DialogTitle>
        <DialogContent>
          <Typography>{getActionMessage()}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button 
            onClick={handleConfirmAction} 
            color={actionType === 'delete' ? 'error' : 'primary'}
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;