import message from "../../assets/images/icons/left-sidebar/message.png";
import group from "../../assets/images/icons/left-sidebar/group.png";
import findFriend from "../../assets/images/icons/left-sidebar/find-friends.png";

function Sidebar() {
  return (
    <>
    
        <div
          className="col-md-3 newsfeed-left-side sticky-top shadow-sm"
          id="sidebar-wrapper"
        >
          <div className="card newsfeed-user-card h-100">
            <ul className="list-group list-group-flush newsfeed-left-sidebar">
              <li className="list-group-item">
                <h6>Home</h6>
              </li>

              <li className="list-group-item d-flex justify-content-between align-items-center">
                <a href="messages.html" className="sidebar-item">
                  <img src={message} alt="message" />
                  Messages
                </a>
                <span className="badge badge-primary badge-pill">2</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <a href="groups.html" className="sidebar-item">
                  <img src={group} alt="group" />
                  Groups
                </a>
                <span className="badge badge-primary badge-pill">17</span>
              </li>

              <li className="list-group-item d-flex justify-content-between align-items-center">
                <a href="find-friends.html" className="sidebar-item">
                  <img src={findFriend} alt="find-friends" />
                  Find Friends
                </a>
                <span className="badge badge-primary badge-pill">
                  <i className="bx bx-chevron-right"></i>
                </span>
              </li>
            </ul>
          </div>
        </div>
     
    </>
  );
}

export default Sidebar;
