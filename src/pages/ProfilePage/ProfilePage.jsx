import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import ProfileContent from "../../components/ProfileContent/ProfileContent";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import ProfileThumbnail from "../../components/ProfileThumbnail/ProfileThumbnail";
import WeatherBar from "../../components/WeatherBar/WeatherBar";
import MainLayout from "../../layout/MainLayout/MainLayout";
import getProfileApi from "../../api/getProfileApi";
import { ProfileContainer } from "./styles";

function ProfilePage() {
  // Lấy userId từ URL
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get current user to check if viewing own profile
  const currentUser = useSelector(state => state.user.user);
  const isOwnProfile = currentUser && id && currentUser._id === id;

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true); // Start loading
      console.log("Fetching profile for user ID:", id);
      const data = await getProfileApi(id);
      console.log("Profile data received:", data);
      
      // API đã được cập nhật để trả về data trực tiếp (không còn data.data)
      setProfile(data); 
      setError(null); // Clear previous error
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message || "Unable to fetch profile");
      setProfile(null); // Clear profile on error
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [fetchProfile, id]);

  return (
    <ProfileContainer>
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
    </ProfileContainer>
  );
}

export default ProfilePage;
