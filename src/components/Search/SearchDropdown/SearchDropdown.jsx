import React, { useState } from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {
  DropdownPaper,
  DropdownHeader,
  ResultCount,
  CategoryHeader,
  ProfileLink,
  AddFriendButton,
  FooterLink
} from './styles';

function SearchDropdown({ searchResult, avatarFriend1 }) {
  const [requestedMap, setRequestedMap] = useState({});

  const handleAddFriendClick = (index, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const updatedMap = { ...requestedMap };
    updatedMap[index] = !updatedMap[index];
    setRequestedMap(updatedMap);
  };

  return (
    <DropdownPaper elevation={3}>
      <DropdownHeader>
        <Typography variant="subtitle2">
          Search Results
          <ResultCount 
            label={searchResult.length} 
            color="primary" 
            size="small" 
          />
        </Typography>
      </DropdownHeader>
      
      <Box>
        <CategoryHeader variant="subtitle2">People</CategoryHeader>
        <List disablePadding>
          {searchResult.map((item, index) => (
            <ListItem 
              key={index}
              divider
              sx={{ py: 1 }}
            >
              <ProfileLink to={`/profile/detail/${item._id}`}>
                <ListItemAvatar>
                  <Avatar src={avatarFriend1} alt="Search result" />
                </ListItemAvatar>
                <ListItemText 
                  primary={item.fullName || "No search results found"}
                  secondary="6 Mutual friends"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </ProfileLink>
              <AddFriendButton
                variant="contained"
                size="small"
                requested={requestedMap[index]}
                onClick={(event) => handleAddFriendClick(index, event)}
              >
                {requestedMap[index] ? "Requested" : "Add Friend"}
              </AddFriendButton>
            </ListItem>
          ))}
        </List>
      </Box>
      
      <FooterLink to="/search/see-more">
        <Typography variant="body2">See More</Typography>
      </FooterLink>
    </DropdownPaper>
  );
}

export default SearchDropdown;
