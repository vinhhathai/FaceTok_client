import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import changePasswordApi from "../../api/changePasswordApi";

function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate(); // Dùng để điều hướng trang

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

    try {
      // Gọi API đổi mật khẩu
      await changePasswordApi(newPassword, confirmNewPassword, resetPasswordToken);

      setMessage("Password changed successfully!");
      setIsError(false);

      // Chuyển hướng sang trang login sau 2 giây
      setTimeout(() => {
        navigate("/auth/login"); // Điều hướng đến trang login
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to change password. Please try again.");
      setIsError(true);
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="form-group">
          <input
            required
            type="password"
            className="form-control"
            name="newPassword"
            placeholder="New password..."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="col-md-12">
        <div className="form-group">
          <input
            required
            type="password"
            className="form-control"
            name="confirmNewPassword"
            placeholder="Confirm new password..."
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
      </div>

      {message && (
        <div className="col-md-12">
          <div
            className={`alert ${isError ? "alert-danger" : "alert-success"}`}
            role="alert"
          >
            {message}
          </div>
        </div>
      )}

      <div className="col-md-12 text-center">
        <div className="form-group">
          <button
            onClick={handleSubmitChangePassword}
            type="submit"
            className="btn btn-primary btn-block"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordForm;
