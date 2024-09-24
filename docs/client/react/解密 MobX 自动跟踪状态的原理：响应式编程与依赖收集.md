---
title: 解密 MobX 自动跟踪状态的原理：响应式编程与依赖收集
autoGroup-7: 状态管理
---


**引言**  
MobX 是一个非常流行的响应式状态管理库。它的核心理念是将数据标记为“可观察”（observable），并根据数据变化自动触发更新。本文将深入解析 MobX 是如何实现自动状态跟踪的。

**1. 可观察数据（Observable）**

在 MobX 中，状态数据可以通过 `observable` 来标记为可观察的。一旦数据被标记为可观察，MobX 会自动跟踪它，并确保在其发生变化时，依赖于该状态的数据或 UI 能够自动更新。

```javascript
import { observable } from 'mobx';

class Store {
  @observable count = 0;
}
```

**2. 依赖追踪与反应（Reactions）**

MobX 实现自动跟踪状态的关键在于依赖追踪和反应系统。当可观察的数据被读取时，MobX 会自动记录下哪些地方使用了这些数据（如某个函数或组件）。一旦该数据发生变化，MobX 会自动触发更新。

- **Autorun**：这是 MobX 中最基础的反应工具。它会自动追踪函数中使用的所有可观察数据，并在这些数据发生变化时重新运行该函数。

```javascript
import { autorun } from 'mobx';

autorun(() => {
  console.log(store.count); // 当 store.count 变化时，自动重新运行
});
```

- **Reaction**：和 `autorun` 类似，但 `reaction` 提供了更多的控制，可以根据特定的条件触发更新。

```javascript
reaction(
  () => store.count, // 追踪的状态
  (count) => {
    console.log(`Count changed to: ${count}`);
  }
);
```

**3. 派生数据与计算属性（Computed）**

计算属性是基于其他可观察数据派生出来的，MobX 会自动跟踪这些依赖的数据。当依赖的数据变化时，计算属性会自动更新，从而触发 UI 或其他使用该数据的地方更新。

```javascript
import { computed } from 'mobx';

class Store {
  @observable count = 0;

  @computed get doubleCount() {
    return this.count * 2; // 依赖于 count，当 count 变化时，doubleCount 也会更新
  }
}
```

**4. 异步状态管理**

MobX 不仅仅处理同步状态，它对异步状态的支持也非常强大。当你进行异步操作时，MobX 可以自动追踪状态的变化，无需额外的中间件。

```javascript
class Store {
  @observable data = null;
  @observable loading = false;

  @action
  async fetchData() {
    this.loading = true;
    try {
      const response = await fetch('https://api.example.com/data');
      this.data = await response.json();
    } finally {
      this.loading = false;
    }
  }
}
```

**5. 性能优化与 Fiber**

MobX 的响应式编程模式和 React 的 Fiber 协作良好。在使用 MobX 时，React 可以根据优先级调度 UI 更新，减少不必要的重绘。

---

**结语**  
MobX 通过依赖追踪和响应式编程实现了自动状态跟踪，使得开发者能够更加专注于业务逻辑，而不必担心复杂的状态管理和更新逻辑。