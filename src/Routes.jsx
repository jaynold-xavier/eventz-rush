import React from "react";
import {
  Route,
  Routes as Switch,
  Outlet,
  BrowserRouter,
} from "react-router-dom";
import { UpCircleFilled } from "@ant-design/icons";
import { BackTop } from "antd";

import Navbar from "./components/navBar/Index";
import { appRoutes } from "./constants/routes";

import Home from "./pages/home/Index";
import Contact from "./pages/contact/Index";
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
          <Route path={appRoutes.contact} element={<Contact />} />
          <Route path={appRoutes.faq} element={<FAQ />} />
          <Route path={appRoutes.login} element={<Login />} />
          <Route path={appRoutes.register} element={<Register />} />
          {/* <Route path={appRoutes.vendors} element={<FAQ />} /> */}
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Switch>

      <BackTop>
        <UpCircleFilled style={{ color: "#00c4b4" }} />
      </BackTop>
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
