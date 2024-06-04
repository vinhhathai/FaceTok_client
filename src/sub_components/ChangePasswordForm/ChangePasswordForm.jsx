import React, { useState } from "react";

function ChangePasswordForm() {
  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <input
              required
              type="text"
              className="form-control"
              name="newPassword"
              placeholder="New password..."
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="form-group">
            <input
              required
              type="text"
              className="form-control"
              name="confirmNewPassword"
              placeholder="Confirm new password..."
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

export default ChangePasswordForm;
