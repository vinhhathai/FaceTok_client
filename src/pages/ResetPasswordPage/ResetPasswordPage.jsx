import { useState } from "react";
import { Link } from "react-router-dom";

function ResetPasswordPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            placeholder="Email Address"
                                            
                                        />
                                    </div>
                                </div>
                               
                                <div className="col-md-12 text-center">
                                    <div className="form-group">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block"
                                          
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>

                                

                                <div className="col-md-12 text-center mt-5">
                                    <span className="login__reset_password">
                                        Back to login page? <Link to={"/login"}>Login</Link>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-md-6 auth-bg-image d-flex justify-content-center align-items-center">
                    {/* Add content for the background image if needed */}
                </div>
            </div>

            <div className="modal fade fingerprint-modal" id="fingerprintModal" tabIndex="-1" role="dialog" aria-labelledby="fingerprintModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-body text-center">
                            <h3 className="text-muted display-5">Place your Finger on the Device Now</h3>
                            <img src="assets/images/icons/auth-fingerprint.png" alt="Fingerprint" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default ResetPasswordPage;