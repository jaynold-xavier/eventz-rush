export const appRoutes = {
  root: "/",
  home: "/",
  faq: "/faq",
  policy: "/policy",
  login: "/login",
  register: "/register",
  vendors: {
    list: "/vendors",
    details: "/vendors/{id}",
  },
  account: {
    root: "/account",
    get dashboard() {
      return this.root + "/dashboard";
    },
  },
};
