# JavaScript设计模式-外观模式

外观模式是一种很简单的模式，它只是为对象提供了更多选择的接口。是方法保持短小而不是处理太多的工作是一种很好的实践。在这种实践的指导下，你会有一对的方法，而不是一个有着非常多参数的Uber方法。有写时候，两个或者更所的方法会经常被一起调用。在这种情况下，创建另一个将这些重复调用包裹起来的方法就变得有意义了。

例如，在处理浏览器实践的时候，有一下的事件：

- stopPropagation（）
阻止实践冒泡到父节点
- preventDefault（）
阻止浏览器执行默认动作（如打开连接或者提交表单）

这是两个有不同目的的相互独立的方法，他们也应该保持独立，但于此同时，他们也经常被一起调用。所以为了不再应用中到处重复调用这两个方法，你可以创建你一个外观方法来调用它们：

```js
const myevent = {
  // ..
  stop: function(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  // ...
};
```

外观模式也适用于一些浏览器脚本的场景，即将浏览器的差异隐藏在一个外观方法的下面。继续前面的例子，你可以添加一些处理IE中实践API的代码：

```js
const myevent = {
  // ...
  stop: function(e) {
    // others
    if (typeof e.preventDefault === "function"{
      e.preventDefault();
    }
    if (typeof e.stopPropagation ==="function") {
              e.stopPropagation();
          }
          // IE
          if (typeof e.returnValue === "boolean") {
              e.returnValue = false;
          }
          if (typeof e.cancelBubble === "boolean") {
              e.cancelBubble = true;
          }
  }
  // ...
}
```

外观模式在做一些重新设计和重构工作时也很有用。当你想用一个不同的实现来替换某个对象的时候，你可能需要工作相当长时间（一个复杂的对象），于此同时，一些使用这个新对象的代码在被同步编写。你可以先想好新对象的API。然后使用新的API创建一个外观方法在旧的对象前面。使用这种方式，当你完全替换到旧的对象的时候，你只需要修改少量客户代码，因为新的客户代码已经是在使用新的API了。
