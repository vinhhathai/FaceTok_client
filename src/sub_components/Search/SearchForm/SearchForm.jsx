import SearchDropdown from "../SearchDropdown/SearchDropdown";
import { useState } from "react";
import { useDebounce } from "../../../utils/useDebounce";
import useSearchApi from "../../../api/useSearchApi";
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { Search, SearchIconWrapper, StyledInputBase } from './styles';

function SearchForm({ avatarFriend1, avatarFriend2, avatarGroup, isMobile }) {
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const debouncedValue = useDebounce(searchValue, 1000);
  // const { dataUser, loading, error } = useSearchApi(debouncedValue);

  const handleClickAway = () => {
    setSearching(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value.trim() === "" ? null : value);
    setSearching(true);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        <Search isMobile={isMobile}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search for people, groups..."
            inputProps={{ 'aria-label': 'search' }}
            value={searchValue || ""}
            onChange={handleSearchChange}
          />
        </Search>
        
        {/* Uncomment when ready to implement search results */}
        {/* {searching && dataUser.length > 0 && (
          <SearchDropdown
            searchResult={dataUser}
            avatarFriend1={avatarFriend1}
            avatarFriend2={avatarFriend2}
            avatarGroup={avatarGroup}
          />
        )} */}
      </Box>
    </ClickAwayListener>
  );
}

export default SearchForm;
