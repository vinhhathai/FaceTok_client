import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

// Material UI Imports
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// Styled Components
import { 
  FormContainer, 
  PasswordField, 
  SubmitButton,
  LoaderContainer 
} from "./styles";
import { resetPassword } from "../../api/resetPasswordApi";

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

    // Lấy resetPasswordToken từ cookie
    const resetPasswordToken = Cookies.get("resetPasswordToken");
    console.log("Token from cookie:", resetPasswordToken);

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
      const result = await resetPassword(resetPasswordToken, newPassword, confirmNewPassword);

      if (result.success) {
        setMessage("Password changed successfully!");
        setIsError(false);

        // Chuyển hướng sang trang login sau 2 giây
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      } else {
        setMessage(result.error || "Failed to change password. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error in handleSubmitChangePassword:", error);
      setMessage(error.message || "Failed to change password. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer component="form" onSubmit={handleSubmitChangePassword} noValidate>
      <PasswordField
        required
        fullWidth
        name="newPassword"
        label="New Password"
        type="password"
        id="newPassword"
        autoComplete="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      
      <PasswordField
        required
        fullWidth
        name="confirmNewPassword"
        label="Confirm New Password"
        type="password"
        id="confirmNewPassword"
        autoComplete="new-password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />

      {message && (
        <Alert 
          severity={isError ? "error" : "success"} 
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      <LoaderContainer>
        <SubmitButton
          type="submit"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </SubmitButton>
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
      </LoaderContainer>
    </FormContainer>
  );
}

export default ChangePasswordForm; 