const head = require("./configs/headConfig")
const markdown = require("./configs/markdown")
const themeConfig = require("./configs/themeConfig");
const plugins = require('./configs/plugin')

module.exports = {
  title: "向暖的博客",
  base: "/blog/",
  description: "向暖,向暖的博客",
  keywords: "向暖的博客,向暖,前端博客",
  head,
  lastUpdated: "上次更新",
  markdown,
  themeConfig,
  plugins,
  // 解决引入element报错问题
  //   chainWebpack: config => {
  //     config.resolve.alias.set('core-js/library/fn', 'core-js/features')
  //     config.plugins
  //  }
};
