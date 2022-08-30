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
import ContactUs from "./pages/contactUs/Index";
import FAQ from "./pages/faq/Index";
import Login from "./pages/login/Index";
import Register from "./pages/register/Index";
import { PageNotFound } from "./pages/errors/index";

export default function Routes({ isAuthenticated, userRole }) {
  return (
    <BrowserRouter>
      <Switch>
        {/* Routes that need main navbar */}
        <Route path={appRoutes.home} element={<LayoutWithNavBar />}>
          <Route path={appRoutes.home} element={<Home />} />
          <Route path={appRoutes.contactUs} element={<ContactUs />} />
          <Route path={appRoutes.faq} element={<FAQ />} />
          <Route path={appRoutes.login} element={<Login />} />
          <Route path={appRoutes.register} element={<Register />} />
          {/* <Route path={appRoutes.vendors} element={<FAQ />} /> */}
        </Route>
        <Route path="*" element={<PageNotFound />} />
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
