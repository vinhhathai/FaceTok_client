import React, { useState } from "react";

function OTPForm() {
  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <input
              required
              type="number"
              className="form-control"
              name="otp_value"
              placeholder="OTP Code..."
            />
          </div>
        </div>

        <div className="col-md-12 text-center">
          <div className="form-group">
            <button
              type="button" // Changed to button type
              className="btn btn-primary btn-block"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OTPForm;
