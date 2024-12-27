import React, { useState } from "react";
import verifyOtp from '../../api/verifyOtp';
import { useSelector } from "react-redux";

function OTPForm({ handleShowChangePasswordForm }) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const email = useSelector((state) => state.email.email);

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    if (otp.trim().length === 0) {
      alert("Please enter a valid OTP.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      const result = await verifyOtp(otp, email);

      setIsLoading(false);

      if (result.success) {
        const resetPasswordToken = result.data.resetPasswordToken;

        // Lưu resetPasswordToken vào localStorage
        localStorage.setItem("resetPasswordToken", resetPasswordToken);

        setMessage(result.message || "OTP Verification Success");

        // Hiển thị thông báo thành công trước khi chuyển sang form đổi mật khẩu
        setTimeout(() => {
          handleShowChangePasswordForm(); // Chuyển sang ChangePasswordForm
        }, 2000); // 2 giây
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setIsLoading(false);
      setMessage("An error occurred. Please try again.");
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="form-group">
          <input
            required
            type="number"
            className="form-control"
            name="otp"
            placeholder="OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {message && (
        <div className="col-md-12">
          <div
            className={`alert ${
              message.startsWith("Error:") ? "alert-danger" : "alert-success"
            }`}
            role="alert"
          >
            {message}
          </div>
        </div>
      )}

      <div className="col-md-12 text-center">
        <div className="form-group">
          <button
            onClick={handleSubmitOTP}
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OTPForm;
