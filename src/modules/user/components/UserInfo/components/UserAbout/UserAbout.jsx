import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, Button, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import { useMediaQuery } from "@mui/material";

// Styles
import {
  IntroContainer,
  IntroHeader,
  IntroTitle,
  IntroItem,
  IntroItemText,
} from "./UserAbout.styles";

const UserAbout = ({ user, displayRelationship, onEditProfile }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [bioExpanded, setBioExpanded] = useState(false);
  
  const isOwner = user?.isOwner || false;
  
  // Format relationship status
  const formatRelationship = (relationship) => {
    console.log('Formatting relationship value:', relationship);
    
    switch(relationship) {
      case 'single': return 'Độc thân';
      case 'relationship': return 'Đang trong mối quan hệ';
      case 'married': return 'Đã kết hôn';
      case '': return 'Không xác định';
      default: return 'Không xác định';
    }
  };
  
  // Handle bio expansion toggle
  const handleToggleBio = () => {
    setBioExpanded(!bioExpanded);
  };
  
  return (
    <IntroContainer>
      <IntroHeader>
        <IntroTitle sx={{ 
          ...(isMobile && {
            fontSize: '1.1rem',
            fontWeight: 600,
            marginBottom: 1
          })
        }}>
          Giới thiệu
        </IntroTitle>
      </IntroHeader>

      {user.bio && (
        <Box sx={{ 
          width: '100%',
          ...(isMobile && {
            px: 1
          })
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              py: 1, 
              px: 1,
              textAlign: "center",
              display: '-webkit-box',
              WebkitLineClamp: bioExpanded ? 'unset' : 2,
              WebkitBoxOrient: 'vertical',
              overflow: bioExpanded ? 'visible' : 'hidden',
              wordBreak: 'break-word',
              maxWidth: '100%',
              ...(isMobile && {
                fontSize: '0.9rem',
                lineHeight: 1.5
              })
            }}
          >
            {user.bio}
          </Typography>
          
          {user.bio.length > 50 && (
            <Button 
              onClick={handleToggleBio}
              size="small"
              color="primary"
              sx={{ 
                fontSize: '0.75rem', 
                textTransform: 'none',
                display: 'block',
                margin: '0 auto',
                padding: '0px 8px',
                minWidth: 'auto',
                mb: 1,
              }}
            >
              {bioExpanded ? 'Thu gọn' : 'Xem thêm'}
            </Button>
          )}
        </Box>
      )}

      <Divider sx={{ my: 1 }} />

      {/* Always display relationship status */}
      <IntroItem sx={{ ...(isMobile && { mb: 1.5 }) }}>
        <FavoriteIcon fontSize="small" color="error" />
        <IntroItemText>
          {formatRelationship(displayRelationship)}
        </IntroItemText>
      </IntroItem>

      {user.gender && (
        <IntroItem sx={{ ...(isMobile && { mb: 1.5 }) }}>
          <Typography variant="body2" component="span">👤</Typography>
          <IntroItemText>
            {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}
          </IntroItemText>
        </IntroItem>
      )}

      {user.location && (
        <IntroItem sx={{ ...(isMobile && { mb: 1.5 }) }}>
          <LocationOnIcon fontSize="small" />
          <IntroItemText>{user.location}</IntroItemText>
        </IntroItem>
      )}

      {/* Education field not yet in API */}
      {user.education && (
        <IntroItem sx={{ ...(isMobile && { mb: 1.5 }) }}>
          <SchoolIcon fontSize="small" />
          <IntroItemText>{user.education}</IntroItemText>
        </IntroItem>
      )}

      {/* Work field not yet in API */}
      {user.work && (
        <IntroItem sx={{ ...(isMobile && { mb: 1.5 }) }}>
          <WorkIcon fontSize="small" />
          <IntroItemText>{user.work}</IntroItemText>
        </IntroItem>
      )}

      {user.birthday && (
        <IntroItem sx={{ ...(isMobile && { mb: 1.5 }) }}>
          <Typography variant="body2" component="span">🎂</Typography>
          <IntroItemText>
            {new Date(user.birthday).toLocaleDateString('vi-VN')}
          </IntroItemText>
        </IntroItem>
      )}
      
      {(user.createdAt) && (
        <IntroItem sx={{ ...(isMobile && { mb: 1.5 }) }}>
          <Typography variant="body2" component="span">📅</Typography>
          <IntroItemText>
            Tham gia ngày {new Date(user.createdAt).toLocaleDateString('vi-VN')}
          </IntroItemText>
        </IntroItem>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography
          variant="body2"
          sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            mb: 1,
            ...(isMobile && {
              fontSize: '0.85rem'
            })
          }}
        >
         {
          isOwner ? (
            <>
              <span>Email</span>
              <strong>{user.email}</strong>
            </>
          ) : (
            <span>{""}</span>
          )}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Edit button shown based on ownership */}
      {isOwner && !isMobile && (
        <Button
          variant="contained"
          fullWidth
          startIcon={<EditIcon />}
          onClick={onEditProfile}
          size="medium"
        >
          Chỉnh sửa
        </Button>
      )}
    </IntroContainer>
  );
};

UserAbout.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    fullName: PropTypes.string,
    bio: PropTypes.string,
    location: PropTypes.string,
    gender: PropTypes.string,
    education: PropTypes.string,
    work: PropTypes.string,
    birthday: PropTypes.string,
    createdAt: PropTypes.string,
    email: PropTypes.string,
    isOwner: PropTypes.bool,
  }).isRequired,
  displayRelationship: PropTypes.string,
  onEditProfile: PropTypes.func.isRequired,
};

export default UserAbout; 