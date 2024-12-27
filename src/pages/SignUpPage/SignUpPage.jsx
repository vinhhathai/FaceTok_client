// Code đã được chỉnh sửa để thêm dấu sao (*) vào các placeholder và thêm chú thích dưới biểu mẫu
import React, { useState } from "react";
import logo from "../../assets/images/logo-64x64.png";
import "./SignUpPage.css";
import DayMonthYear from "../../sub_components/DayMonthYear/DayMonthYear";
import signUpApi from "../../api/signUpApi";
import moment from "moment";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dayMonthYear, setDayMonthYear] = useState("");
  const navigate = useNavigate();

  const handleDayMonthYearChange = (newDayMonthYear) => {
    setDayMonthYear(newDayMonthYear); // Lưu giá trị dayMonthYear vào state
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Thực hiện kiểm tra xem các trường đã được điền đầy đủ hay chưa
    if (!username || !password || !confirmPassword || !email) {
      alert("Please enter all input!");
      return;
    }

    // Thực hiện kiểm tra mật khẩu và mật khẩu xác nhận có khớp nhau hay không
    if (password !== confirmPassword) {
      alert("Password and confirm password is invalid!");
      return;
    }

    // Nếu thông tin hợp lệ, bạn có thể gửi dữ liệu đăng ký tại đây
    console.log("Thông tin đăng ký:", {
      username,
      password,
      confirmPassword,
      email,
      dayMonthYear,
    });
    const originalDate = dayMonthYear;
    const formattedDate = moment(originalDate, "DD/MM/YYYY").format(
      "DD-MM-YYYY"
    );
    console.log(formattedDate);
    const isSignUp = await signUpApi(
      username,
      password,
      confirmPassword,
      email,
      formattedDate
    );
    console.log(isSignUp.user);

    toast.success("Sign up successful!"); // Hiển thị toast message
     if(isSignUp.user) {
      navigate('/login');
     }
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
                    src={"/assets/images/FaceTokIcon.jpeg"}
                    className="logo-img"
                    alt="Logo"
                  />
                </div>
                <div className="col-md-10">
                  <p>Facetok</p>
                  <span>Enjoy with us!</span>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="pt-5" action="/">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder="Username *"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Password *"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      placeholder="Confirm Password *"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Email Address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <DayMonthYear onDayMonthYearChange={handleDayMonthYearChange} />
                <div className="col-md-12">
                  <p className="agree-privacy">
                    By clicking the Sign Up button below you agreed to our
                    privacy policy and terms of use of our website.
                  </p>
                </div>
                <div className="col-md-6">
                  <span className="go-login">
                    Already a member? <Link to={"/auth/login"}>Login</Link>
                  </span>
                </div>
                <div className="col-md-6 text-right">
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary sign-up">
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6 auth-bg-image d-flex justify-content-center align-items-center"></div>
      </div>
    </>
  );
}

export default SignUpPage;
