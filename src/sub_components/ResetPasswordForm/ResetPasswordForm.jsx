import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../api/resetPasswordApi";
import { setEmail } from "../../redux/features/emailSlice"; // Import action setEmail

function ResetPasswordForm({ handleShowOTPForm }) {
  const [email, setEmailState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch(); // Sử dụng dispatch từ Redux

  const handleSubmitToEmail = async (e) => {
    e.preventDefault();
    if (email.trim().length === 0) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const result = await resetPassword(email);

    setIsLoading(false);

    if (result.success) {
      // Dispatch email vào Redux
      dispatch(setEmail(email)); // Lưu email vào Redux
      setMessage(
        result.message || "An email has been sent to reset your password."
      );
      handleShowOTPForm(); // Chuyển sang giao diện OTPForm
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="form-group">
          <input
            required
            type="email"
            className="form-control"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmailState(e.target.value)} // Cập nhật email trong state local
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
            onClick={handleSubmitToEmail}
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
