# JavaScript设计模式-装饰器

在装饰器模式中，一些额外的功能可以在运行时被动态地添加到一个对象中。在静态的基于类的语言中，处理这个问题可能是个挑战，但是在JavaScript中，对象本来就是可变的，所以给一个对象添加额外的功能本身并不是什么问题

装饰器模式的一个很方便的特性是可以对我们需要的特性进行定制和配置。刚开始的时，我们由一个拥有基本功能的对象，然后可以从可用的装饰器中去挑选一些需要用到的去增加这个对象，甚至如果顺序很重要的化，还可以指定增强的顺序。

## 用法

我们来看一下这个模式的示例用法。假设你正在做一个买东西的web应用，每个新交易是一个新的sale对象。这个对象“知道”交易的价格并且可以通过调用sale.getPrice（）方法返回。根据环境的不同，你可以开始用一些额外的功能来装饰这个对象。假设一个场景是这笔交易是发生在加拿大的一个省Quebec，在这种情况下，购买者需要付联邦税和Quebec省税。根据装饰器模式的用法，你需要指明使用联邦税装饰器和Quebec省税装饰器来装饰这个对象。然后你还可以给这个对象装饰一些价格式的功能。这个场景的使用凡事可能是这样：

```js
const sale = new Sale(100);  // the price is  100 dollars
sale = sale.decorate('fedtax);  // add federal tax
sale = sale.decorate('quebec');   // add provincial tax
sale = sale.decorate('money'); // format like money
sale.getPrice();  // "$112.88"
```

在另一种场景下，购买者在一个不需要交省税的省，并且你想用加拿大元的格式来显示价格，你可以这样做：

```js
const sale = new Sale(100); // the price is 100 dollars
sale = sale.decorate('fedtax'); // add federal tax
sale = sale.decorate('cdn'); // format using CDN
sale.getPrice(); // "CDN$105.00"
```

如你所见，这是一种在运行时很灵活的方法来添加功能和调整对象。我们来看一下如何来实现这种模式。

## 实现

一种实现装饰器模式的方法是让每个装饰器成为一个拥有应该被重写的方法的对象。每个装饰器实际上是继承自己已经被前一个装饰器增强过的对象。装饰器的每个方法都会调用父对象（继承自的对象）的同名方法并取得值，然后做一些额外的处理。

最终的效果就是当你在第一个例子中调用sale.getPrice()时，实际上是在调用money装饰器的方法

