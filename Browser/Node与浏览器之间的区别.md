# Node与浏览器之间的区别

在Node.js中比啊些JavaScript应用程序与在浏览器中为Web编程有何不同

浏览器和Node均使用JavaScript作为编程语言


构建在浏览器中运行的应用程序与构建在Node.js应用程序完全不同

尽管事实始终是JavaScript，但仍存在一些关键差异，试体验完全不同

作为广泛使用Javascript的前端开发人员，Node应用程序带来了巨大的优势-使用单一语言轻松编程所有内容（前端和后端）

生态系统发生了什么变化。

## 区别一
在浏览器中，大多数时候您正在做的是与DOM或其它Web平台 API（例如cookies）进行交互。当然，那些在Node中不存在。你没有document，window并通过浏览器提供的所有其它对象


而且在浏览器中，我们没有Node.js通过其模块提供的所有不错的API，例如文件系统访问功能

## 区别二
另一个很大的不同是，在Node.js中，您可以控制环境。除非您构建一个任何人都可以在任何地方部署的开源应用程序。否则您将知道将在哪个版本的Node上运行该应用程序。与浏览器环境相比，在浏览器环境中，您无法选择访客会使用的浏览器，这非常方便

这意味着您可以编写你的Node版本支持的所有现代ES6-7-8-9JavaScript

由于JavaScript的移动速度如此之快，但是浏览器可能会变慢，而用户的升级会变慢，有时是在网络上，因此您不得不使用较旧的JavaScript/ECMAScript版本。

您可以使用Babel将代码转换为与ES5兼容，然后再将其交付给浏览器，但是在Node中，则不需要这样做。

## 区别三
另一个区别是Node使用CommonJS模块系统，而在浏览器中，我们开始看到正在实现ES模块标准

实际上，这意味着你暂时require（）在Node和import浏览器中使用。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-12-27-1_VODaYMxARLv6E1fguKYVKA.png)



