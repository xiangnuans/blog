---
title: qiankun的JS沙箱设置和使用
---

在 Qiankun 微前端框架中，JS 沙箱是一项关键的技术，用于隔离和保护子应用之间的 JavaScript 执行环境。JS 沙箱的主要目标是确保每个微前端子应用的 JavaScript 执行环境都是相互隔离的，避免全局变量污染和冲突。

### Qiankun 中 JS 沙箱的功能：

1.  **全局变量隔离：** JS 沙箱通过隔离全局变量，确保每个子应用都有一个独立的全局作用域，防止全局变量的冲突。
1.  **沙箱上下文：** 每个子应用都有一个独立的沙箱上下文，用于存储和管理子应用的运行时状态和数据。
1.  **执行脚本隔离：** 子应用的 JavaScript 脚本在沙箱中执行，确保子应用之间的脚本不会相互影响。
1.  **事件隔离：** 沙箱提供了自定义事件系统，确保每个子应用之间的事件通信是安全的，不会影响其他子应用。


### 配置和使用 JS 沙箱：
- **strictStyleIsolation（严格样式隔离）：**

在 Qiankun 中，你可以通过配置 `sandbox` 来启用和配置 JS 沙箱。以下是一个简单的配置示例：

```js
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'subapp1',
    entry: 'http://localhost:8081',
    container: '#subapp-container',
    activeRule: '/subapp1',
    props: {
      // 自定义配置 JS 沙箱
      sandbox: {
        strictStyleIsolation: true,
      },
    },
  },
  // ...其他子应用配置
]);

start();

```
上述配置中的 `sandbox` 属性用于自定义 JS 沙箱的行为。其中，`strictStyleIsolation` 表示是否启用严格的样式隔离，它会将子应用的样式作用域限制在子应用自身，防止样式冲突


- **sandboxContainer（沙箱容器）：**

`sandboxContainer` 是一个配置项，用于指定子应用的容器元素。默认情况下，Qiankun 会自动创建一个容器元素，但你也可以通过该配置项手动指定容器元素的选择器。


```js
sandbox: {
  sandboxContainer: '#custom-container',
},
```

- **disableSandbox（禁用沙箱）：**
`disableSandbox: true` 表示禁用沙箱。在某些特殊情况下，你可能希望禁用沙箱来提高性能或解决一些不兼容的问题。请注意，禁用沙箱可能会导致一些安全性问题，谨慎使用。


```js
sandbox: {
  disableSandbox: true,
},

```

- **mockWindow（模拟 window 对象）：**
`mockWindow: false` 表示不使用模拟的 `window` 对象。在某些情况下，如果子应用依赖于全局的 `window` 对象，可以通过配置 `mockWindow: false` 来禁止使用模拟的 `window` 对象。

- **loose（松散模式）：**


```js
sandbox: {
  loose: true,
},
```

松散模式的影响：

1.  **跨应用间的 window 对象共享：** 在松散模式下，子应用之间共享同一个全局 `window` 对象。这意味着一个子应用中定义的全局变量可能会被其他子应用访问到。这样做提高了全局变量的可访问性，但也带来了潜在的变量冲突风险。
1.  **样式隔离放宽：** 在松散模式下，对样式的隔离会相对宽松一些。子应用的样式可能会对其他子应用产生影响，因为样式的隔离程度相对较低。

注意事项：

-   **慎用松散模式：** 虽然松散模式提高了一些全局变量的可访问性和样式的隔离宽松度，但同时也增加了变量冲突和样式污染的风险。在使用时需要慎重考虑，并确保了解潜在的影响。
-   **默认值：** 如果不显式设置 `sandbox` 配置项，Qiankun 会默认启用松散模式，这是为了提高兼容性。在一些情况下，可以根据实际需求选择是否开启或关闭松散模式。
-   **保持一致性：** 如果多个子应用中有共享的全局状态或全局变量，确保它们的定义和使用方式保持一致，以降低潜在的冲突风险。

总体来说，松散模式的沙箱配置在一些特定场景下可能是有用的，但在使用时需要谨慎，并充分了解其对全局变量和样式的影响。