export const appRoutes = {
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
    get events() {
      return this.root + "/events";
    },
    get photos() {
      return this.root + "/photos";
    },
    get documents() {
      return this.root + "/documents";
    },
    get settings() {
      return this.root + "/settings";
    },
  },
};
