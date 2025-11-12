import React, { useState } from 'react';
import { Box, Typography, Link } from '@mui/material';
import TermsAndPrivacyDialog from '../TermsAndPrivacyDialog';

const TermsPrivacyFooter = ({ sx = {} }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenTerms = () => {
    setDialogOpen(true);
  };

  const handleOpenPrivacy = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          py: 2,
          px: 3,
          flexWrap: 'wrap',
          ...sx,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © 2025 Chaotok. All rights reserved.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link
            component="button"
            variant="caption"
            onClick={handleOpenTerms}
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: '#4ECDC4',
                textDecoration: 'underline',
              },
            }}
          >
            Điều khoản Dịch vụ
          </Link>
          <Typography variant="caption" color="text.secondary">
            •
          </Typography>
          <Link
            component="button"
            variant="caption"
            onClick={handleOpenPrivacy}
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: '#4ECDC4',
                textDecoration: 'underline',
              },
            }}
          >
            Chính sách Bảo mật
          </Link>
        </Box>
      </Box>

      <TermsAndPrivacyDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAccept={() => setDialogOpen(false)}
        requireAcceptance={false}
      />
    </>
  );
};

export default TermsPrivacyFooter;
