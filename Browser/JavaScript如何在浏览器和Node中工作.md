# JavaScript如何在浏览器和Node中工作

JavaScript 运行时，回调队列和事件循环以及Web API的可视化。这里没有主要技术。

JavaScript非常易于理解，并且是前端开发的重要组成部分。但是与其它编程语言不同，**它是单线程的。**这意味着代码执行将一次完成一次。由于代码的执行是顺序执行的，因此任何需要较长时间执行的代码都会阻塞需要执行的所有内容。因此，有时你在使用Google Chrome浏览器时会看到以下屏幕

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-12-27-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-12-27%20%E4%B8%8A%E5%8D%8811.11.07.png)


在浏览器中打开网站时，它使用单个JavaScript执行线程。该线程负责处理所有内容，例如滚动网页，在网页上打印内容，侦听DOM事件（例如用户单机按钮时）以及执行其它操作。但是，当JavaScript执行被阻止时，浏览器将停止执行所有这些操作，这意味着浏览器将仅冻结摒弃不响应任何内容。

你可以在下面的永恒while循环中看到实际效果。

```js
while (true) {}
```

上述语句之后的任何代码都不会执行，因为while循环将无限循环，直到系统资源不足为止。这也可能发生在无限递归函数调用中。


多亏了现代浏览器，并非所有打开的浏览器选项卡都依赖与单个JavaScript线程。而是每个标签或每个域使用单独的JavaScript线程。如果使用的是Google浏览器，则可以打开具有不同网站的多个标签，并在永恒while循环之上运行。这只会冻结执行该代码的当前选项卡，而其它选项卡将正常运行。当Chrome实施每个站点一个进程的策略并且一个进程使用相同JavaScript执行线程时，从同一域/相同网站打开页面的任何标签也会冻结。

为了可视化JavaScript如何执行程序，我们需要了解JavaScript运行时。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-12-27-1_ocCc8yEvUEeOtGU2LNQnpA.png)

像任何其它编程语言一样，JavaScript运行时具有一个堆栈和一个栈存储。我将不对堆进行更多的解释。你可以
[在这里](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-12-27-1_ocCc8yEvUEeOtGU2LNQnpA.png)阅读。我们感兴趣的是stack。堆栈LIFO（后进先出）数据存储，用于存储程序的当前功能执行上下文。但我们的程序加载到内存中时，它将从第一个函数调用开始执行foo().

直到函数返回某些内容（函数执行时），它才会从堆栈中弹出。该条目（函数）返回某个值后，堆栈将逐个弹出条目，并且它将继续执行未决的函数

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-12-27-1_rRoLpv-Zrmpa-srNhwlbvA.gif)

在每个条目处，堆栈的状态也称为堆栈框架。如果在给定的堆栈框架上进行任何函数调用均产生错误，则JavaScript将打印堆栈跟踪，这只是该堆栈框架上代码执行的快照。

```js
函数baz（）{
   抛出新错误（'出事了。'）;
}
函数bar（）{
   baz（）;
}
函数foo（）{
   bar（）;
}
foo（）;
```

在上面程序中，我们从baz函数中抛出了错误，JavaScript将在堆栈跟踪下面打印出来，以找出错误的原因和位置。

由于JavaScript是单线程的，因此它只有一个堆栈和一个堆。因此，如果任何其它程序想要执行某些操作，则必须等待直到之前的程序完全执行

因此，让我们考虑一种情况，如果浏览器发送HTTP请求以通过网络加载一些数据或加载要在网页上显示的图像该怎么办。浏览器会冻结直到钙请求得到解决？如果确实如此，那么对用户体验是非常不利的。

浏览器附带一个JavaScript引擎，该引擎提供JavaScript运行时环境。例如，谷歌浏览器使用他们开发的V8 JavaScript。但是请猜测，浏览器不仅仅使用JavaScript引擎。这就是幕后的浏览器。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-12-27-1_lZ-KXoVNUSOwaq7q8zUBDg.png)

看起来真的很复杂，但是很容易理解。JavaScript运行时实际上由两个组件组成。**事件循环和回调队列**。回调队列也称为**消息队列**或**任务队列**。

除了JavaScript引擎外，浏览器还包含不同的应用程序，这些应用程序可以执行各种操作，例如发送HTTP请求，侦听DOM事件，使用以下命令延迟执行setTimeout或setInterval，缓存，数据库存储等等。浏览器的这些功能可帮助我们创建丰富的Web应用程序。


