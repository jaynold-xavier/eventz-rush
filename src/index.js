import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider, Spin } from "antd";

import reportWebVitals from "./reportWebVitals";

import "./assets/styles/index.scss";

import App from "./App";
import { appTheme } from "./assets/js/theme";
import FlipFlopLoader from "./assets/images/loaders/flipFlop.gif";

Spin.setDefaultIndicator(<img src={FlipFlopLoader} alt="loader" />);

const element = document.getElementById("root");
element.style.setProperty("--color-primary", appTheme.colorPrimary);
const root = ReactDOM.createRoot(element);

root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: appTheme,
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
