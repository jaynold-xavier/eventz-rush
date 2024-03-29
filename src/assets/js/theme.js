// #672bd5 complements: #d7ad0d, #c92b28, #30b5c7, #8e1baa
// host theme: #d7ad0d, #ffba00
// vendor theme: #eb5951, #ff735d
// footer section: #c7d3d4ff

// const themeData = {
//   primaryColor: "#24b1c6",
//   linkColor: "#753dff",
//   // linkHoverColor: "#672bd5",
//   // infoColor: "#00bdd7",
//   // processingColor: "#00bdd7",
//   successColor: "#3fb951",
//   warningColor: "#faad14",
//   errorColor: "#ed4337",
//   fontSizeBase: "16px",
//   headingColor: "#001141",
//   // textColor: "#f4f2ff",
//   textColor: "#383144cc",
//   textColorSecondary: "#753dff",
//   // disabledColor: "rgba(254, 247, 255, 0.25)",
//   borderRadiusBase: "4px",
//   borderColorBase: "#dcdcdc",
//   boxShadowBase: "0 2px 8px rgba(254, 247, 255, 0.15)",
// };

const isMobileView = document.documentElement.clientWidth <= 768;
const fontSize = 16;

export const appTheme = {
  colorPrimary: "#6252f1",
  // colorPrimaryActive: "#fff",
  colorLink: "#6252f1",
  colorLinkHover: "#2dc3d9",
  colorLinkActive: "#ffb13d",
  fontSize: isMobileView ? fontSize - 4 : fontSize,
  fontFamily: "Open Sans",
  colorBorder: "#dcdcdc",
  borderRadius: 4,
  fontWeightStrong: 800,
  colorTextHeading: "#0e023e",
  colorText: "#0e023e",
  colorTextSecondary: "#2dc3d9",
  colorBgContainer: "#fafafa",
  colorTextBase: "#0e023e",
  padding: 16,
  paddingContentHorizontal: 16,
  paddingContentVertical: 16,
};

export const navLinkTheme = {
  colorPrimary: "#3bfdb2",
  colorText: "#fff",
  colorLinkHover: "#3bfdb2",
};

export const buttonActionTheme = {
  colorPrimary: "#24b1c6",
  colorText: "#fff",
  colorBorder: "#3bfdb2",
};
