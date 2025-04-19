import React, { useState, useEffect } from "react";
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
  const [resetToken, setResetToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("resetPasswordToken");
    
    if (!token) {
      setMessage("Reset password token is missing. Please try again.");
      setIsError(true);
      return;
    }
    
    // Nếu token là chuỗi JSON, thử parse
    try {
      if (token.startsWith('"') && token.endsWith('"')) {
        setResetToken(JSON.parse(token));
      } else {
        setResetToken(token);
      }
    } catch (error) {
      setResetToken(token); // Nếu parse lỗi, sử dụng token nguyên bản
    }
  }, []);

  const handleSubmitChangePassword = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu khớp
    if (newPassword !== confirmNewPassword) {
      setMessage("Passwords do not match!");
      setIsError(true);
      return;
    }

    if (!resetToken) {
      setMessage("Reset password token is missing. Please try again.");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      // Gọi API đổi mật khẩu
      const result = await resetPassword(resetToken, newPassword, confirmNewPassword);

      if (result.success) {
        setMessage("Password changed successfully!");
        setIsError(false);
        Cookies.remove("resetPasswordToken");

        // Chuyển hướng sang trang login sau 2 giây
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      } else {
        setMessage(result.error || "Failed to change password. Please try again.");
        setIsError(true);
      }
    } catch (error) {
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