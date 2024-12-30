import CreatePost from "../../components/CreatePost/CreatePost";
import Header from "../../components/Header/Header";
import ProfileContent from "../../components/ProfileContent/ProfileContent";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import ProfileThumbnail from "../../components/ProfileThumbnail/ProfileThumbnail";
import WeatherBar from "../../components/WeatherBar/WeatherBar";
import MainLayout from "../../layout/MainLayout/MainLayout";

function ProfilePage() {
  return (
    <>
      <Header />
      <ProfileThumbnail />
      <MainLayout
        leftSidebar={<ProfileInfo />}
        content={<ProfileContent />}
        rightSidebar={<WeatherBar />}
      />
    </>
  );
}

export default ProfilePage;
