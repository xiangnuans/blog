---
title: 深入理解 Plasmo 框架：Chrome 扩展生命周期详解与实用案例
autoGroup-1: chrome extension
date: 2024-11-12
---


`Plasmo` 是一个用于构建 Chrome 扩展的框架，提供了方便的生命周期管理，让开发者可以快速构建和调试扩展。下面是 `Plasmo` 主要生命周期的讲解及使用案例。

## 1. `Background Script` 生命周期

- 说明：Background Script 在整个扩展生命周期中持续运行，处理扩展的后台任务。它通常负责与浏览器 API 的交互，例如消息传递、存储访问、网络请求监听等。
-	事件：
	-	`onInstalled`：扩展安装或更新时触发。可以在此事件中执行初始化操作，比如创建默认配置或欢迎页面。
	-	`onMessage`：监听来自其他脚本的消息，常用于与 `content script` 之间的通信。
	-	`onConnect`：用于监听连接的长连接消息。
-	案例：
```js
chrome.runtime.onInstalled.addListener(() => {
  console.log("扩展已安装！");
  // 初始化一些配置
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getData") {
    sendResponse({ data: "这是后台的数据" });
  }
});
```


## 2. `Content Script` 生命周期

-	说明：`Content Script` 直接运行在网页的上下文中，可以访问网页的 DOM，但无法直接使用浏览器 API。`Content Script` 适合在网页加载后，执行一些 DOM 操作或注入内容。
-	事件：
	-	DOMContentLoaded：当页面 DOM 加载完成后执行，可以确保在页面内容加载后开始注入内容。
-	案例：
```js
document.addEventListener("DOMContentLoaded", () => {
  console.log("页面已加载，开始操作 DOM");
  document.body.style.backgroundColor = "yellow";
});
```


## 3.  `Popup Script` 生命周期

-	说明：`Popup Script` 在用户点击扩展图标时加载和运行，它只在用户与弹出窗口交互时存在。在关闭弹窗后，`Popup Script` 也会销毁。
-	事件：
	-	onload：在弹出窗口加载完成时触发，用于初始化界面或从后台加载数据。
-	案例：
```js
document.addEventListener("DOMContentLoaded", async () => {
  const response = await chrome.runtime.sendMessage({ action: "getData" });
  document.getElementById("dataDisplay").innerText = response.data;
});
```

## 4. `Options Page` 生命周期

-	说明：Options Page 是一个独立页面，用户可以在这里配置扩展的设置。它的生命周期和普通网页相似，在用户打开选项页面时运行。
-	事件：
	-	onload：页面加载后触发，用于获取和显示配置数据。
-	案例：
```js
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["setting1"], (result) => {
    document.getElementById("setting1Input").value = result.setting1 || "";
  });

  document.getElementById("saveButton").addEventListener("click", () => {
    const setting1Value = document.getElementById("setting1Input").value;
    chrome.storage.sync.set({ setting1: setting1Value });
  });
});
```

## 5. Message Passing 消息传递

-	说明：Plasmo 提供了消息传递机制，允许不同脚本之间进行通信。通过 `chrome.runtime.sendMessage` 和 `chrome.runtime.onMessage` 可以在不同组件（Background、Content Script、Popup 等）之间传递信息。
-	案例：
	-	在 Content Script 中发送消息：
```js
chrome.runtime.sendMessage({ action: "fetchData" }, (response) => {
  console.log("收到后台数据：", response.data);
});
```


  -	在 `Background Script` 中接收消息并回复：
```js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchData") {
    sendResponse({ data: "这是后台返回的数据" });
  }
});
```



## 总结

`Plasmo` 框架极大简化了 `Chrome` 扩展的生命周期管理，通过上述生命周期的事件和消息传递机制，可以在不同脚本之间实现高效的通信与数据交互，让扩展的功能更加丰富、易于维护。
