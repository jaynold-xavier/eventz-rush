import { random } from "lodash";

import { VENDOR_TYPES } from "../../constants/app";

export const vendors = [
  {
    id: random(),
    username: "jamesIam",
    email: "jay@random.com",
    title: "James Rod",
    type: VENDOR_TYPES.bakery,
    details: "<p>Test</p>",
    phone: "7448290434",
    profilePicUrl: "https://randomuser.me/api/portraits/men/79.jpg",
  },
  {
    id: random(),
    username: "jamesIam",
    email: "tell@random.com",
    title: "James Rod",
    type: VENDOR_TYPES.bakery,
    details: "<p>Test</p>",
    phone: "7448290434",
    profilePicUrl: "https://randomuser.me/api/portraits/men/59.jpg",
  },
  {
    id: random(),
    username: "jamesIam",
    email: "2342@random.com",
    title: "James Rod",
    type: VENDOR_TYPES.media,
    details: "<p>Test</p>",
    phone: "7448290434",
    profilePicUrl: "https://randomuser.me/api/portraits/men/29.jpg",
  },
  {
    id: random(),
    username: "jamesIam",
    email: "2342@random.com",
    title: "James Rod",
    type: VENDOR_TYPES.venueProviders,
    details: "<p>Test</p>",
    phone: "7448290434",
    profilePicUrl: "https://randomuser.me/api/portraits/men/19.jpg",
  },
];
