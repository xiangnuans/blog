---
title: react常用的几个概念理解
date: 2019-04-29 15:48:50
tags: React
---

# React
https://zh-hans.reactjs.org/docs/components-and-props.html
https://www.taniarascia.com/getting-started-with-react/
https://juejin.im/post/5c9b39e2f265da611f1d9b5f

# Redux
https://www.redux.org.cn/

# React-redux

# React-router（react的路由组件）

# React-router-dom(带有dom绑定的路由)

# Webpack
https://webpack.docschina.org/guides/installation/#%E9%A2%84%E5%85%88%E5%87%86%E5%A4%87


# Next.js/Nuxt.js
https://nextjs.org/learn/basics/getting-started

# UMI（蚂蚁金服前端底层框架）
https://umijs.org/zh/guide/

# Roadhog

# DvaJS(react > redux > redux-saga(异步流程控制) > DvaJS)
https://dvajs.com/guide/#%E7%89%B9%E6%80%A7

# Ant
https://ant.design/docs/react/introduce-cn

# 注意 
## 区别：
- dva 是数据流

- roadhog 是通用工具

- umi 是框架，包含路由和工具，很多的约定，很多的额性能优化，以及开发体验优化

然后，umi和roadhog公用同一个底层[af-webpack](https://github.com/umijs/umi/tree/master/packages/af-webpack),他们在功能上有一定重叠，可以说umi包含roadhog，react项目我会倾向于推荐用umi.

## 数据流问题

目前流行的数据流方案有：

- Flux, 单项数据流方案，以Redux为代表

- Reactive，响应式数据流方案，以Mobx为代表

- 其他，比如rxjs等

## 目前最流行的数据流方案

截止2017.1，最流行的社区React应用架构方案如下：

- 路由： React—Router

- 架构：Redux

- 异步操作：Redux-saga

缺点：要引入多个库，项目结构复杂

