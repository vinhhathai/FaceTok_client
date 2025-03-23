import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import changePasswordApi from "../../api/changePasswordApi";

// Material UI Imports
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmitChangePassword = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu khớp
    if (newPassword !== confirmNewPassword) {
      setMessage("Passwords do not match!");
      setIsError(true);
      return;
    }

    // Lấy resetPasswordToken từ localStorage
    const resetPasswordToken = localStorage.getItem("resetPasswordToken");

    if (!resetPasswordToken) {
      setMessage("Reset password token is missing. Please try again.");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      // Gọi API đổi mật khẩu
      await changePasswordApi(newPassword, confirmNewPassword, resetPasswordToken);

      setMessage("Password changed successfully!");
      setIsError(false);

      // Chuyển hướng sang trang login sau 2 giây
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to change password. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmitChangePassword} noValidate>
      <TextField
        margin="normal"
        required
        fullWidth
        name="newPassword"
        label="New Password"
        type="password"
        id="newPassword"
        autoComplete="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmNewPassword"
        label="Confirm New Password"
        type="password"
        id="confirmNewPassword"
        autoComplete="new-password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        sx={{ mb: 2 }}
      />

      {message && (
        <Alert 
          severity={isError ? "error" : "success"} 
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      <Box sx={{ position: 'relative', width: '100%', textAlign: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{ minWidth: '150px' }}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
        {isLoading && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default ChangePasswordForm;
