---
title: react 学习
date: 2019-04-27 16:41:57
tags: react
---

# 事件监听和this作用域

## this作用域

箭头函数 VS 普通函数
- 只有一个参数，括号可以参略，
- 只有一行return，{}可以参略，
- 与传统函数相比，作用域不同，箭头函数在哪个对象中调用，this就是哪个对象


```
例：var obj = {
	name = “1”,
	f: funcition() {
		var me = this; //需要重新获取
		window.setTimeout(function(){
			console.log(me.name, ‘in timeout’)
		}, 1000)
	}
	fn: function() {
		setTimeout(
			() => {
				conosle.log(this, ‘箭头函数的this’)
			}， 1000
		)
	}
      }
）
```

## 事件监听（获取原生标签）

比如获取input标签输入,常用到的两个
```
console.log(e.target.value) // target：html标签
console.log(e.nativeEvent)  // 原生事件
```

**受控组件**
输入的内容不会中介出现在HTML，看到的并不是输入的value，是赋值给setState,由state渲染后的显示

```
import React, {Component} from 'react'

export default class Input extends Component {
  constructor() {
    super()
    this.state={
      value: ""
    }
  }
  handleInput(e) {
    console.log(e.target.value) // target：html标签
    console.log(e.nativeEvent)  // 原生事件
    if (e.target.value.length > 10) {
      return
    }
    this.setState({
      value: e.target.value
    })
  }
  render() {
    return(
      <div>
        <input type="text" onInput={(e) => this.handleInput(e)} value={this.value} />
      </div>
    )
  }
}

```

# 核心：state、props、context

![组件的三个属性](../../public/images/react-property.png)

## state应用状态

React通过限制state，使程序状态更加可控

**RULES**

1. state 只能在组件的constructor中初始化

2. state只能使用setState方法更新

3. setState会导致render重新执行，渲染组件和子组件

### 父组件更新会带动自组建同时更新，子组件更新，父组件不会更新

### state用在render中渲染jsx

```
render() {
  return(
    <p> hello! I'm {this.state.happy}</p>
  )
}
```

## props组件间参数

（子组件难免使用父组件指定的参数）

![](../../public/images/props.png)

### 函数组件(没有构造器)

```
const Nav = function(props) {
  return (
    <div>
      {props.title}
      {props.childre}  // 代表传递给它的所有子组件
    </div>
  )
}
// 在App中调用Nav组件
<Nav title="标题">         // 也可以写成{"标题"}
  <h3>这是一个传递的children</h3>
  <h3>这是一个传递的children 2</h3>
</Nav>


// 渲染结果
标题
这是一个传递的children
这是一个传递的children 2
```

### class的使用方式

```
class Button extends Component {
  constructor() {
    super()
  }
  render() {
    return(
      <button type="button">
        {this.props.name}        // 获取父组件传入的参数
      </button>
    )
  }
}

// 在App中调用Button组件
<Nav title="标题">         // 也可以写成{"标题"}
  <h3>这是一个传递的children</h3>
  <h3>这是一个传递的children 2</h3>
  <Button name="点击一下你就上天"></Button> // name获取
</Nav>
```

## context上下文参数传递
（在主组件设置context，参数会自动传递）

在静态类型判断中补充

# 状态提升

![场景](../../public/images/context.png)

![说明](../../public/images/context1.png)

![方案](../../public/images/context2.png)

# 生命周期函数

![生命周期函数](../../public/images/life.png)

 - 装配
![](../../public/images/life1.png)

- 更新（三种方式）

1. setState()
2. 父组件更新时，子组件同时更新
2. forceSetState

# 组件类属性

**defaultProps**

```
static defaultProps = {
  title: "ffff"
}
```
**defaultProps(类型检查)**

```
import PropTypes from 'prop-types'

static propTypes = {
  title: PropTypes.string
}
```

# context实战-状态提升

**父组件**

```

// 静态属性的类型检查
static childContextTypes = {
  themeColor: PropTypes.string
}

// 在getChildContext返回子组件需要的context
getChildContext() {}

```

**子组件**

```

// 自组件用contextTypes静态属性的类型检查
static contextTypes = {
  themeColor: PropTypes.string
}
```






