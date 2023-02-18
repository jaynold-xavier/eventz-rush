import { random } from "lodash";

import { VENDOR_TYPES } from "../../constants/app";

export const vendors = [
  {
    id: random(),
    username: "jamesIam",
    email: "jay@random.com",
    title: "James Rod",
    type: VENDOR_TYPES.bakery.text,
    description:
      "<p>Sit aute exercitation commodo ullamco fugiat dolor aliquip pariatur aute nostrud Lorem nostrud veniam magna.</p>",
    phone: "7448290434",
    profilePicUrl: "https://randomuser.me/api/portraits/men/79.jpg",
    status: "Unavailable",
  },
  {
    id: random(),
    username: "jamesIam",
    email: "tell@random.com",
    title: "James Rod",
    type: VENDOR_TYPES.musicians.text,
    description:
      "<p>Sit aute exercitation commodo ullamco fugiat dolor aliquip pariatur aute nostrud Lorem nostrud veniam magna.</p>",
    phone: "7448290434",
    profilePicUrl: "https://randomuser.me/api/portraits/men/59.jpg",
    status: "Available",
  },
  {
    id: random(),
    username: "jamesIam",
    email: "2342@random.com",
    title: "James Rod",
    type: VENDOR_TYPES.media.text,
    description:
      "<p>Sit aute exercitation commodo ullamco fugiat dolor aliquip pariatur aute nostrud Lorem nostrud veniam magna.</p>",
    phone: "7448290434",
    profilePicUrl: "https://randomuser.me/api/portraits/men/29.jpg",
    status: "Unavailable",
  },
  {
    id: random(),
    username: "jamesIam",
    email: "2342@random.com",
    title: "James Rod",
    type: VENDOR_TYPES.venueProviders.text,
    description:
      "<p>Sit aute exercitation commodo ullamco fugiat dolor aliquip pariatur aute nostrud Lorem nostrud veniam magna.</p>",
    phone: "7448290434",
    profilePicUrl: "https://randomuser.me/api/portraits/men/19.jpg",
    status: "Available",
  },
];

export const vendor = {
  id: random(),
  username: "jamesIam",
  email: "jay@random.com",
  title: "James Rod",
  type: VENDOR_TYPES.caterers.text,
  description:
    "<p>Sit aute exercitation commodo ullamco fugiat dolor aliquip pariatur aute nostrud Lorem nostrud veniam magna.</p>",
  services:
    "<p>Sit aute exercitation commodo ullamco fugiat dolor aliquip pariatur aute nostrud Lorem nostrud veniam magna.</p>",
  phone: "7448290434",
  profilePicUrl: "https://randomuser.me/api/portraits/men/79.jpg",
  status: "Available",
  experience: 5,
};
