import React, { useState } from "react";
import verifyOtp from '../../api/verifyOtp';
import { useSelector } from "react-redux";
import Cookies from 'js-cookie';

// Material UI Imports
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// Styled Components
import { 
  FormContainer, 
  OTPField, 
  SubmitButton,
  LoaderContainer 
} from "./styles";
import saveDataToCookie from "../../utils/saveDataToCookie";

function OTPForm({ handleShowChangePasswordForm }) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const email = useSelector((state) => state.email.email);

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    if (otp.trim().length === 0) {
      setMessage("Please enter a valid OTP.");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage("");
    setIsError(false);
    
    try {
      const result = await verifyOtp(otp, email);

      if (result.success) {
        const resetToken = result.data?.resetToken;

        if (!resetToken) {
          setMessage("Invalid server response - Reset token missing");
          setIsError(true);
          return;
        }

        // Lưu token vào cookie
        saveDataToCookie(resetToken, "resetPasswordToken", 5000);
        
        setMessage(result.message || "OTP Verification Success");
        setIsError(false);

        // Hiển thị thông báo thành công trước khi chuyển sang form đổi mật khẩu
        setTimeout(() => {
          handleShowChangePasswordForm(resetToken);
        }, 2000);
      } else {
        setMessage(`Error: ${result.error}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer component="form" onSubmit={handleSubmitOTP} noValidate>
      <OTPField
        required
        fullWidth
        name="otp"
        label="OTP Code"
        type="number"
        id="otp"
        autoFocus
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        disabled={isLoading}
        inputProps={{ 
          inputMode: 'numeric',
          pattern: '[0-9]*'
        }}
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
          {isLoading ? "Verifying..." : "Verify"}
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

export default OTPForm; 