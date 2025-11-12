import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Stack,
  Tooltip,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  BugReport as BugReportIcon,
  Flag as FlagIcon,
  Person as PersonIcon,
  Help as HelpIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  OpenInNew as OpenInNewIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  useGetAllReportsQuery,
  useGetReportStatisticsQuery,
  useUpdateReportStatusMutation,
  useDeleteReportMutation,
} from '../../api/administratorAPI';

const ReportManagement = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');

  // Queries
  const {
    data: reportsData,
    isLoading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useGetAllReportsQuery({
    page: page + 1,
    limit: rowsPerPage,
    status: statusFilter,
    reportType: typeFilter,
  });

  const {
    data: statistics,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetReportStatisticsQuery();

  // Mutations
  const [updateReportStatus, { isLoading: updating }] = useUpdateReportStatusMutation();
  const [deleteReport, { isLoading: deleting }] = useDeleteReportMutation();

  const reports = reportsData?.data || [];
  const totalReports = reportsData?.total || 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleUpdateStatusClick = (report) => {
    setSelectedReport(report);
    setUpdateStatus(report.status);
    setAdminNote(report.adminNote || '');
    setUpdateDialogOpen(true);
  };

  const handleDeleteClick = (report) => {
    setSelectedReport(report);
    setDeleteDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await updateReportStatus({
        id: selectedReport._id,
        status: updateStatus,
        adminNote,
      }).unwrap();
      setUpdateDialogOpen(false);
      refetchReports();
      refetchStats();
    } catch (error) {
      console.error('Failed to update report:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReport(selectedReport._id).unwrap();
      setDeleteDialogOpen(false);
      refetchReports();
      refetchStats();
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  };

  const handleGoToPost = (postId) => {
    if (postId) {
      // Open post in new tab
      window.open(`/post/${postId}`, '_blank');
    }
  };

  const handleGoToUser = (userId) => {
    if (userId) {
      // Navigate to user profile
      navigate(`/profile/${userId}`);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bug':
        return <BugReportIcon fontSize="small" />;
      case 'post':
        return <FlagIcon fontSize="small" />;
      case 'user':
        return <PersonIcon fontSize="small" />;
      default:
        return <HelpIcon fontSize="small" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'bug':
        return 'error';
      case 'post':
        return 'warning';
      case 'user':
        return 'info';
      default:
        return 'default';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'bug':
        return 'Lỗi Hệ Thống';
      case 'post':
        return 'Bài Viết';
      case 'user':
        return 'Người Dùng';
      default:
        return 'Khác';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'reviewing':
        return 'info';
      case 'resolved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ Xử Lý';
      case 'reviewing':
        return 'Đang Xem Xét';
      case 'resolved':
        return 'Đã Giải Quyết';
      case 'rejected':
        return 'Từ Chối';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon fontSize="small" />;
      case 'reviewing':
        return <RemoveRedEyeIcon fontSize="small" />;
      case 'resolved':
        return <CheckCircleIcon fontSize="small" />;
      case 'rejected':
        return <CancelIcon fontSize="small" />;
      default:
        return null;
    }
  };

  if (reportsLoading || statsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (reportsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Có lỗi xảy ra khi tải dữ liệu báo cáo. Vui lòng thử lại sau.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Tổng Báo Cáo
                  </Typography>
                  <Typography variant="h4">
                    {statistics?.total || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <TrendingUpIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Chờ Xử Lý
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {statistics?.byStatus?.pending || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <PendingIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Đang Xem Xét
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {statistics?.byStatus?.reviewing || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <RemoveRedEyeIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Đã Giải Quyết
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {statistics?.byStatus?.resolved || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircleIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            Quản Lý Báo Cáo
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={() => {
              refetchReports();
              refetchStats();
            }}
          >
            Làm Mới
          </Button>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng Thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                label="Trạng Thái"
              >
                <MenuItem value="">Tất Cả</MenuItem>
                <MenuItem value="pending">Chờ Xử Lý</MenuItem>
                <MenuItem value="reviewing">Đang Xem Xét</MenuItem>
                <MenuItem value="resolved">Đã Giải Quyết</MenuItem>
                <MenuItem value="rejected">Từ Chối</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Loại Báo Cáo</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(0);
                }}
                label="Loại Báo Cáo"
              >
                <MenuItem value="">Tất Cả</MenuItem>
                <MenuItem value="bug">Lỗi Hệ Thống</MenuItem>
                <MenuItem value="post">Bài Viết</MenuItem>
                <MenuItem value="user">Người Dùng</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="60">STT</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Tiêu Đề</TableCell>
                <TableCell>Người Báo Cáo</TableCell>
                <TableCell>Liên Quan</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Ngày Tạo</TableCell>
                <TableCell align="center">Thao Tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report, index) => (
                <TableRow key={report._id} hover>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {page * rowsPerPage + index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getTypeIcon(report.reportType)}
                      label={getTypeLabel(report.reportType)}
                      color={getTypeColor(report.reportType)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 300 }} noWrap>
                      {report.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {report.reportedBy?.fullName || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {report.reportedBy?.email || ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {report.relatedPostId && (
                      <Tooltip title="Xem bài viết">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleGoToPost(report.relatedPostId)}
                        >
                          <ArticleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {report.relatedUserId && (
                      <Tooltip title="Xem người dùng">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleGoToUser(report.relatedUserId)}
                        >
                          <PersonIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {!report.relatedPostId && !report.relatedUserId && (
                      <Typography variant="caption" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(report.status)}
                      label={getStatusLabel(report.status)}
                      color={getStatusColor(report.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(report.createdAt), 'dd/MM/yyyy', { locale: vi })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(report.createdAt), 'HH:mm', { locale: vi })}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xem Chi Tiết">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleViewReport(report)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cập Nhật Trạng Thái">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleUpdateStatusClick(report)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(report)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      Không có báo cáo nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalReports}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi Tiết Báo Cáo
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Loại Báo Cáo
                </Typography>
                <Chip
                  icon={getTypeIcon(selectedReport.reportType)}
                  label={getTypeLabel(selectedReport.reportType)}
                  color={getTypeColor(selectedReport.reportType)}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Tiêu Đề
                </Typography>
                <Typography variant="body1">{selectedReport.title}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Mô Tả
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedReport.description}
                </Typography>
              </Box>

              {/* Related Entity Links */}
              {(selectedReport.relatedPostId || selectedReport.relatedUserId) && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Liên Quan Đến
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {selectedReport.relatedPostId && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ArticleIcon />}
                        endIcon={<OpenInNewIcon />}
                        onClick={() => handleGoToPost(selectedReport.relatedPostId)}
                      >
                        Xem Bài Viết
                      </Button>
                    )}
                    {selectedReport.relatedUserId && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PersonIcon />}
                        endIcon={<OpenInNewIcon />}
                        onClick={() => handleGoToUser(selectedReport.relatedUserId)}
                      >
                        Xem Người Dùng
                      </Button>
                    )}
                  </Stack>
                </Box>
              )}

              {selectedReport.image && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Ảnh Minh Chứng
                  </Typography>
                  <img
                    src={selectedReport.image}
                    alt="Report evidence"
                    style={{
                      width: '100%',
                      maxHeight: 400,
                      objectFit: 'contain',
                      borderRadius: 8,
                      border: '1px solid #e0e0e0',
                    }}
                  />
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Người Báo Cáo
                </Typography>
                <Typography variant="body1">
                  {selectedReport.reportedBy?.fullName || 'N/A'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedReport.reportedBy?.email || ''}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Trạng Thái
                </Typography>
                <Chip
                  icon={getStatusIcon(selectedReport.status)}
                  label={getStatusLabel(selectedReport.status)}
                  color={getStatusColor(selectedReport.status)}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>

              {selectedReport.adminNote && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ghi Chú Quản Trị
                  </Typography>
                  <Typography variant="body1">{selectedReport.adminNote}</Typography>
                </Box>
              )}

              {selectedReport.resolvedBy && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Người Xử Lý
                  </Typography>
                  <Typography variant="body1">
                    {selectedReport.resolvedBy?.fullName || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedReport.resolvedAt
                      ? format(new Date(selectedReport.resolvedAt), 'dd/MM/yyyy HH:mm', { locale: vi })
                      : ''}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Ngày Tạo
                </Typography>
                <Typography variant="body1">
                  {format(new Date(selectedReport.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cập Nhật Trạng Thái Báo Cáo</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Trạng Thái</InputLabel>
              <Select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                label="Trạng Thái"
              >
                <MenuItem value="pending">Chờ Xử Lý</MenuItem>
                <MenuItem value="reviewing">Đang Xem Xét</MenuItem>
                <MenuItem value="resolved">Đã Giải Quyết</MenuItem>
                <MenuItem value="rejected">Từ Chối</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Ghi Chú Quản Trị"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              multiline
              rows={4}
              placeholder="Thêm ghi chú về cách xử lý báo cáo..."
              inputProps={{ maxLength: 500 }}
              helperText={`${adminNote.length}/500 ký tự`}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)} disabled={updating}>
            Hủy
          </Button>
          <Button onClick={handleUpdateStatus} variant="contained" disabled={updating}>
            {updating ? 'Đang Cập Nhật...' : 'Cập Nhật'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa báo cáo này? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Đang Xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportManagement;
