import { useEffect, useState, useCallback } from "react";
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

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true); // Start loading
      const data = await getProfileApi(id);
      setProfile(data.data); // Dữ liệu trả về từ API
      setError(null); // Clear previous error
    } catch (err) {
      setError(err.message || "Unable to fetch profile");
      setProfile(null); // Clear profile on error
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <>
      <Header />
      <MainLayout
        thumbnail={<ProfileThumbnail userId={id}/>}
        leftSidebar={
          <ProfileInfo 
            profile={profile} 
            loading={loading} 
            error={error} 
            refreshProfile={fetchProfile} 
          />
        }
        content={<ProfileContent profile={profile} loading={loading} error={error} />}
        rightSidebar={<WeatherBar />}
      />
    </>
  );
}

export default ProfilePage;
