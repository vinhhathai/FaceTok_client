import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '@user/redux/slices/userSlice';
import { showSuccess, handleApiError } from '@utils';

// Utils
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateForApi = (dateString) => {
  if (!dateString) return null;
  
  // Split the DD/MM/YYYY format into parts
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    
    // Validate day, month, year
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
    }
    
    // Validate ranges
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      return null;
    }
    
    return `${year}-${month}-${day}`;
  }
  
  // If date is already in YYYY-MM-DD format
  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (isoPattern.test(dateString)) {
    return dateString;
  }
  
  // Invalid format
  return null;
};

const formatDateUtils = {
  formatDateForInput,
  formatDateForApi
};

const useProfileForm = (user, isOpen, onClose, onProfileUpdate, vietnamProvinces) => {
  const dispatch = useDispatch();
  
  const [profileForm, setProfileForm] = useState({
    bio: '',
    location: '',
    gender: '',
    birthday: null,
    relationship: '',
  });
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  const [birthdayParts, setBirthdayParts] = useState({
    day: '',
    month: '',
    year: ''
  });
  
  // Update form when user data changes or modal opens
  useEffect(() => {
    if (isOpen && user) {
      const currentLocation = user.location || '';
      // Find the province object that matches the user's current location
      const userProvince = vietnamProvinces.find(p => p.name === currentLocation);
      
      setProfileForm({
        bio: user.bio || '',
        location: userProvince ? userProvince.name : '',
        gender: user.gender || '',
        birthday: user.birthday ? formatDateUtils.formatDateForInput(user.birthday) : '',
        relationship: user.relationship || '',
      });
      
      // Phân tách ngày/tháng/năm từ birthday nếu có
      if (user.birthday) {
        const formattedDate = formatDateUtils.formatDateForInput(user.birthday);
        const parts = formattedDate.split('/');
        if (parts.length === 3) {
          setBirthdayParts({
            day: parts[0],
            month: parts[1],
            year: parts[2]
          });
        }
      } else {
        setBirthdayParts({
          day: '',
          month: '',
          year: ''
        });
      }
    }
  }, [isOpen, user, vietnamProvinces]);
  
  const handleProfileFormChange = (field) => (event) => {
    setProfileForm({
      ...profileForm,
      [field]: event.target.value
    });
  };

  const handleBirthdayChange = (type) => (event) => {
    const value = event.target.value;
    
    // Cập nhật phần tương ứng
    setBirthdayParts(prev => ({
      ...prev,
      [type]: value
    }));
    
    // Cập nhật vào profileForm chỉ khi đủ 3 phần
    const updatedParts = {
      ...birthdayParts,
      [type]: value
    };
    
    if (updatedParts.day && updatedParts.month && updatedParts.year) {
      setProfileForm(prev => ({
        ...prev,
        birthday: `${updatedParts.day}/${updatedParts.month}/${updatedParts.year}`
      }));
    } else {
      // Nếu không đủ 3 phần, set birthday về null
      setProfileForm(prev => ({
        ...prev,
        birthday: null
      }));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdatingProfile(true);
      
      // Clone form data for API submission
      const formattedData = { ...profileForm };
      
      // Validate and convert date format to API format if it exists
      if (formattedData.birthday) {
        const formattedDate = formatDateUtils.formatDateForApi(formattedData.birthday);
        if (!formattedDate) {
          throw new Error('Ngày sinh không đúng định dạng DD/MM/YYYY hoặc không hợp lệ');
        }
        formattedData.birthday = formattedDate;
      }
      
      // Log the data we're sending to API
      console.log("Sending profile data:", formattedData);
      
      // Dispatch action to update user profile
      const resultAction = await dispatch(updateUserProfile(formattedData));
      
      // Check if the operation was successful
      if (updateUserProfile.fulfilled.match(resultAction)) {
        showSuccess('Cập nhật thông tin thành công');
        
        // Call onProfileUpdate callback with updated data
        if (onProfileUpdate) {
          // Đảm bảo rằng các giá trị đã chọn được truyền đi, kể cả giá trị rỗng
          const updatedData = { ...profileForm };
          onProfileUpdate(updatedData);
        }
        
        onClose();
      } else if (updateUserProfile.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload?.message || 'Không thể cập nhật thông tin';
        throw new Error(errorMessage);
      }
    } catch (error) {
      handleApiError(error, error.message || 'Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  return {
    profileForm,
    isUpdatingProfile,
    birthdayParts,
    handleProfileFormChange,
    handleBirthdayChange,
    handleUpdateProfile
  };
};

export default useProfileForm; 