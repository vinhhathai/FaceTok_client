import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage.jsx";
import ProfilePage from "../pages/ProfilePage/ProfilePage.jsx";
import { useEffect } from "react";
import Cookies from 'js-cookie';
import IndexRoutes from "./IndexRoutes.jsx";


function AuthenticatedRoutes(props) {
    const navigate = useNavigate();

    useEffect(() => {
        //Kiểm tra sự tồn tại của cookie có tên là 'token'
        const token = Cookies.get('token');
       
        if (!token) {
            navigate('/login');
        } 
    },[])
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
