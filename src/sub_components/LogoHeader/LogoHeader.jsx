import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { LogoImage, LogoLink } from './styles';

function LogoHeader() {
  return (
    <Box component="div">
      <LogoLink to="/">
        <LogoImage
          src="/assets/images/FaceTokIcon.jpeg"
          alt="Logo"
        />
      </LogoLink>
    </Box>
  );
}

export default LogoHeader;
