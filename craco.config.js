const CracoLessPlugin = require("craco-less");
const _ = require("lodash");

// purple complements: #d7ad0d, #c92b28, #30b5c7, #8e1baa
const themeData = {
  primaryColor: "rgba(254, 247, 255, 1)",
  linkColor: "#a0ede7",
  // infoColor: "#00c4b4",
  // processingColor: "#00c4b4",
  // successColor: "#00c4b4",
  warningColor: "#faad14",
  errorColor: "#f73131",
  fontSizeBase: "16px",
  headingColor: "#672bd5",
  textColor: "rgba(254, 247, 255, 1)",
  textColorSecondary: "#672bd5",
  // disabledColor: "rgba(254, 247, 255, 0.25)",
  borderRadiusBase: "4px",
  borderColorBase: "#d9d9d9",
  boxShadowBase: "0 2px 8px rgba(254, 247, 255, 0.15)",
};

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: _.mapKeys(themeData, (value, key) => {
              return `@${_.kebabCase(key)}`;
            }),
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