但是请考虑一下，如果浏览器必须使用相同的JavaScript线程来执行这些功能，用户体验将非常糟糕。因为即使用户只是滚动网页，后台也会发生很多事情。因此，浏览器使用低级语言C++来执行这些操作并提供干净的JavaScript API来使用。这些API被称为Web API

这些Web API是异步的。这意味着，您可以指示这些API在后台执行某些操作，并在完成后返回数据，于此同时，我们可以继续执行JavaScript代码。在指示这些API在后台执行操作时，我们必须提供一个回调函数。回调函数的责任是在Web API完成工作后执行一些JavaScript。让我们了解所有部分如何协同工作。

因此，当你调用函数时，它会被压入堆栈。如果该函数包含Web API调用，则JavaScript将使用回调函数将其控制权委托给Web API，然后移至下一行，直到函数返回内容。一旦函数击中return语句，该函数将从堆栈中弹出并移至下一个堆栈条目。同时，Web API在后台执行器工作，并记住与该工作相关联的回调函数。作业完成后，Web API 将该作业的结果绑定到回调函数，并使用该回调将消息发布到**消息队列**（AKA回调队列）。事件循环的唯一工作就是查看回调队列，一旦回调队列有待处理的东西，就将该回调推入堆栈。一旦堆栈唯恐，事件循环就一次将一个回调函数推入堆栈。稍后，堆栈将执行回调函数


让我们看看如何使用setTimeout Web API 逐步进行所有工作。setTimeout Web API主要用于在几秒钟后执行某些操作。一旦程序中的所有代码执行完毕（堆栈为空），就会执行此执行。setTimeout函数的语法如下。

```js
setTimeout（callbackFunction, timeInMilliseconds）;
```

callbackFunction是一个回调函数，将在之后执行timeInMilliseconds。让我们修改我们早期程序并使用此API。

```js
function printHello() {
  console.log('from baz Hello');
}

function baz() {
  setTimeout(printHello, 3000) ;
}

function bar() {
  baz()
}

function foo() {
  bar()
}

foo()
```

对该程序做的唯一修改是，我们将console.log（）执行延迟了3s。在这种情况下，堆栈会像一样继续建立foo() => bar() => baz()。 一旦baz开始执行并点击setTimeout API调用，JavaScript就会将回调函数传递给Web API并移至下一行。由于没有下一行，所有将弹出栈baz，然后bar再foo调用函数。同时Web API等待3秒中过去。一旦过了3秒，它将这个回调推入到回调队列，并且由于堆栈诶空，事件循环会将这个回调放回执行回调的堆栈上。


[Philip Robers](http://latentflip.com/)创建了一个了不起的在线工具。用于可视化JavaScript的工作原理。在[链接上](http://latentflip.com/loupe/?code=ZnVuY3Rpb24gcHJpbnRIZWxsbygpIHsNCiAgICBjb25zb2xlLmxvZygnSGVsbG8gZnJvbSBiYXonKTsNCn0NCg0KZnVuY3Rpb24gYmF6KCkgew0KICAgIHNldFRpbWVvdXQocHJpbnRIZWxsbywgMzAwMCk7DQp9DQoNCmZ1bmN0aW9uIGJhcigpIHsNCiAgICBiYXooKTsNCn0NCg0KZnVuY3Rpb24gZm9vKCkgew0KICAgIGJhcigpOw0KfQ0KDQpmb28oKTs%3D!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D)可以找到我们上面的示例。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-12-27-1_9mv-g9E-87Sji9j7YR08Fw.gif)

说到Node.js，它必须做更多的事情，因为Node承诺了更多。对于浏览器，我们只能在后台进行操作。但是Node中，即使是简单的JavaScript程序，我们也几乎可以在后台执行大多数操作。但是，如何运作？


Node.js使用Google的V8引擎来提供JavaScript运行时，但不进依赖于它的事件循环。它使用[libuv库](https://github.com/libuv/libuv)（用C编写）与V8事件循环一起使用，以扩展可以在后台执行的操作。Node遵循与Web API相同的回调方法，并且以与浏览器类似的方式工作。


![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-12-27-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-12-27%20%E4%B8%8B%E5%8D%881.36.42.png)


如果将浏览器图与上述节点图进行比较，可以看到相似之处。整个右侧部分看起来像Web API，但它还包含事件队列（回调队列/消息队列）和事件循环。但是V8，事件队列和事件循环在单线程上运行，而工作线程负责提供异步I/O操作。这就是为什么据说Node.js具有非阻塞事件驱动的异步I/O体系结构。



