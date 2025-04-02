import { useState } from "react";
import createIcon from "../../assets/images/icons/navbar/create.png";
import CreateDropdown from "../CreateDropdown/CreateDropdown";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { CreateIconButton, IconAvatar, DropdownContainer } from './styles';

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
          <IconAvatar
            src={createIcon}
            variant="square"
            alt="Create"
          />
        </CreateIconButton>
        
        {showDropdown && <CreateDropdown />}
      </DropdownContainer>
    </ClickAwayListener>
  );
}

export default CreateNavbar;
