import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { renameGroup as renameGroupAPI } from '../../api/messageAPI';
import useMessageSocket from '../../hooks/useMessageSocket';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  ExitToApp as ExitIcon,
  PersonRemove as PersonRemoveIcon,
  AdminPanelSettings as CrownIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';

const GroupSidebar = ({ open, onClose, conversation, currentUserId }) => {
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [removeMemberOpen, setRemoveMemberOpen] = useState(false);
  const [transferOwnershipOpen, setTransferOwnershipOpen] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [searchMember, setSearchMember] = useState('');
  const [confirmRemoveMember, setConfirmRemoveMember] = useState(null);
  const [confirmTransferOwnership, setConfirmTransferOwnership] = useState(null);
  
  // Socket hook
  const { renameGroup, toastInfo, handleCloseToast } = useMessageSocket(conversation);

  // Mock data - sẽ thay bằng real data sau
  // Kiểm tra ownerId từ nhiều nguồn khác nhau
  const ownerId = conversation?.participant?.groupOwnerId || 
                  conversation?.groupId?.ownerId || 
                  conversation?.groupOwnerId;
  
  const isOwner = currentUserId === ownerId;
  const groupName = conversation?.participant?.fullName || 'Group Chat';
  const groupAvatar = conversation?.participant?.avatar || null;
  const members = conversation?.members || [];

  const handleEditName = () => {
    setNewGroupName(groupName);
    setEditNameOpen(true);
  };

  const handleSaveName = async () => {
    try {
      console.log('handleSaveName called with:', newGroupName);
      
      // Validation
      if (!newGroupName.trim()) {
        console.error('Tên nhóm không được để trống');
        return;
      }
      
      if (newGroupName.trim().length < 3) {
        console.error('Tên nhóm phải có ít nhất 3 ký tự');
        return;
      }
      
      if (newGroupName.trim().length > 30) {
        console.error('Tên nhóm không được quá 30 ký tự');
        return;
      }
      
      // Thử nhiều cách để lấy groupId
      const groupId = conversation?.groupId?._id || 
                     conversation?.participant?.groupId || 
                     conversation?.groupId || // Thử conversation.groupId trực tiếp
                     conversation?._id; // Fallback: sử dụng conversation._id
      console.log('Group ID:', groupId);
      console.log('Conversation data:', conversation);
      console.log('conversation.groupId:', conversation?.groupId);
      console.log('conversation.participant.groupId:', conversation?.participant?.groupId);
      
      if (!groupId) {
        console.error('Group ID not found');
        return;
      }
      
      // Sử dụng Socket.IO để đổi tên nhóm
      console.log('Calling renameGroup with:', groupId, newGroupName.trim());
      const success = renameGroup(groupId, newGroupName.trim());
      console.log('renameGroup result:', success);
      
      if (success) {
        console.log('Group rename request sent via socket');
        setEditNameOpen(false);
      } else {
        console.error('Failed to send rename request');
      }
      
      // TODO: Refresh conversation data or update local state
      // Có thể dispatch action để refresh conversation list
    } catch (error) {
      console.error('Error renaming group:', error);
      
      // Map backend error messages to Vietnamese
      let errorMessage = 'Có lỗi xảy ra khi đổi tên nhóm';
      
      if (error.response?.data?.message) {
        const backendMessage = error.response.data.message;
        
        switch (backendMessage) {
          case 'Group not found':
            errorMessage = 'Không tìm thấy nhóm';
            break;
          case 'You are not a member of this group':
            errorMessage = 'Bạn không phải là thành viên của nhóm này';
            break;
          case 'Name is required':
            errorMessage = 'Tên nhóm là bắt buộc';
            break;
          case 'Name cannot be empty':
            errorMessage = 'Tên nhóm không được để trống';
            break;
          case 'Name must be at least 3 characters long':
            errorMessage = 'Tên nhóm phải có ít nhất 3 ký tự';
            break;
          case 'Name must be less than 30 characters long':
            errorMessage = 'Tên nhóm không được quá 30 ký tự';
            break;
          default:
            errorMessage = backendMessage;
        }
      }
      
      console.error('User-friendly error:', errorMessage);
      // TODO: Show error message to user (e.g., using toast notification)
    }
  };

  const handleChangeAvatar = () => {
    // TODO: Implement avatar change
    console.log('Change group avatar');
  };

  const handleDeleteGroup = () => {
    // TODO: Call API to delete group
    console.log('Delete group');
  };

  const handleTransferOwnership = () => {
    setTransferOwnershipOpen(true);
  };

  const handleShareGroup = () => {
    // TODO: Implement share group
    console.log('Share group');
  };

  const handleRemoveMember = () => {
    setRemoveMemberOpen(true);
  };

  const handleLeaveGroup = () => {
    // TODO: Call API to leave group
    console.log('Leave group');
  };

  const handleRemoveMemberFromGroup = (memberId) => {
    // TODO: Call API to remove member
    console.log('Remove member:', memberId);
    setConfirmRemoveMember(null);
  };

  const handleTransferToMember = (memberId) => {
    // TODO: Call API to transfer ownership
    console.log('Transfer ownership to:', memberId);
    setConfirmTransferOwnership(null);
  };

  const handleConfirmRemoveMember = (member) => {
    setConfirmRemoveMember(member);
  };

  const handleConfirmTransferOwnership = (member) => {
    setConfirmTransferOwnership(member);
  };

  // Filter members based on search
  const filteredMembers = members.filter(member => 
    member.fullName?.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 320,
            backgroundColor: 'background.paper'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Thông tin nhóm
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Group Avatar */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={groupAvatar}
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontSize: '2rem'
                }}
              >
                {!groupAvatar && <CrownIcon />}
              </Avatar>
              <IconButton
                onClick={handleChangeAvatar}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
                size="small"
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Group Name */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Tên nhóm
              </Typography>
              <IconButton onClick={handleEditName} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {groupName}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

                                {/* Members Count */}
           <Box sx={{ mb: 3 }}>
             <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
               Thành viên ({members.length})
             </Typography>
             
             <Button
               variant="text"
               size="small"
               onClick={() => setShowMembersModal(true)}
               sx={{ 
                 color: 'primary.main',
                 textTransform: 'none',
                 p: 0,
                 minWidth: 'auto'
               }}
             >
               Xem tất cả {members.length} thành viên
             </Button>
           </Box>

          <Divider sx={{ my: 2 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShareGroup}
              fullWidth
            >
              Chia sẻ nhóm
            </Button>

                         {isOwner && (
               <>
                 <Button
                   variant="outlined"
                   startIcon={<PersonRemoveIcon />}
                   onClick={handleRemoveMember}
                   fullWidth
                   color="warning"
                 >
                   Xóa thành viên
                 </Button>

                 <Button
                   variant="outlined"
                   startIcon={<CrownIcon />}
                   onClick={handleTransferOwnership}
                   fullWidth
                   color="primary"
                 >
                   Chuyển quyền trưởng nhóm
                 </Button>

                 <Button
                   variant="outlined"
                   startIcon={<DeleteIcon />}
                   onClick={handleDeleteGroup}
                   fullWidth
                   color="error"
                 >
                   Xóa nhóm
                 </Button>
               </>
             )}

            {!isOwner && (
              <Button
                variant="outlined"
                startIcon={<ExitIcon />}
                onClick={handleLeaveGroup}
                fullWidth
                color="error"
              >
                Rời nhóm
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Edit Group Name Dialog */}
      <Dialog open={editNameOpen} onClose={() => setEditNameOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chỉnh sửa tên nhóm</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên nhóm mới"
            fullWidth
            variant="outlined"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditNameOpen(false)}>Hủy</Button>
          <Button onClick={handleSaveName} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog open={removeMemberOpen} onClose={() => setRemoveMemberOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Xóa thành viên khỏi nhóm</DialogTitle>
        <DialogContent>
          <List>
            {members.filter(member => member._id !== ownerId).map((member) => (
              <ListItem key={member._id || member.id}>
                <ListItemAvatar>
                  <Avatar src={member.avatar} />
                </ListItemAvatar>
                <ListItemText primary={member.fullName} />
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveMemberFromGroup(member._id || member.id)}
                  >
                    Xóa
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveMemberOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Transfer Ownership Dialog */}
      <Dialog open={transferOwnershipOpen} onClose={() => setTransferOwnershipOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chuyển quyền trưởng nhóm</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Chọn thành viên để chuyển quyền trưởng nhóm:
          </Typography>
          <List>
            {members.filter(member => member._id !== ownerId).map((member) => (
              <ListItem key={member._id || member.id}>
                <ListItemAvatar>
                  <Avatar src={member.avatar} />
                </ListItemAvatar>
                <ListItemText primary={member.fullName} />
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleTransferToMember(member._id || member.id)}
                  >
                    Chọn
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferOwnershipOpen(false)}>Hủy</Button>
                 </DialogActions>
       </Dialog>

       {/* Confirm Remove Member Dialog */}
       <Dialog open={!!confirmRemoveMember} onClose={() => setConfirmRemoveMember(null)} maxWidth="sm" fullWidth>
         <DialogTitle>Xác nhận xóa thành viên</DialogTitle>
         <DialogContent>
           <Typography variant="body2" color="text.secondary">
             Bạn có chắc chắn muốn xóa <strong>{confirmRemoveMember?.fullName}</strong> khỏi nhóm?
           </Typography>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setConfirmRemoveMember(null)}>Hủy</Button>
           <Button 
             onClick={() => handleRemoveMemberFromGroup(confirmRemoveMember?._id || confirmRemoveMember?.id)} 
             variant="contained" 
             color="error"
           >
             Xóa
           </Button>
         </DialogActions>
       </Dialog>

       {/* Confirm Transfer Ownership Dialog */}
       <Dialog open={!!confirmTransferOwnership} onClose={() => setConfirmTransferOwnership(null)} maxWidth="sm" fullWidth>
         <DialogTitle>Xác nhận chuyển quyền trưởng nhóm</DialogTitle>
         <DialogContent>
           <Typography variant="body2" color="text.secondary">
             Bạn có chắc chắn muốn chuyển quyền trưởng nhóm cho <strong>{confirmTransferOwnership?.fullName}</strong>?
           </Typography>
           <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
             Lưu ý: Bạn sẽ không còn là trưởng nhóm sau khi chuyển quyền.
           </Typography>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setConfirmTransferOwnership(null)}>Hủy</Button>
           <Button 
             onClick={() => handleTransferToMember(confirmTransferOwnership?._id || confirmTransferOwnership?.id)} 
             variant="contained" 
             color="primary"
           >
             Chuyển quyền
           </Button>
         </DialogActions>
       </Dialog>

       {/* Members Modal */}
       <Dialog 
         open={showMembersModal} 
         onClose={() => {
           setShowMembersModal(false);
           setSearchMember('');
         }} 
         maxWidth="sm" 
         fullWidth
       >
         <DialogTitle>
           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <Typography variant="h6">
               Thành viên nhóm ({members.length})
             </Typography>
             <IconButton onClick={() => {
               setShowMembersModal(false);
               setSearchMember('');
             }}>
               <CloseIcon />
             </IconButton>
           </Box>
         </DialogTitle>
         <DialogContent>
           {/* Search for members */}
           <TextField
             size="small"
             placeholder="Tìm thành viên..."
             value={searchMember}
             onChange={(e) => setSearchMember(e.target.value)}
             sx={{ mb: 2, width: '100%' }}
             InputProps={{
               sx: { fontSize: '0.875rem' }
             }}
           />
           
           <List dense>
             {filteredMembers.map((member) => (
               <ListItem key={member._id || member.id} dense>
                 <ListItemAvatar>
                   <Avatar 
                     src={member.avatar} 
                     sx={{ width: 40, height: 40 }}
                   />
                 </ListItemAvatar>
                 <ListItemText
                   primary={member.fullName}
                   secondary={
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                       <Typography variant="caption" color="text.secondary">
                         {member._id === ownerId ? 'Chủ nhóm' : 'Thành viên'}
                       </Typography>
                       {member._id === ownerId && <CrownIcon fontSize="small" color="primary" />}
                     </Box>
                   }
                 />
                                    {isOwner && member._id !== ownerId && (
                     <ListItemSecondaryAction>
                       <Box sx={{ display: 'flex', gap: 0.5 }}>
                         <Tooltip title="Gán quyền trưởng nhóm">
                           <IconButton
                             size="small"
                             onClick={() => handleConfirmTransferOwnership(member)}
                             sx={{ 
                               color: 'primary.main',
                               '&:hover': { backgroundColor: 'primary.light' }
                             }}
                           >
                             <CrownIcon fontSize="small" />
                           </IconButton>
                         </Tooltip>
                         <Tooltip title="Xóa khỏi nhóm">
                           <IconButton
                             size="small"
                             onClick={() => handleConfirmRemoveMember(member)}
                             sx={{ 
                               color: 'error.main',
                               '&:hover': { backgroundColor: 'error.light' }
                             }}
                           >
                             <PersonRemoveIcon fontSize="small" />
                           </IconButton>
                         </Tooltip>
                       </Box>
                     </ListItemSecondaryAction>
                   )}
               </ListItem>
             ))}
             {searchMember && filteredMembers.length === 0 && (
               <ListItem dense>
                 <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', width: '100%' }}>
                   Không tìm thấy thành viên nào
                 </Typography>
               </ListItem>
             )}
           </List>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => {
             setShowMembersModal(false);
             setSearchMember('');
           }}>
             Đóng
           </Button>
         </DialogActions>
               </Dialog>

        {/* Toast Notification */}
        <Snackbar
          open={toastInfo.open}
          autoHideDuration={6000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseToast} 
            severity={toastInfo.severity} 
            sx={{ width: '100%' }}
          >
            {toastInfo.message}
          </Alert>
        </Snackbar>
      </>
    );
  };

GroupSidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  conversation: PropTypes.object,
  currentUserId: PropTypes.string
};

export default GroupSidebar; 