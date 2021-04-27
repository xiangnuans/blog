# JavaScript设计模式-观察者模式

观察者模式被广泛地应用于 JavaScript 客户端编程中。所有的浏览器事件 (mouseover，keypress 等)都是使用观察者模式的例 子。这种模式的另一 个名字叫“自定义事件”，意思是这些事件是被编写出来的，和浏览器触发 的事件相对。它还有另外一个名字叫“订阅者/发布者”模式。
使用这个模式的最主要目的就是促进代码触解耦。在观察者模式中，一个对 象订阅另一个对象的指定活动并得到通知，而不是调用另一个对象的方法。 订阅者 也被叫作观察者，被观察的对象叫作发布者或者被观察者 35。当一个 特定的事件发生的时候，发布者会通知(调用)所有的订阅者，同时还可能 以事件对象的形式传递一些消息。


## 例1: 杂志订阅

为了理解观察者模式的实现方式，我们来看一个具体的例子。我们假设有一个发布者paper，它发型一份日报和一份月刊。无论是日报还是月刊发行，有一个名叫joe的订阅者都会收到通知。

paper 对象有一个 subscribers 属性，它是一个数组，用来保存所有的订阅 者。订阅的过程就仅仅是将订阅者放到这个数组中而已。当一个事 件发生时， paper 遍历这个订阅者列表，然后通知它们。通知的意思也就是调用订阅者 对象的一个方法。因此，在订阅过程中，订阅者需要提供一个方法给 paper 对象的 subscribe()。

paper 对象也可以提供 unsubscribe()方法，它可以将订阅者从数组中移除。 paper 对象的最后一个重要的方法是 publish()，它负责调用订阅者的方法。 总结一下，一个发布者对象需要有这些成员:

- subscribers
  一个数组
- subscribe()
  将订阅者加入数组
- unsubscribe()
  从数组中移除订阅者
- publish()
  遍历订阅者并调用它们订阅时提供的方法


所有三个方法都需要一个 type 参数，因为一个发布者可能触发好几种事件 (比如同时发布杂志和报纸)，而订阅者可以选择性地订阅其中的一种或几 种。
因为这些成员对任何对象来说都是通用的，因此将它们作为独立对象的一部
分提取出来是有意义的。然后，我们可以(通过掺元模式)将它们复制到任
何一个对象中，将这些对象转换为订阅者。

下面是这些发布者通用功能的一个示例实现，它定义了上面列出来的所有成 员，还有一个辅助的 visitSubscribers()方法:

```js
var publisher = {
       subscribers: {
          any: [] // event type: subscribers
       },
subscribe: function (fn, type) {
type = type || 'any';
if (typeof this.subscribers[type] === "undefined")
{
       this.subscribers[type] = [];
    }
    this.subscribers[type].push(fn);
},
unsubscribe: function (fn, type) {
    this.visitSubscribers('unsubscribe', fn, type);
},
publish: function (publication, type) {
       this.visitSubscribers('publish', publication,
type);
    },
    visitSubscribers: function (action, arg, type) {
       var pubtype = type || 'any',
           subscribers = this.subscribers[pubtype],
           i,
           max = subscribers.length;
       for (i = 0; i < max; i += 1) {
           if (action === 'publish') {
               subscribers[i](arg);
           } else {
               if (subscribers[i] === arg) {
                   subscribers.splice(i, 1);
                  }
} }
} };

```


下面这个函数接受一个对象作为参数，并通过复制通用的发布者的方法将这
个对象墨迹成发布者:

```js
 function makePublisher(o) {
       var i;
       for (i in publisher) {
          if (publisher.hasOwnProperty(i) && typeof
   publisher[i] === "function") {
              o[i] = publisher[i];
          }
}
       o.subscribers = {any: []};
   }

```


现在我们来实现 paper 对象，它能做的事情就是发布日报和月刊:

```js
var paper = {
       daily: function () {
          this.publish("big news today");
       },
       monthly: function () {
          this.publish("interesting analysis", "monthly");
       }
};
makePublisher(paper);
```
现在我们有了一个发布者，让我们再来看一下订阅者对象 joe，它有两个方 法:

```js
var joe = {
drinkCoffee: function (paper) {
          console.log('Just read ' + paper);
       },
sundayPreNap: function (monthly) {
console.log('About to fall asleep reading this ' +
monthly);
} };
```
现在让 joe 来订阅 paper:

