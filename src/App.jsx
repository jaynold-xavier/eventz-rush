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
import { FloatButton, Layout } from "antd";
import { get, isEmpty } from "lodash";

import { appRoutes } from "./constants/routes";

import { HomeFooter } from "./components/page";
import { HomeNavBar, HostNavbar } from "./components/navBar";

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
  HostEvents,
  VendorDashboard,
} from "./pages";
import { getInBetweenCharsRegex } from "./helpers/regex";
import { UserContext } from "./contexts";
import { getCurrentUser } from "./services/auth";
import useBackground from "./hooks/useBackground";

const { Header, Sider } = Layout;

export default function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    getCurrentUser().then((user) => {
      console.log("init", { user });
      setUser(user);
    });
  }, []);

  const isAuthenticated = !isEmpty(user);
  const isVendor = get(user, "type");

  if (user === undefined) return null;

  return (
    <BrowserRouter>
      <ScrollToTop>
        <UserContext.Provider value={{ user, setUser }}>
          <Switch>
            {/* Unsigned Routes */}
            <Route element={<HomeLayout user={user} />}>
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
                isAuthenticated ? (
                  <Navigate to={appRoutes.account.dashboard} />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path={appRoutes.register}
              element={
                isAuthenticated ? (
                  <Navigate to={appRoutes.account.dashboard} />
                ) : (
                  <Register />
                )
              }
            />

            {/* Signed Routes */}
            <Route
              path={appRoutes.account.root}
              element={
                <AccountLayout isAuthenticated={isAuthenticated} user={user} />
              }
            >
              <Route
                path={appRoutes.account.dashboard}
                element={isVendor ? <VendorDashboard /> : <HostDashboard />}
              />

              <Route
                path={appRoutes.account.events}
                element={isVendor ? <HostEvents /> : <HostEvents />}
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
      <Header>
        <HomeNavBar user={user} />
      </Header>

      <Outlet />

      <HomeFooter />
    </>
  );
}

function AccountLayout({ isAuthenticated, user }) {
  const collapsible = window.innerWidth < 1024;
  const [collapsed, setCollapsed] = useState(collapsible);

  useBackground("#f5f6fa");
  // useBackground("linear-gradient(313deg, #eeecff, #f7f6ff, #fff)");

  if (isAuthenticated === undefined) return null;

  if (!isAuthenticated) {
    return <PageNotAuthorized />;
  }

  return (
    <Layout className="account-layout">
      <Sider
        width={250}
        collapsedWidth={50}
        collapsible={collapsible}
        collapsed={collapsed}
        onMouseEnter={(e) => {
          if (!collapsible) return;
          setCollapsed((s) => !s);
        }}
        onMouseLeave={(e) => {
          if (!collapsible) return;
          setCollapsed(true);
        }}
        trigger={null}
      >
        <HostNavbar user={user} collapsed={collapsed} />
      </Sider>

      <Outlet />
    </Layout>
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
