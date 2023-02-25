import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";

import reportWebVitals from "./reportWebVitals";

import "./assets/styles/index.less";

import Routes from "./Routes";
import { appTheme } from "./assets/js/theme";

function getHSL(color) {
  var r = parseInt(color.substr(1, 2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
  var g = parseInt(color.substr(3, 2), 16);
  var b = parseInt(color.substr(5, 2), 16);

  r /= 255;
  g /= 255;
  b /= 255;
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
console.log({ color: getHSL(appTheme.colorPrimary) });

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
      <Routes />
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
