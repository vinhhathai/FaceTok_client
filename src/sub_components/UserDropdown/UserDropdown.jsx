import React from "react";
import { Link } from "react-router-dom";
import './UserDropdown.css'

const UserDropdown = ({ id, profilePicture, handleLogout }) => {
  return (
    <li className="nav-item s-nav dropdown">
        <Link to={`/profile/${id}`} className="nav-link nav-links">
          <div className="menu-user-image">
            <img
              src={
                profilePicture
                  ? profilePicture
                  : "/assets/images/avatar_default.jpg"
              }
              className="menu-user-img ml-1"
              alt="User profile"
            />
          </div>
        </Link>
      <ul className="dropdown-menu">
        <li>
          <Link to={`/profile/${id}`} className="dropdown-item">
            Profile
          </Link>
        </li>
        <li>
          <button className="dropdown-item" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </li>
  );
};

export default UserDropdown;
