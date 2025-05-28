import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  CircularProgress,
} from "@mui/material";
import { login } from "../../redux";
import { createError, showSuccess, showError, formatErrorMessage } from "../../../../shared/utils";
import styles from "./LoginForm.module.css";

/**
 * Simplified login form component
 */
const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // True nếu không có lỗi
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cập nhật form data
    setFormData({
      ...formData,
      [name]: value,
    });

    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate form
    if (!validateForm()) {
      return; // Dừng nếu form không hợp lệ
    }

    // 2. Set loading state
    setLoading(true);

    try {
      // 3. Call API
      const resultAction = await dispatch(login(formData));

      // 4. Handle result
      if (login.fulfilled.match(resultAction)) {
        // Success: Show message and redirect
        showSuccess("Đăng nhập thành công!");

        navigate("/home", { replace: true });
      } else if (login.rejected.match(resultAction)) {
        console.log('Login rejected:', resultAction.payload);
        const errorMessage = formatErrorMessage(resultAction.payload)
        showError(errorMessage);
      }
    } catch (error) {
      // Unexpected error
      showError("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.");
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      className={styles.formContainer}
    >
      <Typography
        variant="h5"
        component="h1"
        align="center"
        sx={{ marginBottom: 3, fontWeight: 600 }}
      >
        Đăng nhập
      </Typography>

      {/* Email field */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Địa chỉ Email"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        placeholder="Nhập email của bạn"
      />

      {/* Password field */}
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Mật khẩu"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        placeholder="Nhập mật khẩu của bạn"
      />

      {/* Forgot password link */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, mb: 2 }}>
        <Link component={RouterLink} to="/forgot-password" variant="body2">
          Quên mật khẩu?
        </Link>
      </Box>

      {/* Login button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Đăng nhập"}
      </Button>

      {/* Links */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="body2">
          Chưa có tài khoản?{" "}
          <Link component={RouterLink} to="/register" variant="body2">
            Đăng ký ngay
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
