---
title: roadhog介绍
date: 2019-04-28 14:31:03
tags: react
---

**roadhog--让create-react-app可配的命令行工具**

库地址：
https://github.com/sorrycc/roadhog


# roadhog是啥？

简单来说，roadhog是可配置的[create-react-app](https://github.com/facebook/create-react-app)


roadhog是一个cli工具，提供server和build两个命令，分别用于本地调试和构建。命令行体验和create-react-app一直，配置略有不同，比如默认开启[css modules](https://github.com/css-modules/css-modules)，然后还提供了JSON格式的配置方式。

# 命名来源？

[http://ow.blizzard.cn/heroes/roadhog](http://ow.blizzard.cn/heroes/roadhog)


# 为啥要有roadhog？

做roadhog有多方面原因：

首先，create-react-app 体验是在太好了，细节做的很到位，比如启动成功后会自动打开浏览器窗口这个操作，会检查当前是否已经有打开当前URL的Tab。**但可惜它并不支持配置**， 比如我们要用less和css-modules，就不能使用了。

另外，我们目前是基于[atool-build](https://github.com/ant-tool/atool-build)和[dora](https://github.com/dora-js/dora)的工具套件。dora有插件机制，atool-build的配置和webpack一样，基于编程。这两种扩展方式太灵活，灵活是有点，单导致我们做功能升级时需要考虑太多的事情，并且无法保证兼容

**纳闷roadhog的配置方式和之前的有何不同呢？**

# 配置方式的选择

我们做cli工具有一段时间了，从 spm2, spm3, atool-build + dora 到现在的 roadhog。(目前 roadhog 并非 atool 的升级版，两者场景不同, atool 扩展性更好) 配置方式从 JSON 到编程，最终又回归到 JSON 。

**roadhog 为啥用 JSON 格式的配置?**

做 atool 的时候我们是用编程的配置方式，**优点是灵活**，可随意改变工具内置的 webpack 配置。

但缺点也很明显：

**1. 配置麻烦**

比如要删除内置的 CommonChunkPlugin，不加注释基本没人能看懂了。

```

// Don't extract common.js and common.css
webpackConfig.plugins = webpackConfig.plugins.filter(function(plugin) {
  return !(plugin instanceof webpack.optimize.CommonsChunkPlugin);
});

```

**2. 工具升级困难**

# roadhog 配置

基于上面的原因，roadhog的配置以JSON格式呈现。

下面是好似目前支持的全部配置项，它们在[roadhog#配置](https://github.com/sorrycc/roadhog#%E9%85%8D%E7%BD%AE)

```
{
  "entry": "src/index.js",
  "disableCSSModules": false,
  "less": false,
  "publicPath": "/",
  "extraBabelPlugins": [],
  "autoprefixer": null,
  "proxy": null,
  "env": null,
}
```
