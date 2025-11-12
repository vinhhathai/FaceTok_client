import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Checkbox,
  FormControlLabel,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Gavel as GavelIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { termsOfService } from '../../data/termsOfService';
import { privacyPolicy } from '../../data/privacyPolicy';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const TermsAndPrivacyDialog = ({ open, onClose, onAccept, requireAcceptance = true }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAccept = () => {
    if (requireAcceptance && !accepted) {
      return;
    }
    onAccept();
    onClose();
  };

  const handleClose = () => {
    if (!requireAcceptance) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 0,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Điều Khoản & Chính Sách
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            Vui lòng đọc kỹ trước khi sử dụng Chaotok
          </Typography>
        </Box>
        {!requireAcceptance && (
          <IconButton
            onClick={handleClose}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
            },
          }}
        >
          <Tab
            icon={<GavelIcon />}
            iconPosition="start"
            label="Điều Khoản Dịch Vụ"
          />
          <Tab
            icon={<SecurityIcon />}
            iconPosition="start"
            label="Chính Sách Bảo Mật"
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ px: 3 }}>
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Phiên bản {termsOfService.version} - Cập nhật lần cuối: {termsOfService.lastUpdated}
            </Typography>
          </Box>
          {termsOfService.sections.map((section, index) => (
            <Box key={section.id} sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#4ECDC4',
                  fontWeight: 'bold',
                  mb: 1,
                }}
              >
                {section.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-line',
                  lineHeight: 1.8,
                  color: 'text.secondary',
                }}
              >
                {section.content}
              </Typography>
              {index < termsOfService.sections.length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}
            </Box>
          ))}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Phiên bản {privacyPolicy.version} - Cập nhật lần cuối: {privacyPolicy.lastUpdated}
            </Typography>
          </Box>
          {privacyPolicy.sections.map((section, index) => (
            <Box key={section.id} sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#4ECDC4',
                  fontWeight: 'bold',
                  mb: 1,
                }}
              >
                {section.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-line',
                  lineHeight: 1.8,
                  color: 'text.secondary',
                }}
              >
                {section.content}
              </Typography>
              {index < privacyPolicy.sections.length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}
            </Box>
          ))}
        </TabPanel>

        {requireAcceptance && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  sx={{
                    color: '#4ECDC4',
                    '&.Mui-checked': {
                      color: '#4ECDC4',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  Tôi đã đọc và đồng ý với <strong>Điều khoản Dịch vụ</strong> và{' '}
                  <strong>Chính sách Bảo mật</strong> của Chaotok
                </Typography>
              }
            />
            {!accepted && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Bạn cần chấp nhận điều khoản để tiếp tục sử dụng Chaotok
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {!requireAcceptance ? (
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 4,
              background: 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #3AB0A8 0%, #2E8B82 100%)',
              },
            }}
          >
            Đóng
          </Button>
        ) : (
          <Button
            onClick={handleAccept}
            variant="contained"
            disabled={!accepted}
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              background: accepted
                ? 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)'
                : 'grey',
              '&:hover': {
                background: accepted
                  ? 'linear-gradient(135deg, #3AB0A8 0%, #2E8B82 100%)'
                  : 'grey',
              },
              '&.Mui-disabled': {
                background: '#e0e0e0',
                color: '#9e9e9e',
              },
            }}
          >
            Chấp Nhận & Tiếp Tục
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TermsAndPrivacyDialog;
