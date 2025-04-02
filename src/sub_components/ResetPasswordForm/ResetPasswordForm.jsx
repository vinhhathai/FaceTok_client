import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../api/resetPasswordApi";
import { setEmail } from "../../redux/features/emailSlice";

// Material UI Imports
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

function ResetPasswordForm({ handleShowOTPForm }) {
  const [email, setEmailState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();

  const handleSubmitToEmail = async (e) => {
    e.preventDefault();
    if (email.trim().length === 0) {
      setMessage("Please enter a valid email address.");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const result = await resetPassword(email);

      if (result.success) {
        // Lưu email vào Redux
        dispatch(setEmail(email));
        setMessage(result.message || "An email has been sent to reset your password.");
        setIsError(false);
        
        // Chuyển sang giao diện OTPForm sau 2 giây
        setTimeout(() => {
          handleShowOTPForm();
        }, 2000);
      } else {
        setMessage(`Error: ${result.error}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage(`Error: ${error.message || "An unknown error occurred"}`);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmitToEmail} noValidate>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmailState(e.target.value)}
        disabled={isLoading}
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
          {isLoading ? "Sending..." : "Send"}
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

export default ResetPasswordForm;
