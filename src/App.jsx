import { UpOutlined } from "@ant-design/icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Route,
  Routes as Switch,
  Outlet,
  BrowserRouter,
  useLocation,
  Navigate,
} from "react-router-dom";
import { FloatButton } from "antd";
import { get, isEmpty } from "lodash";

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
  HostDashboard,
  VendorDashboard,
} from "./pages";
import { getInBetweenCharsRegex } from "./helpers/regex";
import { UserContext } from "./contexts";
import { getCurrentUser } from "./services/auth";
import useBackground from "./hooks/useBackground";

export default function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const isAuthenticated = !isEmpty(user);

  if (user === undefined) return null;

  return (
    <BrowserRouter>
      <ScrollToTop>
        <UserContext.Provider value={{ user, setUser }}>
          <Switch>
            {/* Unsigned Routes */}
            <Route path={appRoutes.root} element={<HomeLayout user={user} />}>
              <Route path={appRoutes.home} element={<Home />} />
              <Route path={appRoutes.faq} element={<FAQ />} />

              <Route path={appRoutes.vendors.list} element={<VendorsList />} />
              <Route
                path={processRouteUrl(appRoutes.vendors.details)}
                element={<VendorDetails />}
              />
            </Route>

            <Route
              path={appRoutes.login}
              element={
                isAuthenticated ? <Navigate to={appRoutes.home} /> : <Login />
              }
            />
            <Route
              path={appRoutes.register}
              element={
                isAuthenticated ? (
                  <Navigate to={appRoutes.home} />
                ) : (
                  <Register />
                )
              }
            />

            {/* Signed Routes */}
            <Route
              path={appRoutes.account.root}
              element={<AccountLayout isAuthenticated={isAuthenticated} />}
            >
              <Route
                path={appRoutes.account.dashboard}
                element={
                  get(user, "type") ? <VendorDashboard /> : <HostDashboard />
                }
              />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Switch>

          <FloatButton.BackTop
            className="font-24"
            type="primary"
            icon={<UpOutlined />}
          />
        </UserContext.Provider>
      </ScrollToTop>
    </BrowserRouter>
  );
}

//#region outlets
function HomeLayout({ user }) {
  return (
    <>
      <HomeNavBar user={user} />

      <Outlet />

      <HomePageFooter />
    </>
  );
}

function AccountLayout({ isAuthenticated }) {
  useBackground("linear-gradient(45deg, #c3bcff, #f1f1f1, #c3bcff)");

  if (isAuthenticated === undefined) return null;

  const Container = isAuthenticated ? React.Fragment : PageNotAuthorized;
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
//#region

const findParamPlaceholderRegex = getInBetweenCharsRegex("{", "}");
function processRouteUrl(url) {
  return url.replace(findParamPlaceholderRegex, (char) => {
    const getParamRegex = getInBetweenCharsRegex("{", "}");
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
