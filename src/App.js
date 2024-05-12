import './App.css';
import Header from './components/Header/Header';
import './assets/css/bootstrap/bootstrap.min.css';
import './assets/css/boxicons.min.css'
import './assets/css/style.css'
import './assets/css/components.css'
import './assets/css/media.css'
import './assets/css/chat.css'
import './assets/css/video.css'
import './assets/css/auth.css'
import './assets/css/forms.css'
// import './assets/js/video.js'
import './assets/js/load.js'

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IndexRoutes from './routes/IndexRoutes.jsx';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes.jsx';

function App() {
  return (<>
    <div className="App">

      <BrowserRouter>
     
          <IndexRoutes/>
          <AuthenticatedRoutes/>
      
      </BrowserRouter>

    </div>
    <ToastContainer /> {/* Đặt ToastContainer ở đây */}
  </>
  );
}

export default App;
