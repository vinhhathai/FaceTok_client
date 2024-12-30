import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage.jsx";
import ProfilePage from "../pages/ProfilePage/ProfilePage.jsx";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Cập nhật import này
import IndexRoutes from "./IndexRoutes.jsx";

function AuthenticatedRoutes(props) {
  const navigate = useNavigate();
  const [id, setId] = useState(null);

  useEffect(() => {
    // Kiểm tra sự tồn tại của cookie có tên là 'accountInformation'
    const accountInfo = Cookies.get("accountInformation");

    // Nếu token tồn tại, parse chuỗi JSON để lấy accessToken
    if (!accountInfo) {
      navigate("/auth/login");
    }
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search/see-more" element={""} />
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default AuthenticatedRoutes;
