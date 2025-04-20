import { useState } from "react";
import CreateDropdown from "../CreateDropdown/CreateDropdown";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { CreateIconButton, DropdownContainer } from './styles';

function CreateNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <DropdownContainer>
        <CreateIconButton
          color="inherit"
          aria-label="create"
          onClick={handleClick}
        >
          <AddBoxOutlinedIcon sx={{ fontSize: 28, color: '#616161' }} />
        </CreateIconButton>
        
        {showDropdown && <CreateDropdown />}
      </DropdownContainer>
    </ClickAwayListener>
  );
}

export default CreateNavbar;
