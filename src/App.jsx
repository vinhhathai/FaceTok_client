import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { store } from "@core/config/store";
import { routes } from "@core/config/routes";
import theme from "@core/config/theme";
import ToastContainer from "@components/ToastMessage/ToastContainer";
import AuthProvider from "@components/AuthProvider/AuthProvider";
import { SocketProvider } from "@contexts/SocketContext";
// ádsadasdsadasasd
// Phân tách auth routes và protected routes
function App() {
  // Xác định đường dẫn đăng nhập
  const authPaths = ["/login", "/register", "/forgot-password", "/verify-email"];

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <Routes>
              {/* Auth routes - không cần socket */}
              {routes
                .filter((route) => authPaths.includes(route.path))
                .map((route, index) => (
                  <Route
                    key={`auth-${index}`}
                    path={route.path}
                    element={route.element}
                  />
                ))}

              {/* Root redirect */}
              {routes
                .filter((route) => route.path === "/")
                .map((route, index) => (
                  <Route
                    key={`root-${index}`}
                    path={route.path}
                    element={route.element}
                  />
                ))}

              {/* Các route yêu cầu đăng nhập - cần socket */}
              <Route
                path="/*"
                element={
                  <SocketProvider>
                    <Routes>
                      {routes
                        .filter(
                          (route) =>
                            !authPaths.includes(route.path) &&
                            route.path !== "/" &&
                            route.path !== "*"
                        )
                        .map((route, index) => (
                          <Route
                            key={`protected-${index}`}
                            path={route.path.replace(/^\//, "")}
                            element={route.element}
                          />
                        ))}
                    </Routes>
                  </SocketProvider>
                }
              />

              {/* Catch-all route */}
              {routes
                .filter((route) => route.path === "*")
                .map((route, index) => (
                  <Route
                    key={`catchall-${index}`}
                    path="*"
                    element={route.element}
                  />
                ))}
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
