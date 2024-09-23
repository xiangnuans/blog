---
title: 深入解析 React 父子组件中 useEffect 的执行顺序与原理
---


在 React 中，当父组件和子组件都使用了 `useEffect` 时，React 遵循一定的渲染顺序和生命周期规则，导致 **子组件的 `useEffect` 会先于父组件的 `useEffect` 执行**。这种行为的原因涉及 React 的渲染流程、协调机制以及副作用的处理顺序。

### 执行顺序概述

1. **渲染阶段：**
   - React 先从父组件开始渲染，再递归渲染其子组件。因此，**渲染顺序是从父组件到子组件**。
   - 当所有组件完成渲染后，React 才开始执行 `useEffect` 钩子。

2. **`useEffect` 的执行顺序：**
   - 虽然渲染是自上而下进行的，但 `useEffect` 的执行是自下而上进行的。也就是说，**子组件的 `useEffect` 先于父组件的 `useEffect` 执行**。
   
### 示例

```jsx
function Parent() {
  useEffect(() => {
    console.log("Parent useEffect");
  }, []);

  return <Child />;
}

function Child() {
  useEffect(() => {
    console.log("Child useEffect");
  }, []);

  return <div>Child Component</div>;
}
```

**执行顺序：**

1. React 先渲染 `Parent` 组件。
2. 然后渲染 `Child` 组件。
3. 渲染完成后，先执行 `Child` 的 `useEffect`，输出 `Child useEffect`。
4. 最后执行 `Parent` 的 `useEffect`，输出 `Parent useEffect`。

### 为什么子组件的 `useEffect` 先执行？

1. **渲染流程决定：**
   - React 会先从父组件开始渲染，递归地渲染子组件。当所有组件的渲染完成后，才会执行 `useEffect`。
   - 由于 `useEffect` 是在渲染完成后触发的，React 会从最底层的子组件开始执行副作用，再逐层向上。

2. **保证父组件的 `useEffect` 依赖子组件的更新：**
   - React 设计这样的执行顺序是为了确保当父组件的 `useEffect` 执行时，子组件已经完全渲染并完成了自己的副作用处理。
   - 这有助于避免父组件依赖子组件的状态或 DOM 元素时出现不一致的情况。例如，父组件在 `useEffect` 中操作子组件的 DOM 时，React 需要确保子组件已经完全加载。

### React 的协调机制

React 的协调（Reconciliation）机制确保所有组件在完成渲染后，`useEffect` 钩子按深度优先的顺序执行，即从最深的子组件开始，再回到父组件。这保证了父组件在其 `useEffect` 中可以依赖子组件的最终状态或渲染结果。

### 总结

React 中 `useEffect` 的执行顺序是**先子后父**，这是由于 React 的渲染流程和协调机制所决定的。它确保了父组件在执行副作用时，子组件已经完成了自己的渲染和副作用处理，避免了状态或 DOM 不一致的问题。这种设计有助于确保组件树中各层的副作用处理正确且顺序合理。

