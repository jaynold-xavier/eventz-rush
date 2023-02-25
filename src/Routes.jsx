import React, { useLayoutEffect } from "react";
import {
  Route,
  Routes as Switch,
  Outlet,
  BrowserRouter,
  useLocation,
} from "react-router-dom";
import { UpOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";

import { appRoutes } from "./constants/routes";

import { HomePageFooter } from "./components/page";
import { HomeNavBar } from "./components/navBar";

import {
  FAQ,
  Home,
  Login,
  PageNotAuthorized,
  PageNotFound,
  Register,
  VendorDetails,
  VendorsList,
} from "./pages";
import { getInBetweenCharactersRegex } from "./helpers/regex";

export default function Routes({ isAuthenticated, userRole }) {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <Switch>
          {/* Unsigned Routes that need main navbar */}
          <Route path={appRoutes.home} element={<LayoutWithNavBar />}>
            <Route path={appRoutes.home} element={<Home />} />
            <Route path={appRoutes.faq} element={<FAQ />} />
            <Route path={appRoutes.vendors.list} element={<VendorsList />} />
            <Route
              path={processRouteUrl(appRoutes.vendors.details)}
              element={<VendorDetails />}
            />
          </Route>

          <Route path={appRoutes.login} element={<Login />} />
          <Route path={appRoutes.register} element={<Register />} />

          <Route path="*" element={<PageNotFound />} />
        </Switch>

        <FloatButton.BackTop
          className="font-24"
          type="primary"
          icon={<UpOutlined />}
        />
      </ScrollToTop>
    </BrowserRouter>
  );
}

//#region outlets
function LayoutWithNavBar() {
  return (
    <>
      <HomeNavBar />
      <Outlet />

      {/* <br />
      <br /> */}

      <HomePageFooter />
    </>
  );
}
//#region

const findParamPlaceholderRegex = getInBetweenCharactersRegex("{", "}");
function processRouteUrl(url) {
  return url.replace(findParamPlaceholderRegex, (char) => {
    const getParamRegex = getInBetweenCharactersRegex("{", "}");
    const id = getParamRegex.exec(char);
    return id ? ":" + id[1] : char;
  });
}

const ScrollToTop = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
};
