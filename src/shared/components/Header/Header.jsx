import React from 'react';
import { Link } from "react-router-dom";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  StyledAppBar,
  StyledToolbar,
  LogoContainer,
  ActionsContainer,
  ActionButtonsContainer,
  LeftSectionContainer,
  logoStyles
} from './Header.styles';
import Logo from '@components/Logo/Logo';
import { UserSearch, NavButtons, UserMenu } from './sub-components/index';

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl" disableGutters={isMobile}>
        <StyledToolbar disableGutters>
          {/* Left section - Logo and Search */}
          <LeftSectionContainer>
            {/* Logo */}
            <LogoContainer>
              <Box component={Link} to="/home" sx={logoStyles}>
                <Logo size={isMobile ? "small" : "small"} showText={true} />
              </Box>
            </LogoContainer>

            {/* Search form */}
            <UserSearch />
          </LeftSectionContainer>

          {/* Actions and user profile */}
          <ActionsContainer>
            {/* Action buttons */}
            <ActionButtonsContainer>
              <NavButtons />
              <UserMenu />
            </ActionButtonsContainer>
          </ActionsContainer>
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
}

export default Header; 