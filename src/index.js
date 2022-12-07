import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";

import reportWebVitals from "./reportWebVitals";

import "./assets/styles/index.less";

import Routes from "./Routes";
import appTheme from "./assets/js/theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          ...appTheme,
          fontSize:
            document.documentElement.clientWidth <= 768
              ? appTheme.fontSize - 4
              : appTheme.fontSize,
        },
      }}
    >
      <Routes />
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
