import SearchDropdown from "../SearchDropdown/SearchDropdown";
import { useState } from "react";
import { useDebounce } from "../../../utils/useDebounce";
import useSearchApi from "../../../api/useSearchApi";
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CircularProgress from '@mui/material/CircularProgress';
import { Search, SearchIconWrapper, StyledInputBase } from './styles';

function SearchForm({ isMobile }) {
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const { dataUser, loading, error } = useSearchApi(debouncedValue);

  const handleClickAway = () => {
    setSearching(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.trim() !== '') {
      setSearching(true);
    }
  };

  const handleInputFocus = () => {
    if (searchValue.trim() !== '') {
      setSearching(true);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        <Search isMobile={isMobile}>
          <SearchIconWrapper>
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SearchIcon />
            )}
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search for people..."
            inputProps={{ 'aria-label': 'search' }}
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
          />
        </Search>
        
        {searching && searchValue.trim() !== '' && (
          <SearchDropdown
            searchResult={dataUser}
            loading={loading}
            error={error}
          />
        )}
      </Box>
    </ClickAwayListener>
  );
}

export default SearchForm;
