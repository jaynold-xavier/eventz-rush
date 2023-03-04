import React from "react";

export default function EventsIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      xmlSpace="preserve"
      fill="#000"
      width={20}
      {...props}
    >
      <path d="M20 7.4v10.5c0 1.7-1.3 3-3 3H5.9c0 1.1.9 2 2 2H18c2.2 0 4-1.8 4-4V9.4c0-1.1-.9-2-2-2z" />
      <path d="M5 1.1v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12.2c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2h-1v-2h-2v2H7v-2H5zm-1 7h12.2v9H4v-9z" />
      <path d="m13.7 16.3-2.4-1.4L9 16.3l.6-2.7-2.1-1.8 2.8-.2L11.4 9l1.1 2.5 2.8.3-2.1 1.8.5 2.7z" />
      <path
        style={{
          fill: "none",
        }}
        d="M0 0h24v24H0z"
      />
    </svg>
  );
}
