import React from 'react';
import { ToastContainer as ToastifyContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Global Toast Container component
 * 
 * This component should be included once at the root of your application
 * to enable toast notifications throughout the app.
 */
const ToastContainer = () => {
  return (
    <ToastifyContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light" // Can be 'light', 'dark', or 'colored'
    />
  );
};

export default ToastContainer; 