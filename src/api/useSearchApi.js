import { useEffect, useState } from 'react';
import axios from 'axios';

function useSearchApi(searchValue) {
  const [dataUser, setDataUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:9999/search-user?username=${encodeURIComponent(searchValue)}`)
      .then(response => {
        if (response.data.users.length > 0) {
          setDataUser(response.data.users);
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [searchValue]);

  return { dataUser, loading, error };
}

export default useSearchApi;
