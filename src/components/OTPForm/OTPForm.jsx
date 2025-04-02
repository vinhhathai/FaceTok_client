import React, { useState } from "react";
import verifyOtp from '../../api/verifyOtp';
import { useSelector } from "react-redux";

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
        const resetPasswordToken = result.data.resetPasswordToken;

        // Lưu resetPasswordToken vào localStorage
        localStorage.setItem("resetPasswordToken", resetPasswordToken);

        setMessage(result.message || "OTP Verification Success");
        setIsError(false);

        // Hiển thị thông báo thành công trước khi chuyển sang form đổi mật khẩu
        setTimeout(() => {
          handleShowChangePasswordForm(); // Chuyển sang ChangePasswordForm
        }, 2000); // 2 giây
      } else {
        setMessage(`Error: ${result.error}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setIsError(true);
      console.error("Error verifying OTP:", error);
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