import React, { useState, useEffect } from 'react';
import Content from "@post/components/Content/Content";
import Header from "@components/Header/Header";
import Sidebar from "@post/components/Sidebar/Sidebar";
import WeatherBar from "@components/WeatherBar";
import MainLayout from "@components/MainLayout/MainLayout";
import AnnouncementViewer from "../../../../shared/components/AnnouncementViewer";
import FloatingPetals from "../../../../shared/components/FloatingPetals";
import { useGetActiveAnnouncementsQuery } from "../../../../shared/api/announcementAPI";
import { HomeContainer } from './HomePage.styles';

function HomePage() {
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [hasShownAnnouncements, setHasShownAnnouncements] = useState(false);
  const [showPetals, setShowPetals] = useState(false);
  
  // Fetch active announcements
  const { data: announcements, isSuccess } = useGetActiveAnnouncementsQuery();

  // Show petals and announcements after successful login (only once per session)
  useEffect(() => {
    // Check if this is a fresh login (not a page refresh)
    const isNewLogin = sessionStorage.getItem('isNewLogin') === 'true';
    
    if (isNewLogin && !hasShownAnnouncements) {
      // Always show petals on login
      setShowPetals(true);
      
      // Show announcements if available
      if (isSuccess && announcements && announcements.length > 0) {
        setShowAnnouncements(true);
      }
      
      setHasShownAnnouncements(true);
      // Clear the flag
      sessionStorage.removeItem('isNewLogin');
    }
  }, [isSuccess, announcements, hasShownAnnouncements]);

  const handleCloseAnnouncements = () => {
    setShowAnnouncements(false);
  };

  return (
    <HomeContainer>
      <Header />
      <MainLayout 
        leftSidebar={<Sidebar/>} 
        content={<Content/>} 
        rightSidebar={<WeatherBar/>}
      />
      
      {/* Floating Petals Effect - shown on first login */}
      {showPetals && <FloatingPetals duration={8000} count={60} />}
      
      {/* Announcement Viewer Modal */}
      <AnnouncementViewer
        announcements={announcements || []}
        open={showAnnouncements}
        onClose={handleCloseAnnouncements}
      />
    </HomeContainer>
  );
}

export default HomePage; 