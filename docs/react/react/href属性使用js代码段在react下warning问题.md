---
title: href属性使用js代码段在react下warning问题
---

## href属性使用js代码段在react下warning问题

## 快速导航

<TOC />

我们在使用 a 标签的使用，若不想用 a 表爱你的 href 跳转，而要使用自己绑定的 click 或其他时间时，往往会通过插入 js 代码段的方式设置 href 为`javascript:;`或`javascript:void(0);`等达到 href 无跳转的结果。但是这么设置在 React 中会提示`warning：A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed "javascript:;"`，这样的话，我们该如何处理。

## 处理方法

在 `href` 中插入代码段的方式是不可行的，转而可以使用以下方式：

```html
<a href="#" onClick={ (e) => { e.preventDefault() } }></a>
```

## javascript:scroll(0, 0)跳转到顶部

处理方法：

```html
  <a href="#" onClick = {() => window.scrollTo("0", "0");}></a>
```
