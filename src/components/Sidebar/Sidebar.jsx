import message from "../../assets/images/icons/left-sidebar/message.png";
import group from "../../assets/images/icons/left-sidebar/group.png";
import findFriend from "../../assets/images/icons/left-sidebar/find-friends.png";
import { ListItemText } from '@mui/material'; // Keep only necessary direct imports
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  SidebarContainer,
  SidebarCard,
  SidebarList,
  HomeListItem,
  HomeTypography,
  ItemListItem,
  ItemListItemButton,
  ItemListItemIcon,
  ItemIconImage,
  StyledBadge
} from './styles';

// Example list items
const sidebarItems = [
  { text: 'Messages', icon: message, count: 2, href: 'messages.html' },
  { text: 'Groups', icon: group, count: 17, href: 'groups.html' },
  { text: 'Find Friends', icon: findFriend, href: 'find-friends.html' },
];

function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarCard>
        <SidebarList>
          <HomeListItem disablePadding>
            <HomeTypography variant="subtitle1">Home</HomeTypography>
          </HomeListItem>

          {sidebarItems.map((item, index) => (
            <ItemListItem key={index} disablePadding>
              <ItemListItemButton 
                component="a" 
                href={item.href}
              >
                <ItemListItemIcon>
                  <ItemIconImage src={item.icon} alt={item.text} />
                </ItemListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: 1 }} />
                {item.count !== undefined ? (
                  <StyledBadge badgeContent={item.count} />
                ) : (
                  item.text === 'Find Friends' && <ChevronRightIcon color="action" />
                )}
              </ItemListItemButton>
            </ItemListItem>
          ))}
        </SidebarList>
      </SidebarCard>
    </SidebarContainer>
  );
}

export default Sidebar;
