---
title: 微前端主应用hash路由和history路由支持
autoGroup-1: 微前端qiankun
---

微前端，选型使用的是Qiankun，Qiankun 是一个基于微前端架构的 JavaScript 库，用于构建支持多个独立的、协同工作的前端应用。在 Qiankun 中，你可以选择使用 hash 路由或 history 路由，这主要取决于你的项目需求以及对路由的选择。

### 1. **Hash 路由：**

-   Hash 路由是通过 URL 的哈希部分（#）来进行路由的。在 Qiankun 中，当使用 hash 路由时，子应用的路由将会被包含在哈希部分中，例如 `http://localhost:8081/#/subapp1`。这种方式的优势在于它可以很好地与单页应用 (SPA) 配合使用，同时也能规遍浏览器兼容性的问题。
-   在 Qiankun 中配置 hash 路由：


```js
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'subapp1',
    entry: 'http://localhost:8081',
    container: '#subapp-container',
    activeRule: '/subapp1',
  },
  // ...其他子应用配置
]);

start();

```
子应用的 `activeRule` 配置即为哈希路由的路径。


### 2. **History 路由：**
-   History 路由是使用 HTML5 History API 来实现的路由方式，它可以使 URL 更加友好，例如 `http://localhost:8081/subapp1`。这样的路由形式更符合传统的单页应用路由的设计，但需要服务端配置以支持。
-   在 Qiankun 中配置 history 路由：

```js
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'subapp1',
    entry: 'http://localhost:8081',
    container: '#subapp-container',
    activeRule: '/subapp1',
    props: {
      routerMode: 'history', // 指定使用 history 路由
    },
  },
  // ...其他子应用配置
]);

start();

```
-   在子应用中，可以根据 `routerMode` 属性选择使用 hash 路由或 history 路由。

选择使用 hash 路由还是 history 路由取决于你的项目需求以及团队的开发偏好。一般来说，如果需要更好的兼容性和简单的配置，可以选择 hash 路由。如果项目要求使用更友好的 URL，并且服务端可以做相应配置，可以选择 history 路由。

