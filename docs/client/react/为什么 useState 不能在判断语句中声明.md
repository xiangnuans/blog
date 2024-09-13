---
title: 为什么 useState 不能在判断语句中声明?

---

官网里写了只在最顶层使用 Hooks。不要在循环，条件或嵌套函数中调用 Hook，确保总是在你的 React 函数的最顶层以及任何 return 之前调用他们。

在React中，组件的状态（state）是通过链表（linked list）来实现的，具体来说，React使用一种称为Fiber的数据结构来管理组件的状态和生命周期。Fiber架构是React 16引入的一种新的协调算法，用于更灵活地处理组件的更新、布局和渲染。

# Fiber 架构简介
Fiber架构的核心思想是将组件的更新任务划分为可中断的小任务单元，通过这种方式实现了更细粒度的控制和优先级调度。Fiber树的节点即为这些任务单元，每个节点表示一个虚拟DOM节点或组件

在Fiber架构中，React的状态（state）以链表的形式组织，这个链表被称为“Fiber链”。每个Fiber节点都包含了组件的状态以及更新、渲染相关的信息。

## React State链表的实现原理
1. **Fiber节点的结构**： 每个Fiber节点都包含了与组件实例相关的状态，例如`memoizedState`用于存储组件的当前状态值。此外，Fiber 节点中还包含了与任务调度、更新等相关的信息。
2.  **单链表的形式：** Fiber 链表实际上是一个单向链表，每个 Fiber 节点通过 `return`、`child`、`sibling` 等指针形成链式结构。`return` 指向父节点，`child` 指向第一个子节点，`sibling` 指向兄弟节点。
3. **状态更新与链表的关系：** 当组件的状态发生变化时，React 会通过 Fiber 链表中的某个节点（通常是根节点）开始遍历整个链表，执行任务单元，完成组件的更新。
4. **优先级调度：** Fiber 架构中引入了优先级调度的概念，每个 Fiber 节点都有一个 `expirationTime` 字段，表示任务的过期时间。React 根据任务的优先级和过期时间来决定任务的执行顺序，保证高优先级的任务先执行。

## 部分源代码示意

以下是 React 源代码的简化示意，用于说明 Fiber 节点的一些关键字段：

```js
// ReactFiber.js

type Fiber = {
  tag: WorkTag,                // 节点类型，如函数组件、类组件等
  key: null | string,          // React 元素的 key
  elementType: any,            // 元素类型，如 div、span
  type: any,                   // 对应的组件类型，如函数组件、类组件的函数
  stateNode: any,              // 与节点关联的实例，即组件实例
  return: Fiber | null,        // 父节点
  child: Fiber | null,         // 第一个子节点
  sibling: Fiber | null,       // 下一个兄弟节点
  // ... 其他字段
};

```

## 协调（Reconciliation）
协调是指 React 如何处理组件的更新。在 Fiber 架构中，协调是通过遍历 Fiber 树来实现的。

1.  **深度优先遍历：** React 使用深度优先遍历算法遍历 Fiber 树。从根节点开始，沿着子节点遍历，直到叶子节点，然后再返回上一层，处理兄弟节点。
1.  **任务单元（UnitOfWork）：** 协调过程中，每个 Fiber 节点都表示一个任务单元。React 通过任务单元的形式将更新任务划分为小单元，可以中断和恢复。每个任务单元有自己的过期时间（`expirationTime`），React 根据过期时间决定任务的优先级。
1.  **任务调度：** 通过任务调度器，React 能够根据任务的优先级和过期时间动态调整任务的执行顺序。这使得 React 能够在保证用户界面流畅性的同时，更灵活地响应不同任务的优先级。

## 双缓存（Dubble Buffering）
在 React Fiber 中，使用双缓存技术来实现高效的渲染。主要有两个 Fiber 树：当前 Fiber 树和工作中的 Fiber 树。

1.  **当前 Fiber 树：** 表示当前渲染到屏幕上的界面。React 通过调度器动态地更新当前 Fiber 树。
1.  **工作中的 Fiber 树：** 在协调过程中，React 对组件树进行的所有更改都在工作中的 Fiber 树上进行。一旦协调完成，工作中的 Fiber 树成为下一次渲染的当前 Fiber 树。

### 任务执行阶段

在 React Fiber 中，任务执行分为三个主要阶段：

1.  **Reconciliation 阶段：** 负责协调更新，构建工作中的 Fiber 树。
1.  **Commit 阶段：** 将工作中的 Fiber 树的更改同步到当前 Fiber 树，并执行真正的 DOM 操作。
1.  **Layout 阶段：** 负责计算布局信息，生成 DOM 树，但并不实际插入到页面中。

### 源代码结构

Fiber 相关的核心源代码主要位于 `ReactFiber.js`、`ReactFiberWorkLoop.js`、`ReactFiberReconciler.js` 等文件中。这些文件包含了任务调度、协调算法、任务执行阶段的具体实现。
