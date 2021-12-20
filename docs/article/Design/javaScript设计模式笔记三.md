# JavaScript设计模式- 迭代器

在迭代器模式中，你有一些含有有序聚合数据的对象，这些数据可能在内部用一种复杂的结构存储着，但是你希望提供一种简单的方法来访问这种结构中的每个元素。数据的使用者不需要知道你是怎样组织你的数据的，他们只需要操作一个个独立的元素。

在迭代器模式中，你的对象需要提供一个next()方法。按顺序调用next（）方法必须返回序列中的下一个元素，但是“下一个”在你的特定的数据结构中指什么是由你自己决定的。

假设你的对象叫agg，你可以通过简单地在循环中调用next（）来访问每个数据元素，像这样：

```js
const element;
while(element = agg.next()) {
  // do someting with the element...
  console.log(element);
}
```

在迭代器模式中，聚合对象通常也会提供一个方便的方法hasNext()，这样对象的使用者就可以知道他们已经获取到你数据的最后一个元素。当使用另一种方法--hasNext()--来按顺序访问所有元素时，是像这样的：

```js
while(agg.hasNext()) {
  // do something with the next element...
  console.log(agg.next());
}
```

