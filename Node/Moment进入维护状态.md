# Moment 进入维护状态

## Moment.js 进入维护状态意味着：

- 不会再添加新功能；
- 不会将 API 更改为 immutable；
- 不会解决 Tree-shaking 或包体积的问题；
- 不会对其进行任何重大更改
- 可能选择不修复 bug，特别是长期存在的已知 bug

Moment 官方表示，不鼓励开发者在以后的新项目中使用它，但他们考虑到现有项目仍在使用 Moment.js，当遇到以下情况时，Moment 团队会进行处理：

- 当出现严重的安全问题时，团队会给予解决；
- 在 IANA 时区数据库更新后，团队回味 Moment-Timezone 发布更新

## 仍需使用的 changing

Moment 官方列举了需要继续使用 Moment.js 的场景：

### 浏览器的支持

Moment 能在 IE8 下完美运行。相比之下，`Luxon`只能在 IE10 及更高版本上运行，并且需要使用 polyfill 进行操作。如果存在一定要支持旧版本浏览器的情况，则可以使用 Moment.js。但是 Day.js 也可以在 IE8 及更高版本运行，开发者可以尝试使用 Day.js

### 其他库的依赖

有些库，尤其是日期选择器和图形库，很多都将 Moment.js 作为依赖项，如果正在使用这样的组件而找不到替代组件，开发者可以在整个项目中继续使用 Moment.js，而不用再引用另外一个库。

## 替代方案

如果开发者不在上述情况当中，Moment 团队也给出了一些替代方案

### 1、不使用库

一些简单的时间处理需求，可以使用 JavaScript 自带的 Date 和 Intl。Intl 对象可以展示不同时区不同语言的日期格式，同时 Intl 在多数浏览器上都已经有了很好的支持

### 2、Temporal

Temporal 被看作是未来内置的时间日期方案。它是 javaScript 与语言内置的时间和日期 API。现阶段可通过试验性的 polyfil 来尝试。Moment.js 团队表示，希望未来能够完全不需要 JavaScript 的日期和时间库，而是使用语言本身的额功能。

### 3、其他替代库

除了 Temporal 之外，官方还推荐了 Luxon、Day.js、js-Joda 和 date-fns 等设计更优秀的时间日期库。自重 Day.js 凭借着拥有与 Moment.js 几乎相同的 API 而深受广大开发者的喜爱
