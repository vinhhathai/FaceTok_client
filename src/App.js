import './App.css';
import Header from './components/Header/Header';
import './assets/css/bootstrap/bootstrap.min.css';
import './assets/css/boxicons.min.css'
import './assets/css/style.css'
import './assets/css/components.css'
import './assets/css/media.css'
import './assets/css/chat.css'
import './assets/css/video.css'
// import './assets/js/video.js'
import './assets/js/load.js'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage.jsx';

function App() {
  return (
    <div className="App">
     
     <BrowserRouter>
     <Routes>
     <Route path='/' element={<HomePage/>}/>
      <Route path='/search/see-more' element={''}/>
     </Routes>
     </BrowserRouter>
     
    </div>
  );
}

export default App;
