# React 组件化

react组件有dom视图和state组成，state是数据中心，它的状态决定着视图的状态。react只负责UI的渲染，与其他框架监听数据动态改变DOM不同，React采用setState来控制视图的更新。setState会自动调用render函数，触发视图的重新渲染，如果仅仅是state数据的变化二没有调用setState，并不会触发更新。说到组件，就必须了解react组件的生命周期

# 组件之间通信

react是单向数据流，自上而下的传递数据。解决复杂组件之间通信的方法很多。一般父子组件通信是最简单的，父组件将一个回调函数传递给子组件，子组件通过this.props直接调用该函数与父组件通信。

如果组件之间嵌套很深，可以使用上下文getChildContext来传递信息，这样在不需要将函数一层层往下传，任何一层的子级都可以通过this.context直接访问，react-redux内部实现就是利用此方法。

兄弟组件之间无法直接通信，它们需要利用同一层的上级作为中转站。

# Redux

redux不是必须的，如果不是复杂的组件通信，逻辑简单，用context就行。redux并不是react特有的，其他框架也可以使用redux。简单说说redux。redux由三部分组成：store、reducer、action

store是一个对象，它主要有三个方法：

- dispatch

用于action分发，当action传入dispatch会立即执行，有时候我们不想它立刻触发，可以在createStore中使用middleware中间件对dispatch进行改造，例如redux-thunk，不过这是react-redux做的事情了

- subscribe

顾名思义，监听器，监听state的变化，这个函数在store调用dispatch时会注册一个listener监听state变化。

- getState

获取store中的state，当我们用action触发reducer改变了state时，需要拿到新的state里面的数据。getState在两个地方会用到，一是通过dispatch提交action后store需要拿到state里面的数据，二是利用subscribe监听到state发生变化后调用它来获取新的state数据。

说了这么多，store的核心代码其实很短：

```
function createStore(reducer) {
  let state = null
  const listeners = []
  const subscribe = listener => listeners.push(listener)
  const getState = () => state
  const dispatch = action => {
    // 覆盖原对象
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }
   // 初始化state
  dispatch({})
  return {
    getState,
    dispatch,
    subscribe
  }
}
```

另一部分，reducer一个纯函数（pure function），它接收一个state和action作为参数，根据action的type返回一个新的state，简单实现如下：

```
const reducer = (state, action) => {
  if (!state) {
    return {
      title: "这是reducer初始化的标题",
      content: "这是reducer初始化的内容"
    }
  }
  switch(action.type) {
    case 'CHANGE_TITLE':
      return {
        ...state,
        title: action.newTitle
      }
    default:
      return state;
  }
}
export default reducer
```

action比较简单，它返回一个对象，其中type属性是必须的，同时也可以传入一些其他的数据。

使用例子如下：

```
constructor(){
  super()
  // state更新重新渲染
  store.subscribe(() => {
    this.setState(store.getState())
  })
}
```

# React-Redux

react-redux则是对redux做了分装，可以在react中直接使用，并且提供了Provider和connect。

Provider是一个组件，它接受store作为props，然后通过context往下传，这样react中任何组件都可以通过context获取store

conntect是一个函数，也是一个高阶组件（HOC），通过传入state和dispatch返回一个新的组件，它的写法是如下