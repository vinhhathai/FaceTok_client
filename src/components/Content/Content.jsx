import CreatePost from "../CreatePost/CreatePost";
import Post from "../Post/Post";
import Sidebar from "../Sidebar/Sidebar";
import WeatherBar from "../WeatherBar/WeatherBar";
import './Content.css'

function Content() {
  return (
    <>
      <div className="row newsfeed-right-side-content mt-3 custome-bg">
        <Sidebar />
        <div class="col-md-6 second-section" id="page-content-wrapper">
          <CreatePost />
          <Post/>
          <Post/>
        </div>

        <WeatherBar />
      </div>
    </>
  );
}

export default Content;
