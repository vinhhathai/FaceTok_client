import React, { useState } from "react";
import { Link } from "react-router-dom";
import ResetPasswordForm from "../../sub_components/ResetPasswordForm/ResetPasswordForm";
import ChangePasswordForm from "../../sub_components/ChangePasswordForm/ChangePasswordForm";

function ResetPasswordPage() {
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false)

  const handleShowChangePasswordForm = () => {
    setShowChangePasswordForm(true)
  }
  return (
    <>
      <div className="row ht-100v flex-row-reverse no-gutters">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="signup-form">
            <div className="auth-logo text-center mb-5">
              <div className="row">
                <div className="col-md-2">
                  <img
                    src="assets/images/FaceTokIcon.jpeg"
                    className="logo-img"
                    alt="Logo"
                  />
                </div>
                <div className="col-md-10">
                  <p>Reset Password </p>
                </div>
              </div>
            </div>
            <form>
              {!showChangePasswordForm ? <ResetPasswordForm  handleShowChangePasswordForm={handleShowChangePasswordForm}/> :   <ChangePasswordForm/>}
                
           
              <div className="col-md-12 text-center mt-5">
                  <span className="login__reset_password">
                    Back to login page? <Link to={"/login"}>Login</Link>
                  </span>
                </div>
            </form>
          </div>
        </div>
        <div className="col-md-6 auth-bg-image d-flex justify-content-center align-items-center">
          {/* Add content for the background image if needed */}
        </div>
      </div>

      <div
        className="modal fade fingerprint-modal"
        id="fingerprintModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="fingerprintModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body text-center">
              <h3 className="text-muted display-5">
                Place your Finger on the Device Now
              </h3>
              <img
                src="assets/images/icons/auth-fingerprint.png"
                alt="Fingerprint"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPasswordPage;
