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
import { FloatButton, Layout, Spin } from "antd";
import { isEmpty } from "lodash";

import {
  FAQ,
  Home,
  Privacy,
  Login,
  Register,
  HostDashboard,
  HostEventsList,
  EventCreateWizard,
  EventUpdateWizard,
  EventDetails,
  VendorDashboard,
  VendorEventsList,
  VendorPhotos,
  VendorProfile,
  VendorDetails,
  VendorsList,
  PageNotAuthorized,
  PageNotFound,
} from "./pages";
import { appRoutes } from "./constants/routes";
import { HomeNavBar, HostNavbar, VendorNavbar } from "./components/navBar";
import { HomeFooter } from "./components/page";
import { getInBetweenCharsRegex } from "./helpers/regex";
import { UserContext } from "./contexts";
import { getCurrentUser } from "./services/auth";
import useBackground from "./hooks/useBackground";
import { getUserRole } from "./helpers/auth";
import { USER_ROLES } from "./constants/app";

const { Header, Sider } = Layout;

export default function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    getCurrentUser().then((user) => {
      console.log("init", { user });
      setUser(user);
    });
  });

  const isAuthenticated = !isEmpty(user);
  const isVendor = getUserRole(user) === USER_ROLES.vendor.key;

  if (user === undefined) {
    return (
      <Spin className="app-loader" size="large" tip="LOADING..." spinning />
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop>
        <UserContext.Provider value={{ user, setUser }}>
          <Switch>
            {/* Unsigned Routes */}
            <Route element={<HomeLayout user={user} />}>
              <Route path={appRoutes.home} element={<Home />} />
              <Route path={appRoutes.faq} element={<FAQ />} />
              <Route path={appRoutes.policy} element={<Privacy />} />

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
                <AccountLayout
                  isAuthenticated={isAuthenticated}
                  user={user}
                  isVendor={isVendor}
                />
              }
            >
              <Route
                path={appRoutes.account.dashboard}
                element={
                  isVendor ? (
                    <VendorDashboard user={user} />
                  ) : (
                    <HostDashboard user={user} />
                  )
                }
              />

              <Route
                path={appRoutes.account.events.list}
                element={
                  isVendor ? (
                    <VendorEventsList user={user} />
                  ) : (
                    <HostEventsList user={user} />
                  )
                }
              />

              <Route
                path={processRouteUrl(appRoutes.account.events.details)}
                element={<EventDetails user={user} />}
              />

              <Route
                path={appRoutes.account.events.create}
                element={
                  isVendor ? (
                    <PageNotAuthorized />
                  ) : (
                    <EventCreateWizard user={user} />
                  )
                }
              />

              <Route
                path={processRouteUrl(appRoutes.account.events.update)}
                element={
                  isVendor ? (
                    <PageNotAuthorized />
                  ) : (
                    <EventUpdateWizard user={user} />
                  )
                }
              />

              <Route
                path={appRoutes.account.profile}
                element={
                  isVendor ? (
                    <VendorProfile user={user} />
                  ) : (
                    <PageNotAuthorized />
                  )
                }
              />

              <Route
                path={appRoutes.account.photos}
                element={
                  isVendor ? (
                    <VendorPhotos user={user} />
                  ) : (
                    <PageNotAuthorized />
                  )
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
      <Header>
        <HomeNavBar user={user} />
      </Header>

      <Outlet />

      <HomeFooter />
    </>
  );
}

function AccountLayout({ isAuthenticated, user, isVendor }) {
  const collapsible = window.innerWidth < 1024;
  const [collapsed, setCollapsed] = useState(collapsible);

  const Navbar = isVendor ? VendorNavbar : HostNavbar;

  useBackground("#f5f6fa");
  if (isAuthenticated === undefined) return null;

  if (!isAuthenticated) {
    return <PageNotAuthorized />;
  }

  return (
    <Layout className="account-layout" hasSider>
      <Sider
        width={250}
        collapsed={collapsed}
        collapsedWidth="0"
        onCollapse={(collapsed) => {
          setCollapsed(collapsed);
        }}
        collapsible
      >
        <Navbar user={user} />
      </Sider>

      <Outlet />
    </Layout>
  );
}
//#region

//#region helpers
const findParamPlaceholderRegex = getInBetweenCharsRegex("{", "}");

function processRouteUrl(url) {
  return url.replace(findParamPlaceholderRegex, (char) => {
    const getParamRegex = getInBetweenCharsRegex("{", "}");
    const id = getParamRegex.exec(char);
    return id ? ":" + id[1] : char;
  });
}
//#region

const ScrollToTop = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
};
