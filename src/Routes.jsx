import React from "react";
import {
  Route,
  Routes as Switch,
  Outlet,
  BrowserRouter,
} from "react-router-dom";
import { UpCircleOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";

import Navbar from "./components/navBar/Index";
import { appRoutes } from "./constants/routes";

import Home from "./pages/home/Index";
import Contact from "./pages/contact/Index";
import FAQ from "./pages/faq/Index";
import Login from "./pages/login/Index";
import Register from "./pages/register/Index";
import { VendorsList } from "./pages/vendors";

import { PageNotFound, PageNotAuthorized } from "./pages/errors/index";

export default function Routes({ isAuthenticated, userRole }) {
  return (
    <BrowserRouter>
      <Switch>
        {/* Routes that need main navbar */}
        <Route path={appRoutes.home} element={<LayoutWithNavBar />}>
          <Route path={appRoutes.home} element={<Home />} />
          <Route path={appRoutes.contactUs} element={<Contact />} />
          <Route path={appRoutes.faq} element={<FAQ />} />
          <Route path={appRoutes.vendors} element={<VendorsList />} />
        </Route>

        <Route path={appRoutes.login} element={<Login />} />
        <Route path={appRoutes.register} element={<Register />} />

        <Route path="*" element={<PageNotFound />} />
      </Switch>

      <FloatButton.BackTop
        className="font-24"
        type="primary"
        icon={<UpCircleOutlined />}
      />
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
