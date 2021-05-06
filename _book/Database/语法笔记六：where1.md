# 语法笔记六：where 1

## 问题
进行没有WHERE约束的MySQL查询时，大多数人在查询中使用WHERE 1。但是，省略 WHERE 1 不会影响查询。两者之间有区别吗？被认为是最佳实践吗？

## 这可能不是最佳时间，但是人们有时会使用它来简化动态查询的构建

```js
string sql = "SELECT * FROM mytable WHERE 1 ";
if ( somecondition ) {
   sql += "AND somefield = somevalue ";
}

if ( someothercondition ) {
   sql += "AND someotherfield = someothervalue ";
}

... etc
```

如果没有WHERE 1 in，则需要在每个if快中检查是否需要放入where或 AND
