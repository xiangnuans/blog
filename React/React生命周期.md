# React生命周期

总体看下React的生命周期图
![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-21-1652a030ed1506e0)

React16废弃的三个生命周期函数

- ~~componentWillMount~~
- ~~componentWillReceiveProps~~
- ~~componentWillUpdate~~


取而代之的是两个新的生命周期函数

- static getDrivedStateFromProps
- getSnapshotBeforeUpdate


我们将React的生命周期分为三个阶段，然后详细讲解每个阶段具体调用了什么函数，这三个阶段是：

- 挂载阶段
- 更新阶段
- 卸载阶段

## 挂载阶段

挂载阶段，也可以理解为组件的初始化阶段，就是我们的组件插入到DOM中，只会发生一次
这个阶段的生命周期函数调用如下：

- constructor
- getDerivedStateFromProps
- ~~componentWillMount/UNSAVE_componentWillMount~~
- render
- componentDidMount

### constructor

组件构造函数，第一个被执行

如果没有显示定义它，我们会拥有一个默认的构造函数

如果显示定义了构造函数，我们必须在构造函数第一行执行super（props）,否则我们无法在构造函数里拿到this对象，这些否属于ES6的知识

在构造函数里面我们一般会做两件事：

- 初始化state对象
- 给自定义方法绑定this（或使用箭头函数，这里不需要绑定）


> 禁止在构造函数中调用setState，可以直接给state设置初始值

### getDerivedStateFromProps

> static getDerivedStateFromProps(nextProps, preState)

一个静态方法，所以不能在这个函数里面使用this，这个函数有两个参数props和state，分别接受到的新参数和当前的state对象，这个函数会返回一个对象用来更新当前的state对象，如果不需要更新可以返回null

该函数会在挂载时，接收到新的props，调用了setState和forceUpdate时被调用


在Reactv16.3时只有在挂载时和接收到新的props被调用， 据说这是官方的失误，后来修复了

这个方法就是为了取而代之之前的~~componentWillMount~~、~~componentWillReceiveProps~~、~~componentWillUpdate~~

当我们接受到新的属性想去修改我们的state，可以使用getDerivedStateFromProps

```js
class ExampleComponent extends React.Component {
  state = {
    isScrollingDown: false,
    lastRow: null
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentRow !== prevState.lastRow) {
        return {
            isScrollingDown:
            nextProps.currentRow > prevState.lastRow,
            lastRow: nextProps.currentRow
        }
    }
    return null
  }
}
```

### ~~componentWillMount/UNSAFE_componentWillMount~~

在16版本这两个方法并存，但是在17版本~~componentWillMount~~，目的是为了向下兼容，对于新的应用，用getDerivedStateFromProps代替它们

由于~~componentWillMount/UNSAFE_componentWillMount~~是在render之前调用，所以就算在这个方法中调用setState也不会触发重新渲染

### render

React中最核心的方法，一个组件中必须要有这个方法

返回的类型有一下集中：

- 原生的DOM，如div
- React组件
- Fragment（片段）
- Portals（插槽）
- 字符串和数字，被渲染成text节点
- Boolean和null，不会渲染任何东西

> 关于Fragment和Portals是React16新增的，如果大家不清楚可以去阅读官方文档，在这里就不展开了

render函数是纯函数，里面只做一件事情，就是返回需要渲染的东西，不应该包含其他的业务逻辑，如数据请求，对于这些业务逻辑请移到componentDidMount和componentDid Update中

### componentDidMount

组件装在之后调用，此时我们可以获取到DOM节点并操作，比如对canvas，svg的操作，服务器请求，订阅都可以写在这个里面，但是记得componentWillUnmount取消订阅

```js
componentDidMount() {
    const { progressCanvas, progressSVG } = this

    const canvas = progressCanvas.current
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.getBoundingClientRect().width
    canvas.height = canvas.getBoundingClientRect().height

    const svg = progressSVG.current
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', 0)
    rect.setAttribute('y', 0)
    rect.setAttribute('width', 0)
    rect.setAttribute('height', svg.getBoundingClientRect().height)
    rect.setAttribute('style', 'fill:red')

    const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
    animate.setAttribute('attributeName', 'width')
    animate.setAttribute('from', 0)
    animate.setAttribute('to', svg.getBoundingClientRect().width)
    animate.setAttribute('begin', '0ms')
    animate.setAttribute('dur', '1684ms')
    animate.setAttribute('repeatCount', 'indefinite')
    animate.setAttribute('calcMode', 'linear')
    rect.appendChild(animate)
    svg.appendChild(rect)
    svg.pauseAnimations()

    this.canvas = canvas
    this.svg = svg
    this.ctx = ctx
 }

```

在componentDidMount中调用setState会出发一次额外的渲染，多调用了一次render函数，但是用户对此没有感知，因为它是在浏览器刷新屏幕前执行，但是我们应该在constructor中初始化我们的state对下行，而不应该在componentDidMount调用state方法

