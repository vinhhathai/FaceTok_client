import { useState } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CreatePost from "../CreatingPost/CreatingPost";

import {
  ProfileContentContainer,
  NavigationTabs,
  StyledTab,
  ContentWrapper,
  TabPanel
} from './styles';

function TabPanelContent(props) {
  const { children, value, index, ...other } = props;

  return (
    <TabPanel
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </TabPanel>
  );
}

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

function ProfileContent() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ProfileContentContainer>
      {/* CreatePost component */}
      <CreatePost />
      
      {/* Tabs Navigation */}
      <NavigationTabs
        value={value}
        onChange={handleChange}
        aria-label="profile navigation tabs"
        variant="fullWidth"
      >
        <StyledTab label="Timeline" {...a11yProps(0)} />
        <StyledTab label="About" {...a11yProps(1)} />
        <StyledTab label="Friends" {...a11yProps(2)} />
        <StyledTab label="Media" {...a11yProps(3)} />
      </NavigationTabs>

      {/* Tab Content */}
      <ContentWrapper>
        <TabPanelContent value={value} index={0}>
          <Typography variant="body1">Timeline content here...</Typography>
        </TabPanelContent>
        
        <TabPanelContent value={value} index={1}>
          <Typography variant="body1">About content here...</Typography>
        </TabPanelContent>
        
        <TabPanelContent value={value} index={2}>
          <Typography variant="body1">Friends content here...</Typography>
        </TabPanelContent>
        
        <TabPanelContent value={value} index={3}>
          <Typography variant="body1">Media content here...</Typography>
        </TabPanelContent>
      </ContentWrapper>
    </ProfileContentContainer>
  );
}

export default ProfileContent;
