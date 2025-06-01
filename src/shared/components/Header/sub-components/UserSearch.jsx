import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import userApi from '../../../../modules/user/api/userApi';
import UserSearchResults from '../../UserSearchResults';
import {
  SearchContainer,
  SearchIconWrapper,
  StyledInputBase,
  searchContainerInlineStyle
} from '../Header.styles';

// Debounce function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const UserSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const searchContainerRef = useRef(null);
  
  // Debounce search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    // Add event listener only when results are showing
    if (showResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showResults]);

  // Reset pagination when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Fetch search results when debounced query changes or page changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      // Only search if query is not empty
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([]);
        setTotalResults(0);
        setTotalPages(1);
        setSearchLoading(false);
        return;
      }

      // If it's the first page or a new search, show full loading indicator
      // Otherwise, show loading more indicator for subsequent pages
      if (currentPage === 1) {
        setSearchLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        setSearchError(null);
        const response = await userApi.searchUsers(debouncedSearchQuery, { 
          page: currentPage,
          limit: 10 
        });

        if (response && response.success && response.data) {
          // For first page, replace results. For subsequent pages, append
          if (currentPage === 1) {
            setSearchResults(response.data.users || []);
          } else {
            setSearchResults(prev => [...prev, ...(response.data.users || [])]);
          }
          
          // Get pagination data from response
          setTotalResults(response.data.pagination?.totalResults || response.data.users.length || 0);
          setTotalPages(response.data.pagination?.totalPages || 1);
        } else {
          if (currentPage === 1) {
            setSearchResults([]);
          }
          setTotalResults(0);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchError('Không thể tìm kiếm người dùng');
        if (currentPage === 1) {
          setSearchResults([]);
        }
        setTotalResults(0);
        setTotalPages(1);
      } finally {
        setSearchLoading(false);
        setLoadingMore(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery, currentPage]);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Show results when typing
    if (e.target.value.trim()) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Hide results when submitting
      setShowResults(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      setShowResults(true);
    }
  };

  const handleUserSelect = () => {
    setShowResults(false);
    setSearchQuery('');
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <SearchContainer 
      component="form" 
      onSubmit={handleSearchSubmit}
      ref={searchContainerRef}
      sx={searchContainerInlineStyle}
    >
      <SearchIconWrapper>
        <SearchIcon fontSize="small" />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Tìm kiếm người dùng"
        inputProps={{ 'aria-label': 'tìm kiếm' }}
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={handleSearchFocus}
        fullWidth
        autoComplete="off"
      />
      
      {/* Search Results Dropdown */}
      {showResults && (
        <UserSearchResults 
          users={searchResults}
          loading={searchLoading}
          loadingMore={loadingMore}
          error={searchError}
          onSelectUser={handleUserSelect}
          searchQuery={searchQuery}
          totalResults={totalResults}
          hasMore={currentPage < totalPages}
          onLoadMore={handleLoadMore}
        />
      )}
    </SearchContainer>
  );
};

export default UserSearch; 