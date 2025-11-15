import { useEffect, useRef, useState } from "react";
import { useSocket } from "@contexts/SocketContext";
import { useDispatch } from "react-redux";
import { updateMessageAsRevoked, addReceivedMessage } from "@message/redux/slices/messageSlice";
import {
  updateGroupName,
  markGroupDissolved,
  updateGroupOwner,
    removeConversation,
    removeMemberFromConversation,
} from "@message/redux/slices/conversationSlice";
import { apiClient } from "@httpClient";
import { store } from "@core/config/store";
// UI toasts handled at component level

/**
 * Hook để sử dụng socket connection cho trang tin nhắn
 * @param {Object} currentConversation - Conversation hiện tại (truyền qua props)
 */
const useMessageSocket = (currentConversation) => {
  const { socket, connected, emit, joinRoom, leaveRoom } = useSocket();
  const dispatch = useDispatch();
  const previousRoomIdRef = useRef(null);
  const timerRef = useRef(null);

  // Toast state
  const [toastInfo, setToastInfo] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Toast functions
  const showToast = (message, severity = "error") => {
    setToastInfo({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseToast = () => {
    setToastInfo((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Lắng nghe sự kiện message_revoked từ socket
  useEffect(() => {
    if (!socket) {
      console.log('⚠️ useMessageSocket - No socket available');
      return;
    }

    // Setting up socket listeners

    const handleMessageReceived = (data) => {
      // Thêm tin nhắn mới vào Redux store
      if (data) {
        dispatch(addReceivedMessage(data));
      }
    };

    const handleMessageRevoked = (data) => {
      // debug removed
      // Cập nhật Redux store khi tin nhắn được thu hồi
      if (data.messageId) {
        dispatch(updateMessageAsRevoked({ messageId: data.messageId }));
      }
    };

    const handleMessageError = (data) => {
      // debug removed
      // Hiển thị thông báo lỗi cho user
      if (data.message) {
        showToast(data.message, "error");
      }
    };

    const handleGroupRenamed = (data) => {
      // debug removed
      // Cập nhật Redux store khi tên nhóm thay đổi, KHÔNG hiển thị toast
      if ((data.groupId || data.roomId) && data.newName) {
        // debug removed
        dispatch(
          updateGroupName({
            groupId: data.groupId,
            roomId: data.roomId,
            newName: data.newName,
          })
        );
      }
    };

    const handleGroupError = (data) => {
      // debug removed
      // Hiển thị thông báo lỗi cho user
      if (data.message) {
        showToast(data.message, "error");
      }
    };

    const handleGroupDissolved = (data) => {
      if (data?.roomId) {
        dispatch(markGroupDissolved({ roomId: data.roomId }));
      }
    };

    const handleOwnerChanged = (data) => {
      if (data?.roomId && data?.newOwnerId) {
        dispatch(updateGroupOwner({ roomId: data.roomId, newOwnerId: data.newOwnerId }));
      }
    };

    const handleMemberKicked = (data) => {
      const roomId = data?.roomId;
      const kickedUserId = data?.userId;
      if (!roomId || !kickedUserId) return;

      const currentUserId = localStorage.getItem("currentUserId");
      if (currentUserId && kickedUserId === currentUserId) {
        // Nếu chính mình bị kick: xoá conversation và thông báo UI đóng chat
        dispatch(removeConversation({ roomId }));
        window.dispatchEvent(
          new CustomEvent("GROUP_KICKED", { detail: { roomId } })
        );
        showToast("Bạn đã bị xoá khỏi nhóm", "warning");
      } else {
        // Thành viên khác bị kick: cập nhật danh sách thành viên trong state
        dispatch(removeMemberFromConversation({ roomId, userId: kickedUserId }));
      }
    };

    socket.on("message_received", handleMessageReceived);
    socket.on("message_revoked", handleMessageRevoked);
    socket.on("message_error", handleMessageError);
    socket.on("group_renamed", handleGroupRenamed);
    socket.on("group_error", handleGroupError);
    socket.on("group_dissolved", handleGroupDissolved);
    socket.on("group_owner_changed", handleOwnerChanged);
    socket.on("group_member_kicked", handleMemberKicked);
    socket.on("group_left", (data) => {
      const roomId = data?.roomId;
      if (roomId) {
        dispatch(removeConversation({ roomId }));
        // Thông báo tới các trang/comp khác để đóng ChatBox hiện tại
        window.dispatchEvent(
          new CustomEvent("GROUP_LEFT", { detail: { roomId } })
        );
      }
    });
    socket.on("group_member_left", (data) => {
      const roomId = data?.roomId;
      const userId = data?.userId;
      if (roomId && userId) {
        dispatch(removeMemberFromConversation({ roomId, userId }));
      }
    });

    return () => {
      socket.off("message_received", handleMessageReceived);
      socket.off("message_revoked", handleMessageRevoked);
      socket.off("message_error", handleMessageError);
      socket.off("group_renamed", handleGroupRenamed);
      socket.off("group_error", handleGroupError);
      socket.off("group_dissolved", handleGroupDissolved);
      socket.off("group_owner_changed", handleOwnerChanged);
      socket.off("group_member_kicked", handleMemberKicked);
      socket.off("group_left");
      socket.off("group_member_left");
    };
  }, [socket, dispatch]);

  // Tự động join room khi conversation thay đổi
  useEffect(() => {
    if (!connected || !currentConversation?._id) return;

    const roomId = currentConversation._id;

    // Xóa timer cũ nếu có
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Sử dụng timeout để debounce các cuộc gọi liên tiếp
    timerRef.current = setTimeout(() => {
      // Chỉ join room khi roomId thay đổi để tránh gọi nhiều lần
      if (previousRoomIdRef.current !== roomId) {
        // Nếu đã ở trong phòng khác, rời phòng đó trước
        if (previousRoomIdRef.current) {
          leaveRoom({ roomId: previousRoomIdRef.current });
        }

        // Join phòng mới
        joinRoom({ roomId });

        // Cập nhật ref
        previousRoomIdRef.current = roomId;
      }
    }, 300); // Debounce 300ms

    return () => {
      // Xóa timer khi cleanup
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Cleanup chỉ khi component unmount, không phải khi roomId thay đổi
      if (roomId === previousRoomIdRef.current) {
        // debug removed
        leaveRoom({ roomId });
        previousRoomIdRef.current = null;
      }
    };
  }, [currentConversation, connected, joinRoom, leaveRoom]);

  // Join tất cả conversations để nhận realtime updates
  useEffect(() => {
    if (!connected) return;

    // Lấy danh sách conversations từ Redux store
    const state = store.getState();
    const conversations = state.conversations?.conversations || [];
    
    // Join tất cả conversations
    conversations.forEach(conversation => {
      if (conversation._id) {
        joinRoom({ roomId: conversation._id });
      }
    });

    // Cleanup: leave tất cả rooms khi component unmount
    return () => {
      conversations.forEach(conversation => {
        if (conversation._id) {
          leaveRoom({ roomId: conversation._id });
        }
      });
    };
  }, [connected, joinRoom, leaveRoom]);

  // REST commands + socket broadcast
  const renameGroup = async (roomId, name) => {
    try {
      await apiClient.put("/message/group/rename", { id: roomId, name });
      return true;
    } catch (e) {
      showToast(e?.response?.data?.error?.message || "Không thể đổi tên nhóm", "error");
      return false;
    }
  };

  const changeGroupOwner = async (roomId, newOwnerId) => {
    try {
      await apiClient.put("/message/group/change-owner", { id: roomId, newOwnerId });
      return true;
    } catch (e) {
      showToast(e?.response?.data?.error?.message || "Không thể chuyển quyền", "error");
      return false;
    }
  };

  const leaveGroup = async (roomId) => {
    try {
      await apiClient.post("/message/room/leave", { id: roomId });
      return true;
    } catch (e) {
      let msg = e?.response?.data?.error?.message || "Không thể rời nhóm";
      // Map backend error to friendly Vietnamese
      if (msg.includes("Owner cannot leave the group")) {
        msg = "Bạn là chủ nhóm. Vui lòng chuyển quyền chủ nhóm cho thành viên khác trước khi rời nhóm.";
      }
      showToast(msg, "error");
      return false;
    }
  };

  const dissolveGroup = async (roomId) => {
    try {
      await apiClient.post("/message/group/dissolve", { roomId });
      return true;
    } catch (e) {
      showToast(e?.response?.data?.error?.message || "Không thể giải tán nhóm", "error");
      return false;
    }
  };

  const kickMember = async (roomId, userId) => {
    try {
      await apiClient.post("/message/room/kick-out", { roomId, kickOutUserId: userId });
      return true;
    } catch (e) {
      showToast(e?.response?.data?.error?.message || "Không thể xoá thành viên", "error");
      return false;
    }
  };

  const inviteMember = async (roomId, userId) => {
    try {
      await apiClient.post("/message/group/invite", { roomId, userId });
      return true;
    } catch (e) {
      showToast(e?.response?.data?.error?.message || "Không thể mời thành viên", "error");
      return false;
    }
  };

  return {
    socket,
    connected,
    emit,
    joinRoom,
    leaveRoom,
    renameGroup,
    changeGroupOwner,
    leaveGroup,
    dissolveGroup,
    kickMember,
    inviteMember,
    toastInfo,
    handleCloseToast,
  };
};

export default useMessageSocket;
