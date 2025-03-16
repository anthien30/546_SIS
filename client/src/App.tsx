import React, { useEffect, useState, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { CircularProgress } from "@mui/material";

const MainLayout = React.lazy(
  () => import("./components/MainLayout/MainLayout")
);
const Dashboard = React.lazy(() => import("./components/Dashboard/Dashboard"));
const LoginScreen = React.lazy(() => import("./components/Login/LoginScreen"));
const AccountsManagementView = React.lazy(
  () => import("./components/AccountsManagement/AccountsManagementView")
);
const AcademicTermsView = React.lazy(
  () => import("./components/AcademicTerms/AcademicTermsView")
);
const CoursesView = React.lazy(
  () => import("./components/Courses/CoursesView")
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token")
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="App d-flex align-items-center justify-content-center">
      <Router>
        <Suspense
          fallback={
            <div
              style={{
                width: "100%",
                height: "90vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={60} color="primary" />
            </div>
          }
        >
          <Routes>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <LoginScreen />}
            />

            {/* Protected Routes */}
            {isAuthenticated && (
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route
                  path="/accounts-management"
                  element={<AccountsManagementView />}
                />
                <Route path="/academic-terms" element={<AcademicTermsView />} />
                <Route path="/courses" element={<CoursesView />} />
              </Route>
            )}

            {/* Redirect any unmatched routes to / if authenticated, or to /login if not */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
            />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
