# 语法笔记七：in和exists二者之间的区别和性能影响

mysql中的in语句是把外表和内表做hash连接，而exists语句是对外表做loop循环，梅西loop循环再对内标进行查询。一直大家都认为exists比in语句的效率要搞，这种说法其实是不准的。这个要区分环境的。

如果查询的两个表大小相当，那么用in和exists差别不大。

如果两个表中的一个较小，一个表是大表，则子查询用exists，子查询表小的用in：
例如：表A（小表）、表B（大表）

1. 情景一

```js
// 效率低，用到了A表上cc列的索引；
select * from A where cc in (select cc from B)

// 效率高，用到了B表上cc列的索引
select * from A where exists(select cc from B where cc=A.cc)
相反的
```

2. 情景二

```js
// 效率高，用到了B表上cc列的索引
select * from B where cc in (select cc from A)

// 效率低，用到了A表上cc列的索引
select * from B where exists(select cc from A where cc=B.cc)
```


`not in`和`not exists`如果查询语句使用了`not in`那么内外表都进行全表扫描，没有用到索引；而`not exists`的子查询依然能够用到表山峰的索引。所以无论哪个表大，用`not exists`都比`not in`要快。

3. in与=的区别

```js
// 结果是相同的
select name from student where name in ('zhang','wang','li','zhao');
与
select name from student where name='zhang' or name='li' or name='wang' or name='zhao'
```

