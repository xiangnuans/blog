const head = require("./configs/sidebar")
const markdown = require("./configs/markdown")
const themeConfig = require("./configs/themeConfig");
const plugins = require('./configs/plugin')

module.exports = {
  title: "郭雁宏的博客",
  description: "郭雁宏,郭雁宏的博客",
  keywords: "郭雁宏的博客,郭雁宏,前端博客",
  head,
  lastUpdated: "上次更新",
  markdown,
  themeConfig,
  plugins
};
