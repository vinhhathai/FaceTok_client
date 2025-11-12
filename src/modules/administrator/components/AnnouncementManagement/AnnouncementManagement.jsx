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
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Campaign as CampaignIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import {
  useGetAllAnnouncementsQuery,
  useDeleteAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useCreateAnnouncementMutation,
} from '../../api';
import AnnouncementModal from '../AnnouncementModal';

const AnnouncementManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [typeFilter, setTypeFilter] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Build query params
  const queryParams = {
    page: page + 1,
    limit: rowsPerPage,
  };

  if (typeFilter) queryParams.type = typeFilter;
  if (audienceFilter) queryParams.targetAudience = audienceFilter;
  if (isActiveFilter !== '') queryParams.isActive = isActiveFilter;

  const { data: announcementsData, isLoading, refetch } = useGetAllAnnouncementsQuery(queryParams);
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();
  const [createAnnouncement] = useCreateAnnouncementMutation();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleView = (announcement) => {
    setSelectedAnnouncement(announcement);
    setViewDialogOpen(true);
  };

  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAnnouncement(selectedAnnouncement._id || selectedAnnouncement.id).unwrap();
      setToast({
        open: true,
        message: 'Xóa thông báo thành công',
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      setToast({
        open: true,
        message: error?.data?.error?.message || 'Có lỗi xảy ra khi xóa thông báo',
        severity: 'error',
      });
    }
  };

  const handleCreateSubmit = async (announcementData) => {
    try {
      await createAnnouncement(announcementData).unwrap();
      setToast({
        open: true,
        message: 'Tạo thông báo thành công',
        severity: 'success',
      });
      setCreateModalOpen(false);
      refetch();
    } catch (error) {
      setToast({
        open: true,
        message: error?.data?.error?.message || 'Có lỗi xảy ra khi tạo thông báo',
        severity: 'error',
      });
    }
  };

  const handleEditSubmit = async (announcementData) => {
    try {
      await updateAnnouncement({
        id: selectedAnnouncement._id || selectedAnnouncement.id,
        ...announcementData,
      }).unwrap();
      setToast({
        open: true,
        message: 'Cập nhật thông báo thành công',
        severity: 'success',
      });
      setEditModalOpen(false);
      refetch();
    } catch (error) {
      setToast({
        open: true,
        message: error?.data?.error?.message || 'Có lỗi xảy ra khi cập nhật thông báo',
        severity: 'error',
      });
    }
  };

  const handleToggleActive = async (announcement) => {
    try {
      await updateAnnouncement({
        id: announcement._id || announcement.id,
        isActive: !announcement.isActive,
      }).unwrap();
      setToast({
        open: true,
        message: `Đã ${!announcement.isActive ? 'kích hoạt' : 'vô hiệu hóa'} thông báo`,
        severity: 'success',
      });
      refetch();
    } catch (error) {
      setToast({
        open: true,
        message: error?.data?.error?.message || 'Có lỗi xảy ra',
        severity: 'error',
      });
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'info':
        return <InfoIcon fontSize="small" />;
      case 'warning':
        return <WarningIcon fontSize="small" />;
      case 'error':
        return <ErrorIcon fontSize="small" />;
      case 'success':
        return <CheckCircleIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      default:
        return 'default';
    }
  };

  const getAudienceLabel = (audience) => {
    switch (audience) {
      case 'all':
        return 'Tất cả';
      case 'member':
        return 'Member';
      case 'staff':
        return 'Staff';
      default:
        return audience;
    }
  };

  // Statistics
  const totalAnnouncements = announcementsData?.pagination?.totalItems || 0;
  const activeAnnouncements = announcementsData?.data?.filter(a => a.isActive).length || 0;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
            Quản lý thông báo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý và giám sát tất cả thông báo trong hệ thống
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #44A08D 0%, #4ECDC4 100%)',
            },
          }}
        >
          Tạo thông báo
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Tổng thông báo
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {totalAnnouncements}
                  </Typography>
                </Box>
                <CampaignIcon sx={{ fontSize: 50, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
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
                    {activeAnnouncements}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 50, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Không hoạt động
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {totalAnnouncements - activeAnnouncements}
                  </Typography>
                </Box>
                <ErrorIcon sx={{ fontSize: 50, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="type-filter-label">Loại thông báo</InputLabel>
              <Select
                labelId="type-filter-label"
                value={typeFilter}
                label="Loại thông báo"
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(0);
                }}
                startAdornment={<FilterListIcon color="action" sx={{ mr: 1 }} />}
              >
                <MenuItem value="">Tất cả loại</MenuItem>
                <MenuItem value="info">Thông tin</MenuItem>
                <MenuItem value="success">Thành công</MenuItem>
                <MenuItem value="warning">Cảnh báo</MenuItem>
                <MenuItem value="error">Lỗi/Khẩn cấp</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="audience-filter-label">Đối tượng</InputLabel>
              <Select
                labelId="audience-filter-label"
                value={audienceFilter}
                label="Đối tượng"
                onChange={(e) => {
                  setAudienceFilter(e.target.value);
                  setPage(0);
                }}
                startAdornment={<FilterListIcon color="action" sx={{ mr: 1 }} />}
              >
                <MenuItem value="">Tất cả đối tượng</MenuItem>
                <MenuItem value="all">Tất cả người dùng</MenuItem>
                <MenuItem value="member">Member</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="active-filter-label">Trạng thái</InputLabel>
              <Select
                labelId="active-filter-label"
                value={isActiveFilter}
                label="Trạng thái"
                onChange={(e) => {
                  setIsActiveFilter(e.target.value);
                  setPage(0);
                }}
                startAdornment={<FilterListIcon color="action" sx={{ mr: 1 }} />}
              >
                <MenuItem value="">Tất cả trạng thái</MenuItem>
                <MenuItem value="true">Đang hoạt động</MenuItem>
                <MenuItem value="false">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#4ECDC4' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>STT</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tiêu đề</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ảnh</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Loại</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Đối tượng</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Lịch hiển thị</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow key="loading">
                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                  <Typography>Đang tải...</Typography>
                </TableCell>
              </TableRow>
            ) : announcementsData?.data?.length === 0 ? (
              <TableRow key="empty">
                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">Không tìm thấy thông báo nào</Typography>
                </TableCell>
              </TableRow>
            ) : (
              announcementsData?.data?.map((announcement, index) => (
                <TableRow
                  key={announcement._id || announcement.id}
                  sx={{
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="600">
                      {page * rowsPerPage + index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">
                      {announcement.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {announcement.image ? (
                      <Box
                        component="img"
                        src={announcement.image}
                        alt={announcement.title}
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Không có ảnh
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getTypeIcon(announcement.type)}
                      label={announcement.type}
                      color={getTypeColor(announcement.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getAudienceLabel(announcement.targetAudience)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={announcement.isActive ? 'Hoạt động' : 'Tắt'}
                      color={announcement.isActive ? 'success' : 'default'}
                      size="small"
                      onClick={() => handleToggleActive(announcement)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      {announcement.startsAt && (
                        <Typography variant="caption" color="text.secondary">
                          📅 {new Date(announcement.startsAt).toLocaleDateString('vi-VN', { 
                            day: '2-digit', 
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      )}
                      {announcement.expiresAt && (
                        <Typography variant="caption" color="error.main">
                          ⏰ {new Date(announcement.expiresAt).toLocaleDateString('vi-VN', { 
                            day: '2-digit', 
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      )}
                      {!announcement.startsAt && !announcement.expiresAt && (
                        <Typography variant="caption" color="text.secondary">
                          Luôn hiển thị
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleView(announcement)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(announcement)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(announcement)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={announcementsData?.pagination?.totalItems || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </TableContainer>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#4ECDC4', color: 'white' }}>
          Chi tiết thông báo
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedAnnouncement && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Tiêu đề:</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedAnnouncement.title}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Nội dung:</Typography>
                <Typography variant="body1">{selectedAnnouncement.message}</Typography>
              </Box>
              {selectedAnnouncement.image && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Ảnh minh họa:
                  </Typography>
                  <Box
                    component="img"
                    src={selectedAnnouncement.image}
                    alt={selectedAnnouncement.title}
                    sx={{
                      width: '100%',
                      maxHeight: 400,
                      objectFit: 'contain',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                </Box>
              )}
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Loại:</Typography>
                <Chip
                  icon={getTypeIcon(selectedAnnouncement.type)}
                  label={selectedAnnouncement.type}
                  color={getTypeColor(selectedAnnouncement.type)}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Đối tượng nhận:</Typography>
                <Chip
                  label={getAudienceLabel(selectedAnnouncement.targetAudience)}
                  size="small"
                  variant="outlined"
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Trạng thái:</Typography>
                <Chip
                  label={selectedAnnouncement.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  color={selectedAnnouncement.isActive ? 'success' : 'default'}
                  size="small"
                />
              </Box>
              {selectedAnnouncement.startsAt && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Thời gian bắt đầu:</Typography>
                  <Typography variant="body1">
                    📅 {new Date(selectedAnnouncement.startsAt).toLocaleString('vi-VN')}
                  </Typography>
                </Box>
              )}
              {selectedAnnouncement.expiresAt && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Thời gian kết thúc:</Typography>
                  <Typography variant="body1" color="error.main">
                    ⏰ {new Date(selectedAnnouncement.expiresAt).toLocaleString('vi-VN')}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Người tạo:</Typography>
                <Typography variant="body1">
                  {selectedAnnouncement.createdBy?.fullName || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Ngày tạo:</Typography>
                <Typography variant="body1">
                  {new Date(selectedAnnouncement.createdAt).toLocaleString('vi-VN')}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa thông báo "{selectedAnnouncement?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Modal */}
      <AnnouncementModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      {/* Edit Modal */}
      <AnnouncementModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={selectedAnnouncement}
      />

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AnnouncementManagement;
