const path = require("path");
const CracoAntdPlugin = require("craco-antd");
// const _ = require("lodash");
// const themeData = require("./src/assets/js/theme");

module.exports = {
  plugins: [
    {
      plugin: CracoAntdPlugin,
      // options: {
      //   babelPluginImportOptions: {
      //     libraryName: "antd",
      //     libraryDirectory: "es",
      //     style: true,
      //   },
      // },
    },
  ],
};
