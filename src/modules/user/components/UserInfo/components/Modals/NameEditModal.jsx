import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  showSuccess,
  showError,
} from "../../../../../../shared/utils/toastMessageUtils";

// Redux
import {
  updateUserFullname,
  fetchUserProfile,
  selectUserError,
} from "../../../../redux/slices/userSlice";

// CSS Module
import styles from "./NameEditModal.module.css";

// Local storage key for errors
const ERROR_STORAGE_KEY = "fullname_update_error";
// Flag to track if error toast has been shown already
let errorToastShown = false;
// Store timeout for name update cooldown
const NAME_COOLDOWN_KEY = "fullname_cooldown_time";

const NameEditModal = ({ isOpen, onClose, user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const globalError = useSelector(selectUserError);

  const [newName, setNewName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [timeRemainingError, setTimeRemainingError] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);

  // Check for cooldown when modal opens
  useEffect(() => {
    if (isOpen) {
      // Only reset the toast flag when modal is first opened
      errorToastShown = false;

      // Check if cooldown is still active from localStorage
      const cooldownTime = localStorage.getItem(NAME_COOLDOWN_KEY);
      if (cooldownTime) {
        const cooldownExpiry = parseInt(cooldownTime, 10);
        const now = Date.now();

        if (now < cooldownExpiry) {
          // Cooldown still active
          const minutesRemaining = Math.ceil(
            (cooldownExpiry - now) / (60 * 1000)
          );
          const errorMsg = `Bạn cần đợi thêm ${minutesRemaining} phút nữa để đổi tên`;
          setTimeRemainingError(errorMsg);
          setCooldownActive(true);
          safeShowError(errorMsg);
        } else {
          // Cooldown expired
          localStorage.removeItem(NAME_COOLDOWN_KEY);
          setCooldownActive(false);
          setTimeRemainingError(null);
        }
      }
    }

    // Cleanup when modal closes
    return () => {
      if (!isOpen) {
        setLocalError(null);
        // Don't reset timeRemainingError and cooldownActive on close
        setAuthError(false);
      }
    };
  }, [isOpen]);

  // Safely show error toast only once
  const safeShowError = (message) => {
    if (!errorToastShown) {
      showError(message);
      errorToastShown = true;
    }
  };

  // Load saved error from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedError = localStorage.getItem(ERROR_STORAGE_KEY);
      if (savedError) {
        try {
          const errorData = JSON.parse(savedError);

          if (errorData.timeRemaining) {
            const errorMsg = `Bạn cần đợi thêm ${errorData.timeRemaining} phút nữa để đổi tên`;
            setTimeRemainingError(errorMsg);
            setCooldownActive(true);

            // Set cooldown expiry time in localStorage
            const expiryTime = Date.now() + errorData.timeRemaining * 60 * 1000;
            localStorage.setItem(NAME_COOLDOWN_KEY, expiryTime.toString());

            safeShowError(errorMsg);
          } else if (errorData.authError) {
            setAuthError(true);
            safeShowError("Cần đăng nhập lại để thực hiện chức năng này");
          } else if (errorData.message) {
            setLocalError(errorData.message);
            safeShowError(errorData.message);
          }

          // Clear localStorage after retrieving the error
          localStorage.removeItem(ERROR_STORAGE_KEY);
        } catch (e) {
          console.error("Error parsing saved error", e);
          localStorage.removeItem(ERROR_STORAGE_KEY);
        }
      }
    }
  }, [isOpen]);

  // Set initial name when modal opens
  useEffect(() => {
    if (isOpen && user?.fullName) {
      setNewName(user.fullName);
    }
  }, [isOpen, user?.fullName]);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleUpdateName = async () => {
    // Reset error toast flag on new submission
    errorToastShown = false;

    if (!newName || newName.trim().length === 0) {
      const errorMsg = "Tên không được để trống!";
      setLocalError(errorMsg);
      safeShowError(errorMsg);
      return;
    }

    if (newName.trim().length < 3) {
      const errorMsg = "Tên phải có ít nhất 3 ký tự";
      setLocalError(errorMsg);
      safeShowError(errorMsg);
      return;
    }

    if (newName.trim().length > 30) {
      const errorMsg = "Tên không được vượt quá 30 ký tự";
      setLocalError(errorMsg);
      safeShowError(errorMsg);
      return;
    }

    try {
      setIsUpdatingName(true);
      setLocalError(null);
      setTimeRemainingError(null);
      setAuthError(false);
      setCooldownActive(false);

      // Dispatch action to update user name
      await dispatch(updateUserFullname(newName.trim())).unwrap();

      // Hiển thị thông báo thành công
      showSuccess("Cập nhật tên thành công!");

      // Chỉ đóng modal khi cập nhật thành công
      onClose();

      // Refresh user profile after update
      if (user?.id) {
        dispatch(fetchUserProfile(user.id));
      }
    } catch (error) {
      console.error("Fullname update error:", error);

      // Save error to localStorage in case of page reload
      const errorToSave = {
        message: error.message,
        timeRemaining: error.timeRemaining,
        authError: error.status === 401,
      };
      localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(errorToSave));

      if (error.timeRemaining) {
        // Hiển thị lỗi thời gian chờ bằng tiếng Việt
        const errorMsg = `Bạn cần đợi thêm ${error.timeRemaining} phút nữa để đổi tên`;
        setTimeRemainingError(errorMsg);
        setCooldownActive(true);

        // Set cooldown expiry time in localStorage
        const expiryTime = Date.now() + error.timeRemaining * 60 * 1000;
        localStorage.setItem(NAME_COOLDOWN_KEY, expiryTime.toString());

        safeShowError(errorMsg);
      } else if (error.status === 401) {
        // Lỗi xác thực
        setAuthError(true);
        safeShowError("Cần đăng nhập lại để thực hiện chức năng này");
      } else {
        const errorMsg =
          error.message || "Không thể cập nhật tên. Vui lòng thử lại sau.";
        setLocalError(errorMsg);
        safeShowError(errorMsg);
      }
    } finally {
      setIsUpdatingName(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="edit-name-modal"
      aria-describedby="modal-to-edit-user-full-name"
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <Typography variant="h6" component="h2" className={styles.modalTitle}>
            Đổi tên
          </Typography>
          <div className={styles.closeButton} onClick={onClose}>
            ×
          </div>
        </div>

        {timeRemainingError && (
          <div className={styles.errorText}>{timeRemainingError}</div>
        )}

        {authError && (
          <div className={styles.errorText}>
            Cần đăng nhập lại để thực hiện chức năng này.
          </div>
        )}

        {localError && !timeRemainingError && (
          <div className={styles.errorText}>{localError}</div>
        )}

        <div className={styles.formGroup}>
          <Typography variant="body2" className={styles.formLabel}>
            Tên mới
          </Typography>
          <TextField
            fullWidth
            placeholder="Nhập tên mới của bạn"
            value={newName}
            onChange={handleNameChange}
            variant="outlined"
            autoFocus
            error={!!localError || !!timeRemainingError}
            disabled={!!timeRemainingError || authError || cooldownActive}
            size="small"
            className={styles.inputField}
            inputProps={{
              style: { borderRadius: "8px" },
            }}
          />
        </div>

        <div className={styles.actionButtons}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isUpdatingName}
            className={styles.cancelButton}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateName}
            disabled={
              isUpdatingName ||
              !newName.trim() ||
              !!timeRemainingError ||
              !!authError ||
              cooldownActive
            }
            startIcon={
              isUpdatingName ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
            className={styles.saveButton}
          >
            {isUpdatingName ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

NameEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    fullName: PropTypes.string,
  }),
};

export default NameEditModal;
