import CreatePost from "../CreatingPost/CreatingPost";
import Post from "../Post/Post";
import Sidebar from "../Sidebar/Sidebar";
import WeatherBar from "../WeatherBar/WeatherBar";
import './Content.css'

function Content() {
  return (
    <>
      
          <CreatePost />
          <Post/>
          <Post/>
     
    </>
  );
}

export default Content;
