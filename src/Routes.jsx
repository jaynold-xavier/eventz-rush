import React from "react";
import { Switch, Route } from "react-router-dom";

import Navbar from "./components/navBar/Index";
import Home from "./pages/home/Index";
import Login from "./pages/login/Index";
import Register from "./pages/register/Index";

export default function Routes({ isAuthenticated, userRole }) {
  return (
    <Switch>
      {/* Routes that need main navbar */}
      <Route path="/" element={<LayoutWithNavBar />}>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Switch>
  );
}

function LayoutWithNavBar({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
