import React, { useState } from "react";
import "./SearchDropdown.css";
import { Link } from "react-router-dom";

function SearchDropdown({ searchResult, avatarFriend1 }) {
  const [requestedMap, setRequestedMap] = useState({});

  const handleAddFriendClick = (index, event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của nút

    const updatedMap = { ...requestedMap };
    updatedMap[index] = !updatedMap[index];
    setRequestedMap(updatedMap);
  };

  // Ngăn dropdown ẩn khi click vào
  const stopHiddingDropDown = (event) => {
    event.stopPropagation();
  };

  return (
    <>
      <ul
        className="dropdown-menu notify-drop nav-drop shadow-sm show search-drop"
        aria-labelledby="searchDropdown"
        onClick={(e) => {
          stopHiddingDropDown(e);
        }}
      >
        {/* Quantity of  search results */}
        <div className="notify-drop-title">
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-6 fs-8">
              Search Results
              <span className="badge badge-pill badge-primary ml-2">
                {searchResult.length}
              </span>
            </div>
          </div>
        </div>

        {/* People are found */}
        <div className="drop-content">
          <h6 className="dropdown-header">Peoples</h6>
          {/* */}
          {searchResult.map((item, index) => (
            <li className="dropdown-item" key={index}>
              <div className="col-md-2 col-sm-2 col-xs-2">
              <Link to={`/profile/detail/${item._id}`}>
                <div className="notify-img">
                  <img src={avatarFriend1} alt="Search result" />
                </div>
                </Link>
              </div>
              <div className="col-md-10 col-sm-10 col-xs-10">
              <Link to={`/profile/detail/${item._id}`}>
                <a href="#" className="notification-user">
                  {item.fullName ? item.fullName : "No search results found"}
                </a>
                <button
                  className={`btn btn-quick-link join-group-btn border text-right float-right ${
                    requestedMap[index] ? "requested" : "add-friend-btn"
                  }`}
                  onClick={(event) => handleAddFriendClick(index, event)} // Truyền thêm event vào hàm xử lý sự kiện
                >
                  {requestedMap[index] ? "Requested" : "Add Friend"}
                </button>
                <p className="time">6 Mutual friends</p>
                </Link>
              </div>
            </li>
          ))}
        </div>
        {/* See more btn */}
        <Link to={"/search/see-more"}>
          <div className="notify-drop-footer text-center">See More</div>
        </Link>
      </ul>
    </>
  );
}

export default SearchDropdown;
