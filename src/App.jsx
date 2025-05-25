import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './core/config/store';
import { routes } from './core/config/routes';
import theme from './core/config/theme';
import ToastContainer from './shared/components/ToastMessage/ToastContainer';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </ThemeProvider>
    </Provider>
  );
}

export default App; 