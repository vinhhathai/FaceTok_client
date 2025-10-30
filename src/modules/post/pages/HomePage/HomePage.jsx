import React from 'react';
import Content from "@post/components/Content/Content";
import Header from "@components/Header/Header";
import Sidebar from "@post/components/Sidebar/Sidebar";
import WeatherBar from "@components/WeatherBar";
import MainLayout from "@components/MainLayout/MainLayout";
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
    </HomeContainer>
  );
}

export default HomePage; 