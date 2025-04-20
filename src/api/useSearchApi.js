import { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';

function useSearchApi(searchValue) {
  const [dataUser, setDataUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Nếu không có giá trị tìm kiếm hoặc giá trị tìm kiếm rỗng, không gọi API
    if (!searchValue || searchValue.trim() === '') {
      setDataUser([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    console.log('Searching for:', searchValue);
    
    // Gọi API tìm kiếm với axios đã cấu hình - Sử dụng GET thay vì POST
    axios.get(`/user/search?query=${encodeURIComponent(searchValue)}&page=1&limit=20`)
      .then(response => {
        console.log('Search API response:', response.data);
        
        if (response.data.data && response.data.data.users) {
          console.log('Using new response structure with data.users');
          setDataUser(response.data.data.users);
        } else if (response.data.users) {
          console.log('Using response structure with users directly');
          setDataUser(response.data.users);
        } else {
          console.log('No users found in response');
          setDataUser([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Search error:', error);
        setError(error.response?.data?.message || 'Error searching users');
        setDataUser([]);
        setLoading(false);
      });
  }, [searchValue]);

  return { dataUser, loading, error };
}

export default useSearchApi;
