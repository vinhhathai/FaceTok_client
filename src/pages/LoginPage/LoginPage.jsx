import React, { useState } from "react";
import { Link } from "react-router-dom";
import loginApi from "../../api/loginApi";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gọi hàm loginApi và xử lý kết quả
        loginApi(username, password)
            .then((loginResult) => {
                console.log(loginResult);
                navigate('/')

            })
            .catch((error) => {
                console.error("Login failed:", error);
            });
    };

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
                        <form>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            placeholder="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
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
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 text-center">
                                    <div className="form-group">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block"
                                            onClick={handleSubmit}
                                        >
                                            Login
                                        </button>
                                    </div>
                                </div>

                                <div className="col-md-12 text-center mt-5">
                                    <span className="go-login">
                                        Not yet a member? <Link to={"/sign-up"}>Sign Up</Link>
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

export default LoginPage;
