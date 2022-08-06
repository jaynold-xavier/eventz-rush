import React from "react";
import {
  Route,
  Routes as Switch,
  Outlet,
  BrowserRouter,
} from "react-router-dom";

import Navbar from "./components/navBar/Index";
import { appRoutes } from "./constants/routes";

import Home from "./pages/home/Index";
import Login from "./pages/login/Index";
import Register from "./pages/register/Index";

export default function Routes({ isAuthenticated, userRole }) {
  return (
    <BrowserRouter>
      <Switch>
        {/* Routes that need main navbar */}
        <Route path={appRoutes.home} element={<LayoutWithNavBar />}>
          <Route path={appRoutes.home} element={<Home />} />
          <Route path={appRoutes.login} element={<Login />} />
          <Route path={appRoutes.register} element={<Register />} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

function LayoutWithNavBar() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
