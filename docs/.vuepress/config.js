const head = require("./configs/headConfig")
const markdown = require("./configs/markdown")
const themeConfig = require("./configs/themeConfig");
const plugins = require('./configs/plugin')

module.exports = {
  title: "郭雁宏的博客",
  base: "/blog/",
  description: "郭雁宏,郭雁宏的博客",
  keywords: "郭雁宏的博客,郭雁宏,前端博客",
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
