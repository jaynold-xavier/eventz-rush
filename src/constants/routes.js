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
      return {
        list: this.root + "/events",
        details: this.root + "/event/{id}",
        create: this.root + "/event/create",
        update: this.root + "/event/{id}/update",
      };
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
