import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUpPage from "../pages/SignUpPage/SignUpPage.jsx";
import LoginPage from "../pages/LoginPage/LoginPage.jsx";
import ResetPasswordPage from "../pages/ResetPasswordPage/ResetPasswordPage.jsx";
function IndexRoutes(props) {
  return (
    <>
      <Routes>
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage/>} />
      </Routes>
    </>
  );
}

export default IndexRoutes;
