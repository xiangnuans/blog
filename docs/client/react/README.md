---
title: React有哪些优化性能的手段？
---


**React DevTools**
React DevTools 提供了一套强大的工具，可用于分析组件层次结构、性能和状态。它能够帮助你定位性能问题，了解组件的渲染过程。

**React Profiler**

React Profiler 是一个用于测量应用性能的工具。通过使用 Profiler，你可以检查组件的渲染时间，找出哪些组件对性能产生了影响。

# 1. **合理使用shouldComponentUpdate或React.memo**

`shouldComponentUpdate` 方法或 `React.memo` 高阶组件可以帮助你控制组件的重新渲染。通过手动实现 `shouldComponentUpdate` 或使用 `React.memo`，你可以避免不必要的重新渲染，提高性能。

# 2. **使用React.memo和PureComponent**

对于函数组件，可以使用 `React.memo` 进行浅层比较，确保只有当组件的 props 发生变化时才进行重新渲染。对于类组件，`PureComponent` 也具有相似的效果

# 3. **React.memo和useCallback**
`React.memo` 可以用于函数组件的浅层比较，而 `useCallback` 可以用于缓存回调函数，以避免在每次渲染时创建新的回调。这两者结合使用可以减少组件的不必要重新渲染。

```js
const MemoizedComponent = React.memo(({ onClick }) => {
  // 组件内容
});

function ParentComponent() {
  const handleClick = useCallback(() => {
    // 处理点击事件
  }, []);

  return <MemoizedComponent onClick={handleClick} />;
}

```

# 4. **优化列表渲染**
使用 keys 来帮助 React 更有效地更新和重用列表中的元素。确保列表项的 key 是唯一且稳定的。

使用唯一且稳定的 `key`：在列表渲染时，确保每个列表项都有一个唯一且稳定的 `key` 属性，这有助于 React 更有效地更新和重用元素。

```js
function MyList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

```

# 5. **React.lazy和Suspense**

使用 `React.lazy` 和 `Suspense` 进行组件的懒加载，这有助于减少初始加载时间，只加载当前视图所需的代码

```js
const MyLazyComponent = React.lazy(() => import('./MyLazyComponent'));

function MyParentComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <MyLazyComponent />
      </Suspense>
    </div>
  );
}

```

# 6. **React Hooks进行状态逻辑的复用**

Hooks 提供了一种更简洁的方式来共享和复用组件之间的状态逻辑。通过使用自定义的 Hook，你可以将状态逻辑从组件中提取出来，实现更好的代码复用

多个组件需要使用相同的状态逻辑

```js
import { useState } from 'react';

function useCounter(initialValue) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount(count + 1);
  };

  return { count, increment };
}

function ComponentA() {
  const { count, increment } = useCounter(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

function ComponentB() {
  const { count, increment } = useCounter(5);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

```

# 7.避免不必要的渲染
组件在每次渲染时都执行了一些耗时的操作。
将耗时的操作移至 `useEffect` 中：确保在 `render` 方法中不执行耗时操作，而是在 `componentDidMount`、`componentDidUpdate` 或 `useEffect` 钩子中执行。

```js
import { useEffect, useState } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 在这里执行耗时操作，例如从 API 获取数据
    fetchData().then(result => setData(result));
  }, []); // 传递空数组作为依赖项，确保只在组件挂载时执行一次

  return (
    <div>
      {data ? <p>Data: {data}</p> : <p>Loading...</p>}
    </div>
  );
}

```

# 8. **使用React.forwardRef：**
`React.forwardRef` 可以用于将 ref 传递到子组件，可以优化一些高阶组件或容器组件的性能。

```js
const ChildComponent = React.forwardRef((props, ref) => {
  // 子组件内容
});

function ParentComponent() {
  const childRef = useRef();

  return <ChildComponent ref={childRef} />;
}

```

# 9. **React.Fragment进行无需额外标签的组件包装**
使用 `<React.Fragment>` 或 `<>` 进行多个子元素的组合，而不引入额外的 DOM 元素。

```jsx
function MyComponent() {
  return (
    <>
      <div>Child 1</div>
      <div>Child 2</div>
    </>
  );
}

```

# 10. **`react-loadable`进行组件级别的代码分割：**
`react-loadable` 是一个方便的工具，它允许你对组件进行代码分割，以便在需要时再进行加载。这有助于减小初始加载大小。

```js
import Loadable from 'react-loadable';

const AsyncComponent = Loadable({
  loader: () => import('./AsyncComponent'),
  loading: () => <div>Loading...</div>,
});

function App() {
  return <AsyncComponent />;
}

```

# 11. **CDN加速静态资源加载**
对于静态资源（如图片、样式表、脚本等），使用内容分发网络（CDN）可以加速这些资源的加载，提高页面的加载速度
