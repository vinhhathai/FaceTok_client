function SearchDropdown({ avatarFriend1, avatarFriend2, avatarGroup }) {
  return (
    <>
      <ul
        class="dropdown-menu notify-drop nav-drop shadow-sm show"
        aria-labelledby="searchDropdown"
      >

        {/* Quantity of  search results */}
        <div class="notify-drop-title">
          <div class="row">
            <div class="col-md-6 col-sm-6 col-xs-6 fs-8">
              Search Results
              <span class="badge badge-pill badge-primary ml-2">
                29
              </span>
            </div>
          </div>
        </div>

        {/* People are found */}
        <div class="drop-content">
          <h6 class="dropdown-header">Peoples</h6>
          <li class="dropdown-item">
            <div class="col-md-2 col-sm-2 col-xs-2">
              <div class="notify-img">
                <img
                  src={avatarFriend1}
                  alt="Search result"
                />
              </div>
            </div>
            <div class="col-md-10 col-sm-10 col-xs-10">
              <a href="#" class="notification-user">
                Susan P. Jarvis
              </a>
              <a
                href="#"
                class="btn btn-quick-link join-group-btn border text-right float-right"
              >
                Add Friend
              </a>
              <p class="time">6 Mutual friends</p>
            </div>
          </li>
          <li class="dropdown-item">
            <div class="col-md-2 col-sm-2 col-xs-2">
              <div class="notify-img">
                <img
                  src={avatarFriend2}
                  alt="Search result"
                />
              </div>
            </div>
            <div class="col-md-10 col-sm-10 col-xs-10">
              <a href="#" class="notification-user">
                Ruth D. Greene
              </a>
              <a
                href="#"
                class="btn btn-quick-link join-group-btn border text-right float-right"
              >
                Add Friend
              </a>
            </div>
          </li>

          {/* Groups are found */}
          <h6 class="dropdown-header">Groups</h6>
          <li class="dropdown-item">
            <div class="col-md-2 col-sm-2 col-xs-2">
              <div class="notify-img">
                <img
                  src={avatarGroup}
                  alt="Search result"
                />
              </div>
            </div>
            <div class="col-md-10 col-sm-10 col-xs-10">
              <a href="#" class="notification-user">
                Tourism
              </a>
              <a
                href="#"
                class="btn btn-quick-link join-group-btn border text-right float-right"
              >
                Join
              </a>
              <p class="time">2.5k Members 35+ post a week</p>
            </div>
          </li>
          <li class="dropdown-item">
            <div class="col-md-2 col-sm-2 col-xs-2">
              <div class="notify-img">
                <img
                  src="assets/images/groups/group-1.png"
                  alt="Search result"
                />
              </div>
            </div>
            <div class="col-md-10 col-sm-10 col-xs-10">
              <a href="#" class="notification-user">
                Argon Social Network
                <img
                  src="assets/images/theme/verify.png"
                  width="10px"
                  class="verify"
                  alt="Group verified"
                />
              </a>
              <a
                href="#"
                class="btn btn-quick-link join-group-btn border text-right float-right"
              >
                Join
              </a>
              <p class="time">10k Members 20+ post a week</p>
            </div>
          </li>
        </div>
        {/* See more btn */}
        <div class="notify-drop-footer text-center">
          <a href="#">See More</a>
        </div>
      </ul>
    </>
  );
}

export default SearchDropdown;