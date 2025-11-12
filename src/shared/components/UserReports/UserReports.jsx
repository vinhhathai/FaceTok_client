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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  BugReport as BugReportIcon,
  Flag as FlagIcon,
  Person as PersonIcon,
  Help as HelpIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useGetUserReportsQuery } from '../../administrator/api/administratorAPI';

const UserReports = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const {
    data: reportsData,
    isLoading,
    error,
    refetch,
  } = useGetUserReportsQuery({
    page: page + 1,
    limit: rowsPerPage,
    status: statusFilter,
  });

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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
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
      <Paper sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            Báo Cáo Của Tôi
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
          >
            Làm Mới
          </Button>
        </Box>

        {/* Filter */}
        <Box sx={{ mb: 2, maxWidth: 250 }}>
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
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Loại</TableCell>
                <TableCell>Tiêu Đề</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Ngày Gửi</TableCell>
                <TableCell align="center">Chi Tiết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report._id} hover>
                  <TableCell>
                    <Chip
                      icon={getTypeIcon(report.reportType)}
                      label={getTypeLabel(report.reportType)}
                      color={getTypeColor(report.reportType)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 400 }} noWrap>
                      {report.title}
                    </Typography>
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
                        color="primary"
                        onClick={() => handleViewReport(report)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      Bạn chưa gửi báo cáo nào
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
                    Phản Hồi Từ Quản Trị Viên
                  </Typography>
                  <Alert severity="info" sx={{ mt: 1 }}>
                    {selectedReport.adminNote}
                  </Alert>
                </Box>
              )}

              {selectedReport.resolvedAt && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ngày Xử Lý
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(selectedReport.resolvedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Ngày Gửi
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
    </Box>
  );
};

export default UserReports;
