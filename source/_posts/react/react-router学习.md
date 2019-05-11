---
title: react-router学习
date: 2019-05-07 17:23:29
tags: react 前端
---

# 第一节：React-Router基本路由组件

## 1. 安装和引入React-Router组件

![包说明](../../../public/images/react_router_1.1.png)

![引入与安装](../../../public/images/react_router_1.1.png)

## 2. Link、Router、Router组件功能和路由逻辑

Link与href的区别是不会跳出页面

![react-router-dom](../../../public/images/react_router_2.1.png)

![BrowerRouter](../../../public/images/react_router_2.2.png)

![Link](../../../public/images/react_router_2.3.png)

![Route](../../../public/images/react_router_2.4.png)

![exact](../../../public/images/react_router_2.5.png)

## 3. Switch、Redirect、Prompt组件

![Switch](../../../public/images/react_router_3.1.png)

![Redirect](../../../public/images/react_router_3.2.png)

![Prompt弹窗提示](../../../public/images/react_router_3.3.png)

when 只要跳转就弹窗

# 第二节：React-Router路由参数

## 1. 路由参数传递、接受和匹配

![props](../../../public/images/react_router_2.1.1.png)

![](../../../public/images/react_router_2.1.2.png)

![router](../../../public/images/react_router_2.1.3.png)

![router_props](../../../public/images/react_router_2.1.4.png)

## 2. router props详解match、location、history

![routerProps](../../../public/images/react_router_2.2.1.png)

![match](../../../public/images/react_router_2.2.2.png)

![location](../../../public/images/react_router_2.2.3.png)

![history](../../../public/images/react_router_2.2.4.png)

![historyProperty](../../../public/images/react_router_2.2.5.png)

**栈结构：先进先出**

![historyPush](../../../public/images/react_router_2.2.6.png)

![historyGo](../../../public/images/react_router_2.2.7.png)

# 第三节：React-Router常用路由开发模式

## 1. 自定义路由链接

![](../../../public/images/react_router_3.1.1.png)

![eg1](../../../public/images/react_router_3.1.2.png)

![eg2](../../../public/images/react_router_3.1.3.png)

Route匹配到，里面的match有值，没有匹配到，match为null

children要求类型是函数

**children与render的区别：**

children表示Route的子元素，不管是否匹配到，都会渲染，可以接受routerProps

![eg3](../../../public/images/react_router_3.1.4.png)

![eg4](../../../public/images/react_router_3.1.5.png)

## 2. 遍历生成路由

![eg4](../../../public/images/react_router_3.2.1.png)

问题：Link->Route修改会很多时，不方便

解决：将路由放在一个数组里，修改的时候是需要修改数组里的路由就可以

![eg4](../../../public/images/react_router_3.2.2.png)

![eg4](../../../public/images/react_router_3.2.3.png)

## 3. 表单输入阻止跳转

受控组件必须绑定onChange事件

![eg1](../../../public/images/react_router_3.3.1.png)

![受控组件](../../../public/images/react_router_3.3.2.png)

![eg1](../../../public/images/react_router_3.3.3.png)

去掉prompt用history block方式实现，可以实现，但会报错，因为history的block允许一次
![history实现方式](../../../public/images/react_router_3.3.4.png)

## 4. 路由404处理

## 5. 结合transition的路由跳转

# 第四节：React-Router路由开发实战：京东商城

## 1. 构建数据模型、完成导航租价

## 2. 完成底部导航按钮

## 3. 构建商品列表界面

## 4. 构建商品详情界面

## 5. 构建购物车列表界面

## 使用uuid完善项目、整体总结