import { useEffect, useState } from "react";
import CreatePost from "../../components/CreatePost/CreatePost";
import Header from "../../components/Header/Header";
import ProfileContent from "../../components/ProfileContent/ProfileContent";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import ProfileThumbnail from "../../components/ProfileThumbnail/ProfileThumbnail";
import WeatherBar from "../../components/WeatherBar/WeatherBar";
import MainLayout from "../../layout/MainLayout/MainLayout";

import { useParams } from "react-router-dom"; // Để lấy tham số từ URL
import getProfileApi from "../../api/getProfileApi";

function ProfilePage() {
  // Lấy userId từ URL
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileApi(id);
        setProfile(data.data); // Dữ liệu trả về từ API
        setLoading(false);
      } catch (err) {
        setError(err.message || "Unable to fetch profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  return (
    <>
      <Header
      />
      <ProfileThumbnail />
      <MainLayout
        leftSidebar={
          <ProfileInfo profile={profile} loading={loading} error={error} />
        }
        content={<ProfileContent />}
        rightSidebar={<WeatherBar />}
      />
    </>
  );
}

export default ProfilePage;
