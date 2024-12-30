import CreatePost from "../../components/CreatePost/CreatePost";
import Header from "../../components/Header/Header";
import ProfileContent from "../../components/ProfileContent/ProfileContent";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import ProfileThumbnail from "../../components/ProfileThumbnail/ProfileThumbnail";
import WeatherBar from "../../components/WeatherBar/WeatherBar";
import MainLayout from "../../layout/MainLayout/MainLayout";

import { useParams } from 'react-router-dom';  // Để lấy tham số từ URL


function ProfilePage() {
    // Lấy userId từ URL
    const { id } = useParams();
  return (
    <>
      <Header />
      <ProfileThumbnail />
      <MainLayout
        leftSidebar={<ProfileInfo id={id}/>}
        content={<ProfileContent />}
        rightSidebar={<WeatherBar />}
      />
    </>
  );
}

export default ProfilePage;
