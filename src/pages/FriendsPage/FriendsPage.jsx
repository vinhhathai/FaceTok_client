import React from 'react';
import { Typography } from '@mui/material';
import FriendsList from '../../components/FriendsList/FriendsList';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import WeatherBar from '../../components/WeatherBar/WeatherBar';
import MainLayout from '../../layout/MainLayout/MainLayout';
import { FriendsPaper, FriendsHeader } from './styles';

const FriendsPage = () => {
  const friendsContent = (
    <FriendsPaper elevation={3}>
      <FriendsHeader>
        <Typography variant="h5" component="h1" gutterBottom>
          Friends
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your friends and requests
        </Typography>
      </FriendsHeader>
      
      <FriendsList />
    </FriendsPaper>
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