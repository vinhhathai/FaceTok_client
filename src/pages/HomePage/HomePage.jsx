import React from 'react';
import Content from "../../components/Content/Content";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import WeatherBar from "../../components/WeatherBar/WeatherBar";
import MainLayout from "../../layout/MainLayout/MainLayout";
import CreateGroupModal from "../../components/Create/CreateGroupModal/CreateGroupModal";
import { HomeContainer } from './styles';

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
