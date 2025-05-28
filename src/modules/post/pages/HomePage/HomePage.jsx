import React from 'react';
import Content from "../../components/Content/Content";
import Header from "../../../../shared/components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import WeatherBar from "../../../../shared/components/WeatherBar";
import MainLayout from "../../../../shared/components/MainLayout/MainLayout";
import CreateGroupModal from "../../../../shared/components/Create/CreateGroupModal/CreateGroupModal";
import { HomeContainer } from './HomePage.styles';

function HomePage() {
  return (
    <HomeContainer>
      <Header />
      <MainLayout 
        leftSidebar={<Sidebar/>} 
        content={<Content/>} 
        rightSidebar={<WeatherBar/>}
      />
      <CreateGroupModal />
    </HomeContainer>
  );
}

export default HomePage; 