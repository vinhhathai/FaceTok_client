import React from "react";
import { Link } from "react-router-dom";

function LoginPage() {
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
                  <p>LOGIN </p>
                  <span>Let's discovery interested things</span>
                </div>
              </div>
            </div>
            <form action="" method="">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="email"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div className="col-md-12 mb-3">
                 <Link to={'/'}>Forgot password?</Link>
                </div>
                <div className="col-md-6">
                  <label className="custom-control material-checkbox">
                    <input
                      type="checkbox"
                      className="material-control-input"
                    />
                    <span className="material-control-indicator"></span>
                    <span className="material-control-description">
                      Remember Me
                    </span>
                  </label>
                </div>
                <div className="col-md-6 text-right">
                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primary sign-up"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
                
                <div className="col-md-12 text-center mt-5">
                  <span className="go-login">
                    Not yet a member? <a href="sign-up.html">Sign Up</a>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6 auth-bg-image d-flex justify-content-center align-items-center">
          
          
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

export default LoginPage;
