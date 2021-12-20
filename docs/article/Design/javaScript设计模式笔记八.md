# JavaScript设计模式-中介者模式

一个应用不论大小，都是由一些彼此独立的对象组成的。所有的对象都需要 一个通讯的方式来保持可维护性，即你可以安全地修改应用的一部分而不破 坏其它 部分。随着应用的开发和维护，会有越来越多的对象。然后，在重构 代码的时候，对象可能会被移除或者被重新安排。当对象知道其它对象的太 多信息并且直接通讯 (直接调用彼此的方法或者修改属性)时，会导致我们 不愿意看到的紧耦合。当对象耦合很紧时，要修改一个对象而不影响其它的 对象是很困难的。此时甚至连一个 最简单的修改都变得不那么容易，甚至连 一个修改需要用多长时间都难以评估。

中介者模式就是一个缓解此问题的办法，它通过解耦来提升代码的可维护性 (见图 7-7)。在这个模式中，各个彼此合作的对象并不直接通讯，而是通 过一 个 mediator(中介者)对象通讯。当一个对象改变了状态后，它就通 知中介者，然后中介者再将这个改变告知给其它应该知道这个变化的对象。

![](https://upload-images.jianshu.io/upload_images/9403248-9a8cfb5091a87a9e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 中介者示例

我们来看一个使用中介者模式的实例。这个应用是一个游戏，它的玩法是比 较两位游戏者在半分钟内按下按键的次数，次数多的获胜。玩家 1 需要按的 是 1，玩家 2 需要按的是 0(这样他们的手指不会搅在一起)。当前分数会显 示在一个计分板上。

对象列表如下:
- Player 1
- Player 2
- Scoreboard
- Mediator

中介者 Mediator 知道所有的对象。它与输入设备(键盘)打交道，处理 keypress 事件，决定现在是哪位玩家玩的，然后通知这个 玩家(见图 7-8)。 玩家负责玩(即给自己的分数加一分)，然后通知中介者他这一轮已经玩完。 中介者再告知计分板最新的分数，计分板更新显示。
除了中介者之外，其它的对象都不知道有别的对象存在。这样就使得更新这
个游戏变得很简单，比如要添加一位玩家或者是添加另外一个显示剩余时间
的地方。
你可以在这里看到这个游戏的在线演示 http://jspatterns.com/book/7/mediator.html。

![](https://upload-images.jianshu.io/upload_images/9403248-d1b5fe59014208fd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

玩家对象是通过 Player()构造函数来创建的，有自己的 points 和 name 属性。 原型上的 play()方法负责给自己加一分然后通知中介者:

```js
 function Player(name) {
       this.points = 0;
       this.name = name;
   }
   Player.prototype.play = function () {
       this.points += 1;
       mediator.played();
   };
```

scoreboard 对象(计分板)有一个 update()方法，它会在每次玩家玩完后被 中介者调用。计分析根本不知道玩家的任何信息，也不保存分数，它只负责 显示中介者给过来的分数:

```js
 var scoreboard = {
      // HTML element to be updated
       element: document.getElementById('results'),
       // update the score display
       update: function (score) {
          var i, msg = '';
          for (i in score) {
              if (score.hasOwnProperty(i)) {
                  msg += '<p><strong>' + i + '<\/strong>: ';
                  msg += score[i];
                  msg += '<\/p>';
} }
          this.element.innerHTML = msg;
       }
};
```

现在我们来看一下 mediator 对象(中介者)。在游戏初始化的时候，在 setup() 方法中创建游戏者，然后放后 players 属性以便后续使 用。played()方法会 被游戏者在每轮玩完后调用，它更新 score 哈希然表然后将它传给 scoreboard 用于显示。最后一个方法是 keypress()，负责处理键盘事件， 决定是哪位玩家玩的，并且通知它:


```js
var mediator = {
       // all the players
       players: {},
       // initialization
       setup: function () {
       var players = this.players;
          players.home = new Player('Home');
          players.guest = new Player('Guest');
},
       // someone plays, update the score
       played: function () {
          var players = this.players,
          score = {
              Home: players.home.points,
              Guest: players.guest.points
          };
          scoreboard.update(score);
       },
       // handle user interactions
       keypress: function (e) {
          e = e || window.event; // IE
          if (e.which === 49) { // key "1"
              mediator.players.home.play();
return; }
          if (e.which === 48) { // key "0"
              mediator.players.guest.play();
return; }
} };
```

最后一件事是初始化和结束游戏:

```js
 // go!
   mediator.setup();
   window.onkeypress = mediator.keypress;
   // game over in 30 seconds
   setTimeout(function () {
       window.onkeypress = null;
       alert('Game over!');
   }, 30000);

```
