const CracoLessPlugin = require("craco-less");
const _ = require("lodash");
const themeData = require("./src/assets/js/theme");

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
