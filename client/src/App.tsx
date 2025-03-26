import React, { useEffect, useState, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { CircularProgress } from "@mui/material";
import { userPermissionService } from "./components/Common/subjects/userPermissionSubject";
import axiosInstance from "./config/axiosInstance";
import { Account } from "./components/AccountsManagement/models";
import { meService } from "./components/Common/subjects/meSubject";

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
const SchedulesView = React.lazy(
  () => import("./components/Schedules/SchedulesView")
);

const CurriculumsView = React.lazy(
  () => import("./components/Curriculums/CurriculumsView")
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token")
  );

  const fetchMyAccount = async () => {
    // setIsSearching(true);
    const queryStr = new URLSearchParams({
      username: localStorage.getItem("username")!,
    }).toString();
    try {
      const { data } = await axiosInstance.get<Account[]>(
        `/api/account/search?${queryStr}`
      );
      if (data.length) {
        meService.set({
          data:
            data.find((i) => i.username === localStorage.getItem("username")) ??
            null,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setIsSearching(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    fetchMyAccount();
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
                {userPermissionService.isAdmin() && (
                  <Route
                    path="/accounts-management"
                    element={<AccountsManagementView />}
                  />
                )}
                {userPermissionService.isAdmin() && (
                  <Route
                    path="/academic-terms"
                    element={<AcademicTermsView />}
                  />
                )}
                {userPermissionService.isAdmin() && (
                  <Route path="/courses" element={<CoursesView />} />
                )}
                {userPermissionService.isAdmin() && (
                  <Route path="/curriculums" element={<CurriculumsView />} />
                )}
                <Route path="/schedules" element={<SchedulesView />} />
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
