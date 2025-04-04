import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import FriendsList from '../../components/FriendsList/FriendsList';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import WeatherBar from '../../components/WeatherBar/WeatherBar';
import MainLayout from '../../layout/MainLayout/MainLayout';

const FriendsPage = () => {
  const friendsContent = (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 3
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Friends
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your friends and requests
        </Typography>
      </Box>
      
      <FriendsList />
    </Paper>
  );

  return (
    <>
      <Header />
      <MainLayout 
        leftSidebar={<Sidebar />} 
        content={friendsContent} 
        rightSidebar={<WeatherBar />}
      />
    </>
  );
};

export default FriendsPage; 