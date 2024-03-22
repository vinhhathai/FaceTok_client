import logo from '../../assets/images/logo-64x64.png'
import createIcon from '../../assets/images/icons/navbar/create.png'
import message from '../../assets/images/icons/navbar/message.png'
import notificationIcon from '../../assets/images/icons/navbar/notification.png'
import profileImage from '../../assets/images/users/user-4.jpg'
import settingIcon from '../../assets/images/icons/navbar/settings.png'
import avatarFriend1 from '../../assets/images/users/user-6.png'
import avatarFriend2 from '../../assets/images/users/user-5.png'
import avatarGroup from '../../assets/images/groups/group-2.jpg'
import avatarMessage from '../../assets/images/users/user-6.png'
import Search from '../../sub_components/Search/SearchForm/SearchForm'
import SearchForm from '../../sub_components/Search/SearchForm/SearchForm'

function Header() {
  return (
    <>
      <div class="container-fluid" id="wrapper">
        <div class="row newsfeed-size">

          <nav
            id="navbar-main"
            class="navbar navbar-expand-lg shadow-sm sticky-top"
          >
            <div class="w-100 justify-content-md-center">
              <ul class="nav navbar-nav enable-mobile px-2">
                <li class="nav-item">
                  <button type="button" class="btn nav-link p-0">
                    <img
                      src="assets/images/icons/theme/post-image.png"
                      class="f-nav-icon"
                      alt="Quick make post"
                    />
                  </button>
                </li>
                <li class="nav-item w-100 py-2">
                  <form class="d-inline form-inline w-100 px-4">
                    <div class="input-group">
                      <input
                        type="text"
                        class="form-control search-input"
                        placeholder="Search for people, companies, events and more..."
                        aria-label="Search"
                        aria-describedby="search-addon"
                      />
                      <div class="input-group-append">
                        <button class="btn search-button" type="button">
                          <i class="bx bx-search"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </li>
                <li class="nav-item">
                  <a
                    href="messages.html"
                    class="nav-link nav-icon nav-links message-drop drop-w-tooltip"
                    data-placement="bottom"
                    data-title="Messages"
                  >
                    <img
                      src="assets/images/icons/navbar/message.png"
                      class="message-dropdown f-nav-icon"
                      alt="navbar icon"
                    />
                  </a>
                </li>
              </ul>
              <ul class="navbar-nav mr-5 flex-row" id="main_menu">
                <a class="navbar-brand nav-item mr-lg-5" href="index.html">
                  <img
                    src={logo}
                    width="40"
                    height="40"
                    class="mr-3"
                    alt="Logo"
                  />
                </a>
                <SearchForm  avatarFriend1 = {avatarFriend1} avatarFriend2 = {avatarFriend2} avatarGroup = {avatarGroup}/>
                <li class="nav-item s-nav dropdown d-mobile">
                  <a
                    href="#"
                    class="nav-link nav-icon nav-links drop-w-tooltip"
                    data-toggle="dropdown"
                    data-placement="bottom"
                    data-title="Create"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <img
                      src={createIcon}
                      alt="navbar icon"
                    />
                  </a>
                  <div class="dropdown-menu dropdown-menu-right nav-dropdown-menu ">
                    <a
                      href="#"
                      class="dropdown-item"
                      aria-describedby="createGroup"
                    >
                      <div class="row">
                        <div class="col-md-2">
                          <i class="bx bx-group post-option-icon"></i>
                        </div>
                        <div class="col-md-10">
                          <span class="fs-9">Group</span>
                          <small
                            id="createGroup"
                            class="form-text text-muted"
                          >
                            Find people with shared interests
                          </small>
                        </div>
                      </div>
                    </a>
                    <a
                      href="#"
                      class="dropdown-item"
                      aria-describedby="createEvent"
                    >
                      <div class="row">
                        <div class="col-md-2">
                          <i class="bx bx-calendar post-option-icon"></i>
                        </div>
                        <div class="col-md-10">
                          <span class="fs-9">Event</span>
                          <small
                            id="createEvent"
                            class="form-text text-muted"
                          >
                            bring people together with a public or private
                            event
                          </small>
                        </div>
                      </div>
                    </a>
                  </div>
                </li>
                <li class="nav-item s-nav dropdown message-drop-li">
                  <a
                    href="#"
                    class="nav-link nav-links message-drop drop-w-tooltip"
                    data-toggle="dropdown"
                    data-placement="bottom"
                    data-title="Messages"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <img
                      src={message}
                      class="message-dropdown"
                      alt="navbar icon"
                    />
                    <span class="badge badge-pill badge-primary">1</span>
                  </a>
                  <ul class="dropdown-menu notify-drop dropdown-menu-right nav-drop shadow-sm show">
                    <div class="notify-drop-title">
                      <div class="row">
                        <div class="col-md-6 col-sm-6 col-xs-6 fs-8">
                          Messages | <a href="#">Requests</a>
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-6 text-right">
                          <a href="#" class="notify-right-icon">
                            Mark All as Read
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="drop-content">
                      <li>
                        <div class="col-md-2 col-sm-2 col-xs-2">
                          <div class="notify-img">
                            <img
                              src={avatarMessage}
                              alt="notification user image"
                            />
                          </div>
                        </div>
                        <div class="col-md-10 col-sm-10 col-xs-10">
                          <a href="#" class="notification-user">
                            Susan P. Jarvis
                          </a>
                          <a href="#" class="notify-right-icon">
                            <i class="bx bx-radio-circle-marked"></i>
                          </a>
                          <p class="time">
                            <i class="bx bx-check"></i> This party is going to
                            have a DJ, food, and drinks.
                          </p>
                        </div>
                      </li>
                      <li>
                        <div class="col-md-2 col-sm-2 col-xs-2">
                          <div class="notify-img">
                            <img
                              src={avatarMessage}
                              alt="notification user image"
                            />
                          </div>
                        </div>
                        <div class="col-md-10 col-sm-10 col-xs-10">
                          <a href="#" class="notification-user">
                            Ruth D. Greene
                          </a>
                          <a href="#" class="notify-right-icon">
                            <i class="bx bx-radio-circle-marked"></i>
                          </a>
                          <p class="time">Great, I’ll see you tomorrow!.</p>
                        </div>
                      </li>
                      <li>
                        <div class="col-md-2 col-sm-2 col-xs-2">
                          <div class="notify-img">
                            <img
                              src={avatarMessage}
                              alt="notification user image"
                            />
                          </div>
                        </div>
                        <div class="col-md-10 col-sm-10 col-xs-10">
                          <a href="#" class="notification-user">
                            Kimberly R. Hatfield
                          </a>
                          <a href="#" class="notify-right-icon">
                            <i class="bx bx-radio-circle-marked"></i>
                          </a>
                          <p class="time">yeah, I will be there.</p>
                        </div>
                      </li>
                      <li>
                        <div class="col-md-2 col-sm-2 col-xs-2">
                          <div class="notify-img">
                            <img
                              src={avatarMessage}
                              alt="notification user image"
                            />
                          </div>
                        </div>
                        <div class="col-md-10 col-sm-10 col-xs-10">
                          <a href="#" class="notification-user">
                            Joe S. Feeney
                          </a>
                          <a href="#" class="notify-right-icon">
                            <i class="bx bx-radio-circle-marked"></i>
                          </a>
                          <p class="time">
                            I would really like to bring my friend Jake, if...
                          </p>
                        </div>
                      </li>
                      <li>
                        <div class="col-md-2 col-sm-2 col-xs-2">
                          <div class="notify-img">
                            <img
                              src={avatarMessage}
                              alt="notification user image"
                            />
                          </div>
                        </div>
                        <div class="col-md-10 col-sm-10 col-xs-10">
                          <a href="#" class="notification-user">
                            William S. Willmon
                          </a>
                          <a href="#" class="notify-right-icon">
                            <i class="bx bx-radio-circle-marked"></i>
                          </a>
                          <p class="time">Sure, what can I help you with?</p>
                        </div>
                      </li>
                      <li>
                        <div class="col-md-2 col-sm-2 col-xs-2">
                          <div class="notify-img">
                            <img
                              src={avatarMessage}
                              alt="notification user image"
                            />
                          </div>
                        </div>
                        <div class="col-md-10 col-sm-10 col-xs-10">
                          <a href="#" class="notification-user">
                            Sean S. Smith
                          </a>
                          <a href="#" class="notify-right-icon">
                            <i class="bx bx-radio-circle-marked"></i>
                          </a>
                          <p class="time">Which of those two is best?</p>
                        </div>
                      </li>
                    </div>
                    <div class="notify-drop-footer text-center">
                      <a href="#">See More</a>
                    </div>
                  </ul>
                </li>
                <li class="nav-item s-nav dropdown notification">
                  <a
                    href="#"
                    class="nav-link nav-links rm-drop-mobile drop-w-tooltip"
                    data-toggle="dropdown"
                    data-placement="bottom"
                    data-title="Notifications"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <img
                      src={notificationIcon}
                      class="notification-bell"
                      alt="navbar icon"
                    />
                    <span class="badge badge-pill badge-primary">3</span>
                  </a>
                  <ul class="dropdown-menu notify-drop dropdown-menu-right nav-drop shadow-sm show">
                    <div class="notify-drop-title">
                      <div class="row">
                        <div class="col-md-6 col-sm-6 col-xs-6 fs-8">
                          Notifications
                          <span class="badge badge-pill badge-primary ml-2">
                            3
                          </span>
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-6 text-right">
                          <a href="#" class="notify-right-icon">
                            Mark All as Read
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="drop-content">
                      <li>
                        <div class="col-md-2 col-sm-2 col-xs-2">
                          <div class="notify-img">
                            <img
                              src={avatarMessage}
                              alt="notification user image"
                            />
                          </div>
                        </div>
                        <div class="col-md-10 col-sm-10 col-xs-10">
                          <a href="#" class="notification-user">
                            Sean
                          </a>
                          <span class="notification-type">
                            replied to your comment on a post in{" "}
                          </span>
                          <a href="#" class="notification-for">
                            PHP
                          </a>
                          <a href="#" class="notify-right-icon">
                            <i class="bx bx-radio-circle-marked"></i>
                          </a>
                          <p class="time">
                            <span class="badge badge-pill badge-primary">
                              <i class="bx bxs-group"></i>
                            </span>
                            3h
                          </p>
                        </div>
                      </li>
                      <li>
                        <div class="col-md-2 col-sm-2 col-xs-2">
                          <div class="notify-img">
                            <img
                              src={avatarMessage}
                              alt="notification user image"
                            />
                          </div>
                        </div>
                        <div class="col-md-10 col-sm-10 col-xs-10">
                          <a href="#" class="notification-user">
                            Kimberly
                          </a>
                          <span class="notification-type">
                            likes your comment "I would really...
                          </span>
                          <a href="#" class="notify-right-icon">
                            <i class="bx bx-radio-circle-marked"></i>
                          </a>
                          <p class="time">
                            <span class="badge badge-pill badge-primary">
                              <i class="bx bxs-like"></i>
                            </span>
                            7h
                          </p>
                        </div>
                      </li>
                      <li>
                        <div class="col-md-2 col-sm-2 col-xs-2">
                          <div class="notify-img">
                            <img
                              src={avatarMessage}
                              alt="notification user image"
                            />
                          </div>
                        </div>
                        <div class="col-md-10 col-sm-10 col-xs-10">
                          <span class="notification-type">
                            10 people saw your story before it disappeared.
                            See who saw it.
                          </span>
                          <a href="#" class="notify-right-icon">
                            <i class="bx bx-radio-circle-marked"></i>
                          </a>
                          <p class="time">
                            <span class="badge badge-pill badge-primary">
                              <i class="bx bx-images"></i>
                            </span>
                            23h
                          </p>
                        </div>
                      </li>
                      <li>
                        <div class="col-md-2 col-sm-2 col-xs-2">
                          <div class="notify-img">
                            <img
                              src={avatarMessage}
                              alt="notification user image"
                            />
                          </div>
                        </div>
                        <div class="col-md-10 col-sm-10 col-xs-10">
                          <a href="#" class="notification-user">
                            Michelle
                          </a>
                          <span class="notification-type">posted in </span>
                          <a href="#" class="notification-for">
                            Argon Social Design System
                          </a>
                          <a href="#" class="notify-right-icon">
                            <i class="bx bx-radio-circle-marked"></i>
                          </a>
                          <p class="time">
                            <span class="badge badge-pill badge-primary">
                              <i class="bx bxs-quote-right"></i>
                            </span>
                            1d
                          </p>
                        </div>
                      </li>
                      <li>
                        <div class="col-md-2 col-sm-2 col-xs-2">
                          <div class="notify-img">
                            <img
                              src={avatarMessage}
                              alt="notification user image"
                            />
                          </div>
                        </div>
                        <div class="col-md-10 col-sm-10 col-xs-10">
                          <a href="#" class="notification-user">
                            Karen
                          </a>
                          <span class="notification-type">
                            likes your comment "Sure, here...
                          </span>
                          <a href="#" class="notify-right-icon">
                            <i class="bx bx-radio-circle-marked"></i>
                          </a>
                          <p class="time">
                            <span class="badge badge-pill badge-primary">
                              <i class="bx bxs-like"></i>
                            </span>
                            2d
                          </p>
                        </div>
                      </li>
                      <li>
                        <div class="col-md-2 col-sm-2 col-xs-2">
                          <div class="notify-img">
                            <img
                              src={avatarMessage}
                              alt="notification user image"
                            />
                          </div>
                        </div>
                        <div class="col-md-10 col-sm-10 col-xs-10">
                          <a href="#" class="notification-user">
                            Irwin
                          </a>
                          <span class="notification-type">posted in </span>
                          <a href="#" class="notification-for">
                            Themeforest
                          </a>
                          <a href="#" class="notify-right-icon">
                            <i class="bx bx-radio-circle-marked"></i>
                          </a>
                          <p class="time">
                            <span class="badge badge-pill badge-primary">
                              <i class="bx bxs-quote-right"></i>
                            </span>
                            3d
                          </p>
                        </div>
                      </li>
                    </div>
                    <div class="notify-drop-footer text-center">
                      <a href="#">See More</a>
                    </div>
                  </ul>
                </li>


                <li class="nav-item s-nav">
                  <a href="profile.html" class="nav-link nav-links">
                    <div class="menu-user-image">
                      <img
                        src={profileImage}
                        class="menu-user-img ml-1"
                        alt="Menu Image"
                      />
                    </div>
                  </a>
                </li>
                <li class="nav-item s-nav nav-icon dropdown">
                  <a
                    href="settings.html"
                    data-toggle="dropdown"
                    data-placement="bottom"
                    data-title="Settings"
                    class="nav-link settings-link rm-drop-mobile drop-w-tooltip"
                    id="settings-dropdown"
                  >
                    <img
                      src={settingIcon}
                      class="nav-settings"
                      alt="navbar icon"
                    />
                  </a>
                  <div
                    class="dropdown-menu dropdown-menu-right settings-dropdown shadow-sm show"
                    aria-labelledby="settings-dropdown"
                  >
                    <a class="dropdown-item" href="#">
                      <img
                        src="assets/images/icons/navbar/help.png"
                        alt="Navbar icon"
                      />
                      Help Center
                    </a>
                    <a
                      class="dropdown-item d-flex align-items-center dark-mode"
                      onClick="event.stopPropagation();"
                      href="#"
                    >
                      <img
                        src="assets/images/icons/navbar/moon.png"
                        alt="Navbar icon"
                      />
                      Dark Mode
                      <button
                        type="button"
                        class="btn btn-lg btn-toggle ml-auto"
                        data-toggle="button"
                        aria-pressed="false"
                        autocomplete="off"
                      >
                        <div class="handle"></div>
                      </button>
                    </a>
                    <a class="dropdown-item" href="#">
                      <img
                        src="assets/images/icons/navbar/gear-1.png"
                        alt="Navbar icon"
                      />
                      Settings
                    </a>
                    <a class="dropdown-item logout-btn" href="#">
                      <img
                        src="assets/images/icons/navbar/logout.png"
                        alt="Navbar icon"
                      />
                      Log Out
                    </a>
                  </div>
                </li>
                <button type="button" class="btn nav-link" id="menu-toggle">
                  <img
                    src="assets/images/icons/theme/navs.png"
                    alt="Navbar navs"
                  />
                </button>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Header;