```js
paper.subscribe(joe.drinkCoffee);
   paper.subscribe(joe.sundayPreNap, 'monthly');
```

如你所见，joe 提供了一个当默认的 any 事件发生时被调用的方法，还提供 了另一个当 monthly 事件发生时被调用的方法。现在让我们来触发一些事件

```js
paper.daily();
paper.daily();
paper.daily();
paper.monthly();
```
这些发布行为都会调用 joe 的对应方法，控制台中输出的结果是:

```js
Just read big news today
Just read big news today
Just read big news today
About to fall asleep reading this interesting analysis

```

这里值得称道的地方局势paper对象并没有硬编码写上joe，而joe也同样没有硬编码写上paper。这里也没有知道所有事情的中介者对象。多有设计到的对象都是松耦合的，而且在不修改代码的前提下，我们可以个paper添加更多的订阅者，同时joi也可以在任何时候取消订阅。

让我们更进一步，将joe也编程一个发布者。（毕竟，在博客和微博上，任何人可以是发布者。）这样，joe变成发布者之后就可以在Twitter上更新状态：

```js
makePublisher(joe);
joe.tweet = function(msg) {
  this.publish(msg);
}
```

现在假设paper的公共部门准备通过Twitter收集读者反馈，于是它订阅了joe,提供了一个方法readTweets():

```js
paper.readTweets = function(tweet) {
  alert('Call big meeting! Someone ' + tweet);
};

joe.subscribe("hated the paper today");
```

这样每当joe发出消息时，paper就会弹出警告窗口：

```js
 joe.tweet("hated the paper today");
```

结果是一个精工窗口：“Call big meeting！Someone hated the paper today”。


你可以在 http://jspatterns.com/book/7/observer.html 看到完整的源代 码，并且在控制台中运行这个实例。

