---
title: React项目中路由处理方式怎么选？
---

React项目中
- useNavigate
- useHistory
- window


# **`useNavigate`**
1.  -   在 React Router v6 中引入的，`useNavigate` 是一个专门用于在不同路由之间导航的钩子。
    -   它返回一个函数 (`navigate`)，用于以编程方式导航到不同的路由。
    -   示例用法：

```js
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // 在按钮点击时导航到 /other-route
    navigate('/other-route');
  };

  return (
    <button onClick={handleButtonClick}>点击导航到其他路由</button>
  );
}

```

# **`useHistory`**
-   `useHistory` 是 React Router v5 中引入的，用于访问路由历史对象。
-   返回一个包含有关导航历史的信息的对象，包括 `push` 和 `replace` 方法，用于导航到不同的路由。
-   示例用法：


```js
import { useHistory } from 'react-router-dom';

function MyComponent() {
  const history = useHistory();

  const handleButtonClick = () => {
    // 在按钮点击时以 push 的方式导航到 /other-route
    history.push('/other-route');
  };

  return (
    <button onClick={handleButtonClick}>点击以 push 方式导航到其他路由</button>
  );
}

```

# **`window`**
`window` 对象是 JavaScript 中的全局对象，代表浏览器窗口
如果你需要直接使用 `window` 对象进行一些全局相关的处理，比如打开新的浏览器窗口、修改浏览器地址栏等，可以这样做。以下是一个简单的示例：

```js
import React from 'react';

function MyComponent() {
  const handleOpenNewWindow = () => {
    // 打开一个新的浏览器窗口
    window.open('/new-page', '_blank');
  };

  const handleModifyLocation = () => {
    // 修改浏览器地址栏
    window.location.href = '/modified-page';
  };

  return (
    <div>
      <button onClick={handleOpenNewWindow}>在新窗口中打开页面</button>
      <button onClick={handleModifyLocation}>修改浏览器地址栏</button>
    </div>
  );
}

export default MyComponent;

```

# **`总结`**
- 在React中，通常推荐使用`react-router-dom`提供的导航工具，如 `useNavigate` 或 `useHistory`，而不直接依赖于 `window` 对象来处理导航。这是因为 `react-router-dom` 提供了更符合 React 架构和路由库的抽象，能更好地与 React 组件协同工作。
- `useNavigate` 更加专注于提供导航功能，而 `useHistory` 则提供了更多关于导航历史的信息，同时也可以用于导航。在 React Router v6 中，推荐使用 `useNavigate` 进行导航。
- 使用 `window` 对象进行一些全局相关的处理，比如打开新的浏览器窗口、修改浏览器地址栏