## 更新阶段

更新阶段，当组建的props改变了，或组件内部调用了setState或着forceUpdate发生，会发生多次这个阶段的生命周期函数调用如下：

- ~~componentWillReceiveProps/UNSAFE_componentWillReceiveProps~~
- getDerivedStateFromProps
- shouldComponentUpdate
- ~~componentWillUpdate/UNSAFE_componentWillUpdate~~
- render
- getSnapshotBeforeUpdate
- componentDidUpdate

### ~~componentWillReceiveProps/UNSAFE_componentWillReceiveProps~~

> componentWillReceiveProps(nextProps, prevState)
> UNSAFE_componentWillReceiveProps(nextProps, prevState)

在16版本这两个方法并存，但是在17版本中componentWillReceiveProps被删除，UNSAFE_componentWillReceiveProps，目的是为了做向下兼容，对于新的应用，用getDerivedStateFromProps代替它们


注意，当我们父组件重新渲染的时候，也会导致我们的子组件调用componentWillReceiveProps/UNSAFE_componentWillReceiveProps，即使我们的属性和之前的一样，所以需要我们在这个方法里面去进行判断，如果前后属性不一致才去调用setState
在装载阶段这两个函数不会被触发，在组件内部调用了setState和forceUpdate也不会触发这两个函数

### getDerivedStateFromProps

这个方法在装载阶段已经讲过了，这里不再赘述，记住在更新阶段，无论我们接收到新的属性，调用了setState还是调用了forceUpdate，这个方法都会被调用


### shouldComponentUpdate

> shouldComponentUpdate(nextProps, nextState)

有两个参数nextProps和nextState，表示新的属性和变化之后的state，返回一个布尔值，true表示会触发重新渲染，false表示不会触发重新渲染，默认返回true

注意当我们调用forceUpdate并不会触发此方法

因为默认是返回true，也就是只要接收到新的属性和调用了setState都会触发重新的渲染，这会带来一定的性能问题，所以我们需要将this.props与nextProps以及this.state与nextState进行比较来决定是否返回false，来减少重新渲染

但是官方提倡我们使用PureComponent来减少重新渲染的次数而不是手工编写shouldComponentUpdate代码，具体该怎么选择，全凭开发者自己选择

### ~~componentWillUpdate/UNSAFE_componentWillUpdate~~

> componentWillUpdate(nextProps, nextState)
> UNSAFE_componentWillUpdate(nextProps, nextState)

在16版本这两个方法并存，但是在17版本中~~componentWillUpdate~~被删除，~~UNSAFE_componentWillUpdate~~，目的是为了做向下兼容
在这个方法里，你不能调用setState，因为能走到这个方法，说明shouldComponentUpdate返回true，此时下一个state状态已经被确定，马上就要执行render重新渲染了，否则会导致整个生命周期混乱，在这里也不能请求一些网络数据，因为在异步渲染中，可能会导致网络请求多次，引起一些性能问题，
如果你在这个方法里保存了滚动位置，也是不准确的，还是因为异步渲染的问题，如果你非要获取滚动位置的话，请在getSnapshotBeforeUpdate调用


### render

更新阶段也会触发，装载阶段已经讲过了，不再赘述

### getSnapshotBeforeUpdate

> getSnapshotBeforeUpdate(prevProps, prevState)

这个方法在render之后，componentDidUpdate之前调用，有两个参数prevProps和prevState，表示之前的属性和之前的state，这个函数有一个返回值，会作为第三个参数传给componentDidUpdate，如果你不想要返回值，请返回null，不写的话控制台会有警告

前面说过这个方法时用来代替~~componentWillUpdate/UNSAVE_componentWillUpdate~~，下面举个例子说明下：

```js
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}

```

### componentDidUpdate

> componentDidUpdate(prevProps, prevState, snapshot)

该方法在getSnapshotBeforeUpdate方法之后被调用，有三个参数prevProps，prevState，snapshot，表示之前的props，之前的state，和snapshot。第三个参数是getSnapshotBeforeUpdate返回的
在这个函数里我们可以操作DOM，和发起服务器请求，还可以setState，但是注意一定要用if语句控制，否则会导致无限循环

这个函数里我们可以操作DOM，和发起服务器请求，还可以setState，但是注意一定要用if语句控制，否则会导致无限循环

## 卸载阶段

卸载阶段，当我们的组件被卸载或者销毁了
这个阶段的身影周期函数只有一个：

- componentWillUnmount

### componentWillUnmount

当我们的组件被卸载或者销毁了就会调用过，我们可以在这个函数里清楚一些定时器，取消网络请求，清理无效的DOM元素等垃圾清理工作

注意不要在这个函数里调用setState，因为组件不会重新渲染了

