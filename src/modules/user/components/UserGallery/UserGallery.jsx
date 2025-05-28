import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Typography, 
  CircularProgress, 
  ImageListItem, 
  ImageListItemBar, 
  IconButton 
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// Styles
import { 
  LoadingContainer, 
  EmptyContainer, 
  GalleryContainer, 
  StyledImageList,
  ImageItemContainer 
} from './UserGallery.styles';

const UserGallery = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  
  useEffect(() => {
    // Giả lập việc tải dữ liệu
    const timer = setTimeout(() => {
      // Dữ liệu mẫu
      setImages([
        {
          id: '1',
          img: 'https://via.placeholder.com/300x300',
          title: 'Hình ảnh 1',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          img: 'https://via.placeholder.com/400x300',
          title: 'Hình ảnh 2',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          img: 'https://via.placeholder.com/300x400',
          title: 'Hình ảnh 3',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: '4',
          img: 'https://via.placeholder.com/350x350',
          title: 'Hình ảnh 4',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
        },
      ]);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [userId]);
  
  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }
  
  if (images.length === 0) {
    return (
      <EmptyContainer>
        <Typography variant="body1" color="text.secondary">
          Người dùng chưa có hình ảnh nào.
        </Typography>
      </EmptyContainer>
    );
  }
  
  return (
    <GalleryContainer>
      <StyledImageList cols={4} gap={12}>
        {images.map((item) => (
          <ImageListItem key={item.id}>
            <ImageItemContainer>
              <img
                src={item.img}
                alt={item.title}
                loading="lazy"
                style={{ width: '100%', height: 'auto' }}
              />
              <ImageListItemBar
                title={item.title}
                subtitle={new Date(item.createdAt).toLocaleDateString('vi-VN')}
                actionIcon={
                  <IconButton
                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    aria-label={`info about ${item.title}`}
                  >
                    <InfoIcon />
                  </IconButton>
                }
                sx={{ opacity: 0.7, transition: 'opacity 0.3s' }}
              />
            </ImageItemContainer>
          </ImageListItem>
        ))}
      </StyledImageList>
    </GalleryContainer>
  );
};

UserGallery.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserGallery; 