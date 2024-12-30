import { useState } from "react";
import CreatePost from "../CreatePost/CreatePost";
import "./ProfileContent.css"; // Đảm bảo bạn liên kết file CSS

function ProfileContent() {
  const [activeTab, setActiveTab] = useState("Timeline");

  const renderContent = () => {
    switch (activeTab) {
      case "Timeline":
        return <div>Timeline content here...</div>;
      case "About":
        return <div>About content here...</div>;
      case "Friends":
        return <div>Friends content here...</div>;
      case "Media":
        return <div>Media content here...</div>;
      default:
        return null;
    }
  };

  return (<>
   
    <div className="container">
    <CreatePost/>
      {/* Thanh điều hướng */}
      <nav className="nav-bar">
        <button
          className={activeTab === "Timeline" ? "active" : ""}
          onClick={() => setActiveTab("Timeline")}
        >
          Timeline
        </button>
        <button
          className={activeTab === "About" ? "active" : ""}
          onClick={() => setActiveTab("About")}
        >
          About
        </button>
        <button
          className={activeTab === "Friends" ? "active" : ""}
          onClick={() => setActiveTab("Friends")}
        >
          Friends
        </button>
        <button
          className={activeTab === "Media" ? "active" : ""}
          onClick={() => setActiveTab("Media")}
        >
          Media
        </button>
      </nav>

      {/* Nội dung hiển thị */}
      <div className="content">{renderContent()}</div>
    </div>
    </>
  );
  
}

export default ProfileContent;
