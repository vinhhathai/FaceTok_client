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
    
    // Gọi API tìm kiếm với axios đã cấu hình
    axios.get(`/search/users?query=${encodeURIComponent(searchValue)}`)
      .then(response => {
        if (response.data.users) {
          setDataUser(response.data.users);
        } else {
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
