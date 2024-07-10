# Markdown中使用HTML标签

在Markdown中写html标签文本
```html
<h1>这是一个标题</h1>
```

会被直接解析为字符串，标签不显示，

## 原因

网站为避免XSS攻击，例如React中无法在jsx中直接插入HTML（innerHTML）

```jsx

// state
{
  html: '<div>Markdown</div>'
}

//render
<div>{this.state.html}</div>

编译后放在页面时：
<div>Markdown</div>
```

如果是网站本身的在JSX中直接插入HTML，使用的是`dangerouslySetInnerHTML`，操作Markdown

```jsx
<div dangerouslySetInnerHTML={
  __html: "<div>这是一个标题</div>"
}></div>

// 页面显示为
这是一个标题
```

## 解决办法：

- 方法一：用斜杠引号

```html
`<h1>这是一个标题</h1>`
```

- 方法二：对标签进行转义

```html
&lt;h1&gt;这是一个标题&lt;/h1&gt;
```




