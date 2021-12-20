# JavaScript设计模式-工厂模式

使用工厂模式的目的就是创建对象。它通常被在类或者类的静态方法中实现，目的是：
- 执行在建立相似的对象时进行的一些重复的操作
- 让工厂的使用者在编译阶段创建对象时不必知道它的特定类型（类）

第二点在静态的基于类的语言中更重要，因为在（编译阶段）提前不知道类的情况下，创建类的实例是不普遍的行为。但在JavaScript中，这部分的实现却相当容易。

使用工厂的方法（或类）创建的对象被设计为从同一个副对象继承；它们是特定的实现一些特殊功能的子类。有些时候这个共同的父对象就是包含工厂方法的同一个类。

我们来看一个示例实现，我们有：

- 一个共同的父构造函数CarMaker。
- CarMaker的一个静态方法叫factory()， 用来创建car对象。
- 特定的从CarMaker继承而来的构造函数CarMaker.Compact，CarMaker.SUV，CarMaker.Convertible。它们都被定义为父构造函数的静态属性以便保持全局空间干净，同时在需要的时候我们也知道在哪里找到它们。

我们来看一下已经完成的实现会怎么被使用：

```js
const corolla = CarMaker.factory('Compact');
const solstice = CarMaker.factory('Convertile');
const cherokee = CarMaker.factory('SUV');

corolla.drive();   // "Vroom, I have 4 doors"
solstice.drive(); // "Vroom, I have 2 doors"
cherokee.drive(); // "Vroom, I have 17 doors"
```

这一段：

```js
const corolla = CarMaker.factory('Compact');
```

可能是工厂模式中知名的。你有一个方法可以在运行时接收一个表示类型的字符串，然后它创建并返回一个和请求的类型一样的对象。这里没有使用new的构造函数，也没有看到任何对象字面量，仅仅只有一个函数根据一个字符串指定的类型创建了对象。

这里是一个工厂模式的示例实现，它能让上面的代码片段工作：

```js
// parent constructor
function CarMaker() {}


// a method of the parent
CarMaker.prototype.drive = function() {
  return "Vroom, I have " + this.doors + " doors";
};

// the static factory method
CarMaker.factory = function (type) {
    var constr = type,
    newcar;
    // error if the constructor doesn't exist
    if (typeof CarMaker[constr] !== "function") {
       throw {
           name: "Error",
           message: constr + " doesn't exist"
       };
}
    // at this point the constructor is known to exist
    // let's have it inherit the parent but only once
    if (typeof CarMaker[constr].prototype.drive !==
"function") {
       CarMaker[constr].prototype = new CarMaker();
    }
    // create a new instance
    newcar = new CarMaker[constr]();
    // optionally call some methods and then return...
    return newcar;
};

// define specific car makers
CarMaker.Compact = function () {
  this.door = 4;
}

CarMaker.Convertible = function () {
  this.door = 2;
}

CarMaker.SUV = function () {
  this.door = 24;
}
```

工厂模式的实现中没有什么是特别困难的。你需要做的仅仅是寻找请求类型的对象的构造函数。在这个例子中，使用了一个简单的名字转换以便映射对象类型和创建对象的构造函数。继承的部分只是一个公共的重复代码片段的示例，它可以被放到工厂方法中而不是被每个构造函数的类习惯重复。


## 内置对象工厂

作为一个“野生的工厂”的例子，我们来看一下内置的全局构造函数Object（）。它的行为很像工厂，因为它根据不同的输入创建不同的对象。如果传入一个数字，它会使用Number（）构造函数创建一个对象。在传入字符串和布尔值的时候也会发生同样的事情。任何其他的值（包括空值）将会创建一个正常的对象。

下面是这种行为的例子和测试。注意Object调用时可以不用加new：

```js
const  o = new Object(),
       n = new Object(1),
       s = Object('1'),
       b = Object(true);

// test
o.constructor === Object; // true
n.constructor === Number; // true
s.constructor === String; // true
b.constructor === Boolean; // true
```

Object()也是一个工厂这一事实可能没有太多实际用处，仅仅是觉得值得作为一个例子提一下，告诉我们工厂模式是随处可见的。

