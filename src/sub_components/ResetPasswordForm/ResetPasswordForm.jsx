import React, { useState } from "react";


function ResetPasswordForm({handleShowOtpForm}) {
  const [email, setEmail] = useState("");

  const handleSubmitToEmail = (e) => {
    e.preventDefault();
    if (email.length <= 0) {
      alert("Invalid email");
      return;
    }
    handleShowOtpForm()
    console.log(email); // Log the email value
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value); // Update the email state
  };
  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <input
              required // không cần giá trị true, JSX sẽ hiểu là true nếu tồn tại
              type="email"
              className="form-control"
              name="email"
              placeholder="Email Address"
              value={email} // Set value to email state
              onChange={handleEmailChange} // Handle input change
            />
          </div>
        </div>

        <div className="col-md-12 text-center">
          <div className="form-group">
            <button
              onClick={handleSubmitToEmail}
              type="submit"
              className="btn btn-primary btn-block"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPasswordForm;
