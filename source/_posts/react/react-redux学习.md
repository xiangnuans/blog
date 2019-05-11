---
title: react-reedux学习
date: 2019-04-30 17:51:58
tags: React 前端
---

# redux核心概念和基础原理 (redux)

## redux VS react-redux

**redux（一种系统架构)**

- 单向数据流

- 单store

- 不修改、只返回状态

**react-reduc(结合了redux的react组件)**

- 将redux的state分发到props中

- 提供整体容器Provider组件

## 为什么需要redux？

![](../../../public/images/redux-state.png)

![](../../../public/images/redux-action.png)

## 实现一个简单的状态管理器

## 深入理解store的dispatch、getState、subscribe和reducer

create-store主要功能

- 返回默认state
- 返回修改后的state
![](../../../public/images/redux-core.png)

![](../../../public/images/redux-store.png)

![](../../../public/images/redux-word.png)


# 第二课(react-redux)

## 尝试在react中使用redux

redux中的createStore
import { createStore } from 'redux'
const store = createStore()
getState()  // 获取状态
dispatch()  // 状态分发
subscribe()  // 订阅setState正确更新组件

constructor() {
  super()
  store.subscribe(() => {
    this.setState(store.getState())
  })
}

![](../../../public/images/redux-react.png)

**redux简单结合**

- store是一个局部变量，那么其他组件怎么办？

- react组件和redux高度的耦合，写起来真的方便了吗？

## redux和react的context

![](../../../public/images/redux-context.png)

在context里传递store

![](../../../public/images/redux-context1.png)



## 高阶组件封装及状态分发函数connect

**connect需求原理**

1. 问题一

![](../../../public/images/react_redux_connect.png)

每次获取父组件都要定义,重复定义

```
static contextTypes = {
  store: PropTypes
}
```

connect
```
class Connect extends Component {
  static contextTypes = {
    store: PropTypes.object
  }
  render() {
    return(
      <Title store={this.context.store}></Title>
    )
  }
}

```

2. 问题二：

![](../../../public/images/react_redux_connect1.png)


connect
```
const connect = function(WrappedComponent) {
  return (
    class Connect extends Component {
      static contextTypes = {
        store: PropTypes.object
      }
      render() {
        return(
          <WrappedComponent store={this.context.store}></WrappedComponent>     // 高阶组件
        )  
      }
    }
  )
}
class Title extends Component{
  render() {
    return(
      const {store} = this.props;
      const {title} = store.getState();
    )
  }
}

export default connect(Title)
```

3. 问题三：

![](../../../public/images/react_redux_connect2.png)

![](../../../public/images/react_redux_connect3.png)

改进代码：

```
// 提供包裹组件
const connect = function(mapStateToProps, mapDispatchToProps) {
  return function(WrappedComponent){
    return (
      class Connect extends Component {
        static contextTypes = {
          store: PropTypes.object
        }
        constructor(){
          super()
          this.state={
            allProps: {}
          }
        }
        componentWillMount(){
          const {store} = this.context
          this.updateProps()
          store.subscribe(()=>this.updateProps())
        }
        updateProps() {
          const {store} = this.context;
          const needState = mapStateToProps ? mapStateToProps(store.getState, this.props) : {}
          const needDispatch = mapDispatchToProps ? mapDispatchToProps(store.dispatch, this.props) : {}
          this.setState({
            allProps: {
              ...needState,
              ...needDispatch,
              ...this.props
            }
          })
        }
        render() {
          return(
            <WrappedComponent {...this.state.allProps}></WrappedComponent>     // 高阶组件
          )  
        }
      }
    )
  }
}


// 调用connect

  render() {
    return(
      const {store} = this.props;
      const {title} = store.getState();
    )
  }
}

export default connect()(Title)
```

## 什么是Provider

![](../../../public/images/react_redux_provider.png)


Provider 传递
```
class Provider extends Component {
  staic propTypes = {
    store: PropTypes.object,
    children: PropTypes.any
  }
  static childContextTypes = {
    store: PropTypes.object
  }
  getChildContext() {
    return {
      store: this.props.store
    }
  }
  render() {
    return(
      <div>
        {this.props.children}
      </div>
    )
  }
}
```

# 总结：
![](../../../public/images/react_redux_provider.png)

# 第三课

## 1.安装、使用react-redux组件

![](../../../public/images/redux.png)


## redux高级：组合reducer以及action封装

![](../../../public/images/redux_high1.png)

![](../../../public/images/redux_high2.png)

![](../../../public/images/redux_high3.png)

![](../../../public/images/redux_high4.png)

## 实战：改造井字棋游戏

## 实战：结合react-redux制作todo-list

应用组件/函数

```
import {connect, Provider} from 'react-redux'   // 引入结合redux的react组件
import {createStore} from 'redux' // 引入redux创建的store函数
import reducer from './reducer'
const store = createStore(reducer)  // 创建store
```
# 第四课

## redux-middleware是什么？

## 由patch到middleware（补丁）

![](../../../public/images/react_redux_m1.png)

例子：
![](../../../public/images/react_redux_eg1.png)

**再次定义，第一个会被覆盖掉，如何解决？**

![](../../../public/images/react_redux_m2.png)

例子:

![](../../../public/images/react_redux_eg2.png)

**官方实现：**

![](../../../public/images/react_redux_m3.png)

例子：

![](../../../public/images/react_redux_eg3.png)

ES6写法：
```
const logger = store => next => action => {

}

const store = createStore(reducer, applyMiddleware(logger))
```

## redux同步action死局

action死局?
发起dispatch，传递action，需要立马返回一个新的state，如果是ajax调用（异步）呢？

**解决办法一**

![](../../../public/images/react_redux_sync.png)

## react-thunk中间件实现异步网络请求

**解决办法二**

![](../../../public/images/react_redux_thunnk.png)

1. 引入thunk

2. 把thunk作为redux的中间件

3. 使用dispatch传入函数类型action

例子：

![](../../../public/images/react_redux_thunk.png)