![](https://upload-images.jianshu.io/upload_images/9403248-fea0709544b4cc9c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

但是因为每个装饰器会先调用父对象的方法，money的get Price()先调用quebec的getPrice()，而它又会去调用fedtax的getPrice()方法，以此类推。这个链会一直走到原始的未经装饰的由Sale()构造函数实现的getPrice().

这个实现可以以一个构造函数和一个原型方法开始：

```js
function Sale(price) {
  this.price = price || 100;
}

Sale.prototype.getPrice = function() {
  return this.price;
}
```

装饰器对象将被作为构造函数的属性实现：

```
Sale.decorators = {};
```

我们来看一个装饰器的例子。这是一个对象，实现了一个自定义的getPrice()方法。注意这个方法首先从父对象的方法中取值然后修改这个值：

```js
Sale.decorators.festax = {
  getPrice: function() {
    let price = this.uber.getPrice();
    price += price * 5 /100;
    return price;
  }
};
```

使用类似的方法我们可以实现任意多个需要的其他装饰器。他们的实现方式像插件一样来扩展核心的Sale（）的功能。他们甚至可以被放到额外的文件中，被第三方的开发者来开发和共享：

```js
Sale.decorators.quebec = {
       getPrice: function () {
          var price = this.uber.getPrice();
          price += price * 7.5 / 100;
          return price;
} };
Sale.decorators.money = {
    getPrice: function () {
      return "$" + this.uber.getPrice().toFixed(2);
    }
};
Sale.decorators.cdn = {
    getPrice: function () {
      return "CDN$ " + this.uber.getPrice().toFixed(2);
    }
};
```

最后我们来看decorate()这个神奇的方法，它把所有上面说的片段都串起来了。记得它是这样被调用的：

```js
sale = sale.decorate('fedtax');
```

字符串‘fedtax’对应在Sale.decorators.fedtax中实现的对象。被装饰过的最新的对象newobj将从现有的对象（也就是this对象，它要么是原始的对象，要么是经过最后一个装饰器装饰过的对象）中继承。实现这一部分需要用到前面张杰中提到的临时构造函数模式，我们也设置一个uber属性给newObj以便自对象可以访问到父对象。然后我们从装饰器种肤质所有额外的属性到被装饰的对象newobj中。最后，在我们的例子中，newobj被返回并且成为被更新过的sale对象。

```js
Sale.prototype.decorate = function(decorator) {
  let F = function() {},
  overrides = this.constructor.decorators[decorator], i, newobj;
  F.prototype = this;
  newobj = new F();
  newobj.uber = F.prototype;
    for (i in overrides) {
      if (overrides.hasOwnProperty(i)) {
          newobj[i] = overrides[i];
      }
    }
    return newobj;
   };
```

## 使用列表实现

我们来看另一个明显不同的实现方法，受益于JavaScript的动态特性，它完全不需要使用继承，。同时我们也可以简单地将前一个方法的结果作为参数传给下一个方法，而不需要每一个方法都去调用前一个方法。

这样的实现方法还允许很容易地反装饰（undecorating）或者撤销一个装饰，这仅仅需要从一个装饰器列表中移除一个条目。

用法示例也会迷宫内出现简单一些，因为我们不需要将decorate（）的返回值赋值给对象。在这个实现中，decorator不对对象做任何事情，它只是简单地将装饰器加入到一个列表中：

```js
var sale = new Sale(100); // the price is 100 dollars
sale.decorate('fedtax'); // add federal tax
sale.decorate('quebec'); // add provincial tax
sale.decorate('money'); // format like money
sale.getPrice(); // "$112.88"
```

Sale()构造函数现在有了一个作为自己属性的装饰器列表：

```js
function Sale(price) {
  this.price = (price > 0) || 100;
  this.decorators_list = [];
}
```

可用的装饰器荏苒被实现为Sale.decorators的属性。注意getPrice()方法现在更简单了，因为他们不需要调用父对象的getPrice()来获取结果，结果已经作为参数传递给它们了：

```js
Sale.decorators = {};
Sale.decorators.fedtax = {
  getPrice: function (price) {
    return price + price * 5 / 100;
  }
};
Sale.decorators.quebec = {
  getPrice: function (price) {
    return price + price * 7.5 / 100;
  }
};
Sale.decorators.money = {
  getPrice: function (price) {
    return "$" + price.toFixed(2);
  }
};
```

最有趣的部分发生在父对象的decorate()会让getPrice()。在前一种实现方式中，decorate()还是多少有些复杂，而getPrice()十分简单。在这种实现方式中事情反过来了： decorate()只需要往列表中添加条目而getPrice()做了所有的工作。这些工作包括遍历现在添加的装饰器的列表，然后调用他们的getPrice()方法，并将结果传递给前一个：


```js
Sale.prototype.decorate = function (decorator) {
  this.decorators_list.push(decorator);
};
Sale.prototype.getPrice = function () {
  var price = this.price,
    i,
    max = this.decorators_list.length,
    name;
  for (i = 0; i < max; i += 1) {
    name = this.decorators_list[i];
    price = Sale.decorators[name].getPrice(price);
  }
  return price;
};
```


装饰器模式的第二种实现方式更简单一点，并且没有引入进程。装饰的方法也会简单。所有的工作都由“同意”被装饰的方法来做。在这个示例实现中，getPrice()是唯一被允许装饰的方法。如果你想有更多可以被装饰的方法，那遍历装饰器列表的工作就需要由每个方法重复去做。但是，这可以很容易地被抽象到一个辅助的方法中，给它穿一个方法然后使这个方法“可被装饰”。如果这样实现的化，decorators_list属性就应该是一个对象，它的属性名字是方法名，值是装饰器对象的数组。





