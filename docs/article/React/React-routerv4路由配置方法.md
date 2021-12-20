# React-routerv4路由配置方法

[转载](https://github.com/wayou/wayou.github.io/issues/16)

react-router v4 的到来已经过了一些时日了，注意到官方文档中有篇介绍其新式设计哲学的文章。其中区分了传统静态路由（Static Routing）和新版中引入的动态路由（Dynamic Routing）。

动态路由么，Interesting（呵呵）。 听起来并不是很新鲜，但其实想当然了。这里面存在一个理解误区。需要注意这里定义的 Dynamic Routing，他不是指初始化路由的时候可以加点业务逻辑去动态生成路由配置，也不是指通过路由参数（query）可以动态控制页面的输出。它抛开了传统静态路由在程序渲染前定义好的做法，采用程序在渲染过程中动态生成的方式。

## 静态路由/Static Routing

先来看我们熟悉并惯用的传统静态路由。

```js
React.render((
  <Router>
    <Route path="/" component={App}>
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox} />
    </Route>
  </Router>
), document.body)
```

这里路由进行集中配置，UI 与路由强绑定。

传统静态路由是在页面渲染前声明配置好的。像 Angular，Express, Ember，都是这种方式，如果使用过其中某个框架，一定不会陌生。react-router v4 之前的版本，也是沿袭这一方式的。

## 静态路由的问题

v4 版本将整个库进行重构，并不是拍脑袋决定的。按照官方文档上的记载，Michael 和 Ryan （库的核心作者）感觉现有的实现严重地受 React API 的制约，并且实现方式也不够优雅（后面会讲）。反正就是写起来用起来都不爽。

v4 版本将整个库进行重构，并不是拍脑袋决定的。按照官方文档上的记载，Michael 和 Ryan （库的核心作者）感觉现有的实现严重地受 React API 的制约，并且实现方式也不够优雅（后面会讲）。反正就是写起来用起来都不爽。

缘，妙不可言。

两人心照不宣地想到了一块，都从这次工作坊的分享内容中获得了灵感，即 v4 中引入的动态路由。

所以这次重构是线下碰撞出来的火花。

那么，之前的静态路由，到底有什么问题。本来用得好好的，到这里，不免心生疑惑。诚然，要说问题（Gotchas），那肯定是有的。没有完美的库解决所有人的问题，不然你以为这 4000+ 的 issue 数怎么来的。

话题回到静态路由上来。基于静态配置的方式，让版本来到 v3 的 react-router，难以为继更加复杂的功能，而我们从该库身上期望的还有很多。前面 issue 中，只是用户的问题，作为库的开发维护者，所考虑的是功能实现及程序扩展性的问题。如果不是核心贡献者，想必很难体味其中的韵味。所以在 v4.0.0-beta 这个开发分支的 README  中，react-router 团队对面临的挑战和存在的问题进行了简要阐述，顺便答一些疑解一些惑（FAQ 秀一波）。

其中Why a major version bump? 这一段便说出了现在的一些痛点。

- 路由写法则需要满足约定的格式，你甚至都不能将 <Route> 脱离 <Router> 在组件中任意组合。坦白地说，这一点也不 React。React 理念是可以声明式灵活性进行组件组装的（Declarative Composability）。
  
```js
// NOPE!
const CoolRoute = (props) => <Route {...props} cool={true}/>
```

- 因为其实`<Router /> ` 接管了你的组件，内部它实现了`createElement`，`render`和`createRouterMiddleware`等方法。同时，也需要提供组件生命周期回调，`onEnter`,`onLeave`及`onChange`，而这些生命周期React本身就有`componentWillMount`, `componentWillReceiveProps` 及 `componentWillUnmount`。

v3 Router.js

```js
const propTypes = {
  history: object,
  children: routes,
  routes, // alias for children
  render: func,
  createElement: func,
  onError: func,
  onUpdate: func,

  // PRIVATE: For client-side rehydration of server match.
  matchContext: object
}
```

- 配置路由的过程也是程序结构重现的过程，一级一级的嵌套，和组件在洁面的实图大致对应。但其实我们在写页面过程中，堆积组件时，就已经体现出程序的结构层级了。
- 为了适应代码拆分（code split），引入legetComponent和getChildRoutes。为了支持热替换（hot module replacement），又得整一堆很hack的东西出来
- ...

所以之前应该是方向上出了点偏差。要是接下来的 v4 版本没能解决这些问题，是要负责任的（我指的是对社区）。


## 动态路由

怎么讲？就是不存在路由的概念了，当然也就无需路由配置了。

那我们还怎么切页面？

通过控制组件的渲染，来切页面。

react-router v4 中，请把路由看成普通的 React 组件，传递 props 来正常使用（之前<Route>会忽略掉这些属性），借助它来控制组件的展现。展示的逻辑及权利回归到了组件本身，回归到了熟悉的 React。这样，没有了静态配置的路由规则，取而代之的是程序在运行渲染过程中动态控制的展现。

这便是 v4 中称之为的动态路由。

当路由 <Route> 回归组件后，react-router 提供的那些 API，像上面讨论的那些，就不复存在了，因为它是普通的 React 组件，它的 API 就是 React 提供的那些 API。

曾记否，Linus 大神的警世箴言「Talk is cheap. Show me the code.」所以接下来看一段示例代码，以展示两个路由页的程序在 v3 与 v4 中分别如何实现。

下面的代码来自文章[All About React Router 4](https://css-tricks.com/react-router-4/)

v3:

```js
import { Router, Route, IndexRoute } from 'react-router'

const PrimaryLayout = props => (
  <div className="primary-layout">
    <header>
      Our React Router 3 App
    </header>
    <main>
      {props.children}
    </main>
  </div>
)

const HomePage =() => <div>Home Page</div>
const UsersPage = () => <div>Users Page</div>

const App = () => (
  <Router history={browserHistory}>
    <Route path="/" component={PrimaryLayout}>
      <IndexRoute component={HomePage} />
      <Route path="/users" component={UsersPage} />
    </Route>
  </Router>
)
```

v4:

```js
import { BrowserRouter, Route } from 'react-router-dom'

const PrimaryLayout = () => (
  <div className="primary-layout">
    <header>
      Our React Router 4 App
    </header>
    <main>
      <Route path="/" exact component={HomePage} />
      <Route path="/users" component={UsersPage} />
    </main>
  </div>
)

const HomePage =() => <div>Home Page</div>
const UsersPage = () => <div>Users Page</div>

const App = () => (
  <BrowserRouter>
    <PrimaryLayout />
  </BrowserRouter>
)

render(<App />, document.getElementById('root'))

```

v4 中react-router仓库拆分成了许多个包进行发布

- `react-router`路由基础库
- `react-router-dom` 浏览器中使用的封装
- `react-router-native` React native封装

示例中`BrowserRouter`组件便来自`react-router-dom`这个包

如果之前静态路由的观念根植于心中，那么在 v4 的版本中，似乎看不到路由的影子了，它穿插在了各组件中。这一点在需要嵌套路由（Nested Routes）的场景时尤为明显。

来自官方文档的示例代码

```js
const App = () => (
  <BrowserRouter>
    {/* here's a div */}
    <div>
      {/* here's a Route */}
      <Route path="/tacos" component={Tacos}/>
    </div>
  </BrowserRouter>
)

// when the url matches `/tacos` this component renders
const Tacos  = ({ match }) => (
  // here's a nested div
  <div>
    {/* here's a nested Route,
        match.url helps us make a relative path */}
    <Route
      path={match.url + '/carnitas'}
      component={Carnitas}
    />
  </div>
)
```

上面，<Tacos> 组件展示与否，取决于当前路由是否与 /tacos 匹配。而 <Route> 则可以理解为一个容器型组件，它做的事情很简单，将传入的 path 与当前的 location 比较，匹配则渲染 component 属性传入的组件，否则 return null（实际实现以源码为准）。

由 react-router v3 转到 v4，在思想上的转变还是需要些时间来磨合。正如 react-router 刚发布时，对于将路由写在 jsx 中，我们是拒绝的。

## 响应式路由

说出来你可能不信，改为动态路由的实现方式后，其展现完全由组件控制，所以竟然可以和媒体查询（Media queries）结合，实现不同屏幕大小路由到不同的界面样式。官方的一个示例便展示了这一骚气操作。

```js
const App = () => (
  <AppLayout>
    <Route path="/invoices" component={Invoices}/>
  </AppLayout>
)

const Invoices = () => (
  <Layout>

    {/* always show the nav */}
    <InvoicesNav/>

    <Media query={PRETTY_SMALL}>
      {screenIsSmall => screenIsSmall
        // small screen has no redirect
        ? <Switch>
            <Route exact path="/invoices/dashboard" component={Dashboard}/>
            <Route path="/invoices/:id" component={Invoice}/>
          </Switch>
        // large screen does!
        : <Switch>
            <Route exact path="/invoices/dashboard" component={Dashboard}/>
            <Route path="/invoices/:id" component={Invoice}/>
            <Redirect from="/invoices" to="/invoices/dashboard"/>
          </Switch>
      }
    </Media>
  </Layout>
)
```

[react-media](https://github.com/ReactTraining/react-media)

## 动态路由的问题

尽说了优点，看起来很美好，那新版的动态路由实现方式，社区的人买不买帐，广大人民群众同意不同意呢？

在我看来，

- 不够直观了。你无法知道程序中所有的路由（是时候造一个 sitemap 的轮子了）。
- 测试成了老大难的问题。组件中掺杂了路由逻辑，原本对针对组件的单元测试（功能层面）完全不需要知道路由的存在，而现在就要考虑了。正如文章You might not need React Router
下面的评论：

## 总结

本质上，可以看做是页面自己控制了页面，这个逻辑给到了每个组件本身，而不是由顶级路由配置来决定页面的展示，更加的灵活。路由回归到了组件的本质，拥抱更加纯正的 React，所以如果你在使用 v4 的时候还遇到什么问题的话，那大部分都应该是使用 React 能遇到的问题。
还有一点好处是基于原生 React 组件后，没有自己造的生涩轮子，搭建好基础平台后社区可以基于 React 贡献更多插件。

更加详尽的关于 react-router v4 的东西推荐阅读All About React Router 4（讲真我很奇怪这文章为什么发在了 css-tricks，黑人问号？） ，或者查看这个在线 Demo。

不像硬气的 iOS 每次都墙裂建议所有用户升级（结果证明越升越慢），v4 beta 文档里关于「Do I have to upgrade? 」的回答显得特别务实：

没有必要升级，v2/3 会持续维护（当然不会告诉你所谓的维护仅仅是指合并社区贡献的 bug fix）。不过新项目倒是可以把玩一下的，谁不喜新厌旧呢。
