import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import ConversationItem from "../ConversationItem/ConversationItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../../redux/slices/conversationSlice";
import { deleteConversation } from "../../api/messageAPI";
import {
  StatusContainer,
  ConversationsListWrapper,
} from "./ConversationList.styles";
import { toast } from "react-toastify";

const ConversationList = ({
  onSelectConversation,
  currentConversationId,
  onDelete,
}) => {
  const dispatch = useDispatch();
  const { conversations, loading, error } = useSelector(
    (state) => state.conversations
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch conversations on component mount
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);
  
  // Listen for new messages to refresh conversation list
  useEffect(() => {
    const handleNewMessage = () => {
      // Refresh conversation list when new message is received
      dispatch(fetchConversations());
    };
    
    // Listen for message received event
    window.addEventListener('facetok_message_received', handleNewMessage);
    window.addEventListener('MESSAGE_SENT_SUCCESS', handleNewMessage);
    
    return () => {
      window.removeEventListener('facetok_message_received', handleNewMessage);
      window.removeEventListener('MESSAGE_SENT_SUCCESS', handleNewMessage);
    };
  }, [dispatch]);

  // Handle delete conversation
  const handleDeleteConversation = (conversation) => {
    setConversationToDelete(conversation);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (conversationToDelete) {
      setDeleteLoading(true);
      try {
        await deleteConversation(conversationToDelete._id);
        
        // Show success message
        toast.success(`Đã xóa cuộc trò chuyện với ${conversationToDelete.participant?.fullName || 'người dùng'}`);
        
        // Call parent onDelete if provided
        if (onDelete) {
          onDelete(conversationToDelete);
        }
        
        setDeleteDialogOpen(false);
        setConversationToDelete(null);
      } catch (error) {
        console.error('Failed to delete conversation:', error);
        toast.error('Không thể xóa cuộc trò chuyện. Vui lòng thử lại.');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setConversationToDelete(null);
  };

  if (loading) {
    return (
      <StatusContainer>
        <CircularProgress />
      </StatusContainer>
    );
  }

  if (error) {
    return (
      <StatusContainer>
        <Typography color="error">Không thể tải cuộc trò chuyện</Typography>
      </StatusContainer>
    );
  }

  if (conversations.length === 0) {
    return (
      <StatusContainer>
        <Typography color="text.secondary">
          Chưa có cuộc trò chuyện nào
        </Typography>
      </StatusContainer>
    );
  }

  return (
    <>
      <ConversationsListWrapper disablePadding>
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation._id}
            conversation={conversation}
            isActive={conversation._id === currentConversationId}
            onClick={() => onSelectConversation(conversation)}
            onDelete={handleDeleteConversation}
          />
        ))}
      </ConversationsListWrapper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Xác nhận xóa cuộc trò chuyện
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa cuộc trò chuyện với{" "}
            <strong>
              {conversationToDelete?.participant?.fullName || "người dùng này"}
            </strong>
            ?
            <br />
            <br />
            <strong>Lưu ý:</strong> Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary" disabled={deleteLoading}>
            Hủy
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={20} /> : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ConversationList.propTypes = {
  onSelectConversation: PropTypes.func.isRequired,
  currentConversationId: PropTypes.string,
  onDelete: PropTypes.func,
};

export default ConversationList;
