import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
// The useRoutes hook in react-router-dom is a hook that allows
// you to define and manage your application's routes using JavaScript objects instead of JSX
// <Route> components. It provides a functional alternative to the <Routes> component.

import Dashboard from "./components/dashboard/Dashboard.jsx";
import Profile from "./components/user/Profile.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";

import { useAuth } from "./AuthContext.jsx";
import RepositoryDetail from "./components/dashboard/RepoDetails.jsx";
import CreateRepository from "./components/dashboard/CreateRepository.jsx";

const Routes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  // Restore user from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    // Restore auth state
    if (storedUserId && !currentUser) {
      setCurrentUser(storedUserId);
    }

    const path = window.location.pathname;

    // If user is NOT logged in thann only allow login/signup
    if (!storedUserId && !["/login", "/signup"].includes(path)) {
      navigate("/login");
    }

    // If user is logged in thann prevent going back to login
    if (storedUserId && path === "/login") {
      navigate("/");
    }
  }, [currentUser, setCurrentUser, navigate]);

  let element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/repo/:id",
      element: <RepositoryDetail />,
    },
    {
      path: "/create-repository",
      element: <CreateRepository />
    }
  ]);

  return element;
};

export default Routes;