## 例 2:按键游戏
我们来看另一个例子。我们将实现一个和中介者模式的示例一样的按钮游戏， 但这次使用观察者模式。为了让它看起来更高档，我们允许接受无限个玩家， 而 不限于 2 个。我们仍然保留用来产生玩家的 Player()构造函数，也保留 scoreboard 对象。只有 mediator 会变成 game 对象。
在中介者模式中，mediator 对象知道所有涉及到的对象，并且调用它们的方 法。而观察者模式中的game对象不是这样，它会让对象来订阅它们感兴趣的 事件。比如，scoreboard 会订阅 game 对象的 scorechange 事件。
首先我们重新看一下通用的 publisher 对象，并且将它的接口做一点小修改 以更贴近浏览器的情况:
- 将 publish()，subscribe()，unsubscribe()分别改为 fire()，on()，remove()
-  事件的 type 每次都会被用到，所以把它变成三个方法的第一个参数
- 可以给订阅者的方法额外加一个 context 参数，以便回调方法可以用 this 指向它
{
this.subscribers[type] = [];
自己所属的对象
新的 publisher 对象是这样:
```js
   var publisher = {
       subscribers: {
any: [] },
       on: function (type, fn, context) {
          type = type || 'any';
          fn = typeof fn === "function" ? fn : context[fn];
if (typeof this.subscribers[type] === "undefined"){
  this.subscribers[type] = [];
}
}
       this.subscribers[type].push({fn: fn, context:
context || this});
    },
    remove: function (type, fn, context) {
       this.visitSubscribers('unsubscribe', type, fn,
context);
    },
    fire: function (type, publication) {
       this.visitSubscribers('publish', type,
publication);
},
visitSubscribers: function (action, type, arg, context)
{
  var pubtype = type || 'any',
      subscribers = this.subscribers[pubtype],
      i,
      max = subscribers ? subscribers.length : 0;
  for (i = 0; i < max; i += 1) {
    if (action === 'publish') {
subscribers[i].fn.call(subscribers[i].context, arg);
    } else {
        if (subscribers[i].fn === arg &&
subscribers[i].context === context) {
          subscribers.splice(i, 1);
        }
} }
} };
```

新的Player()构造函数是这样：

```js
function Player(name, key) {
  this.points = 0;
  this.name = name;
  this.key = key;
  this.fire('newplayer', this);
}
Player.prototype.play = function () {
  this.points += 1;
  this.fire('play', this);
};

```

变动的部分是这个构造函数接收key，代表这个玩家在键盘上用来按之后得分的按键。（这些键预先硬编码过。）每次创建一个新玩家的时候，一个newplayer事件也会被触发。类似的，每次有一个玩家玩的时候，会触发play事件。

scoreboard对象和原来一样，它只是简单地将当前分数显示出来。

game对象会关注所有的玩家，这样它九可以给出分数并且触发scorechange事件。它也会订阅浏览中所有的keypress事件，这样它聚会知道按钮对应的玩家：

```js
const game = {
  key: {},
  addPlayer: function(player) {
    const key = player.key.toString().charCOdeAt(0);
    this.keys[key] = player;
    handleKeypress: function (e) {
      e = e || window.event; // IE
      if (game.keys[e.which]) {
        game.keys[e.which].play();
      }
    },

    handlePlay: function(player) {
      let i,
      players = this.keys;
      score = {};
      for (i in players) {
        if (players.hasOwnProperty(i)) {
          score[players[i].name] = players[i].points;
        }
      }
      this.fire('scorechange', score);
    }
  }
}
```

用于将任意对象转变为订阅者的makePublisher()还是和之前一样。game对象会变成发布者（这样它才可以触发scorechange事件），Player.prototype也会变成发布者，以使得每个玩家对象可以触发play和newplayer事件：

```js
makePublisher(Player.prototype);
makePublisher(game);
```

game对象订阅play和newplayer事件（以及浏览器的keypress事件），scoreboard订阅scorechange事件：

```js
Player.prototype.on("newplayer", "addPlayer", game);
Player.prototype.on("play", "handlePlay", game);
game.on("scorechange", scoreboard.update, scoreboard);
window.onkeypress = game.handleKeypres;
```

如你所见，on()方法允许订阅者通过函数（scoreboard.update）或者是字符串（“addPlayer”）来制定回调函数。当有提供context（如game）时，才能通过字符串来指定回调函数。

初始化的最后一点工作就是动态地创建玩家对象（以及他们对象的按键），用户想要多少个就可以创建多少个：

```js
var playername, key;
  while (1) {
    playername = prompt("Add player (name)");
    if (!playername) {
      break;
    }
    while (1) {
      key = prompt("Key for " + playername + "?");
    if (key) {
      break;
    }
  }
  new Player(playername, key);
}
```

这就是游戏的全部。你可以在看到完整的代码并且试玩一下。

值得注意的是，在中介者模式中，mediator对象必须知道所有的对象，然后在适当的时机去调用对应的方法。而这个例子中，game对象会显得笨拙一些，游戏依赖于对象去观察特写事件然后触发相应的动作：如scoreboard观察scoreboard事件。这是的对象之间的耦合更怂了（对象间知道彼此的信息越少越好），而代价则是弄清事件和订阅者之间的对应关系会更困难一些。


在这个例子中，所有的订阅行为都发生在代码中的同一个地方，而随着应用规模的增长，on（）可能会被在各个地方调用（如在每个对象的初始化代码中）。这使得调试更困难一些，因为没有一个几种的地方来看这些代码并理解正在发生什么事情≥在观察者弄湿中，你讲不再能看到那种从开头一直跟到结尾的顺序执行方式。

## 小结

在这章中你学到了若干种流行的设计模式，并且也知道了如何在JavaScript中实现它们。我们讨论过的设计模式有：


- **单例模式**

只创建了类的唯一一个实例。我们看了好几种可以不通过搞糟函数和类Java语法达成单例的方法。从另一方面来说，JavaScript中所有的对象都是单例。有时候开发者说的单例是指铜鼓模块化创建的对象。


- **工厂模式**

一种在运行时通过指定字符串来创建指定类型对象的方法。

- **遍历模式**

通过提供API来实现复杂的洗定义数据节后中的遍历和导航。

- **装饰模式**

在运行时通过从预先定义好的装饰器对象来给被装饰对象动态添加功能。

- **策略模式**

保持接口一直的情况下选择最好的策略来完成特写类型的任务。

- **外观模式**

通过包装通用的（或设计的很差的）方法来提供一个更方便的 API。

- **代理模式**

包装一个对象以控制对它的访问。通过合并操作或者是只在真正需要使执行来尽量避免开销太大的操作

- **中介者模式**

通过让对象不彼此沟通，只通过一个中介者对象沟通的方法来促进解耦。

- **观察者模式**

通过创建“可被观察的对象“使它在某个事件发生时通知订阅者的方式来接耦。（也叫”订阅者/发布者”或“自定义事件”）。

