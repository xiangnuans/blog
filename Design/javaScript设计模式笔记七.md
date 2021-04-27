# JavaScript设计模式-代理模式

在代理设计模式中，一个对象充当了另一个对象的接口的角色。它和外观模式不一样，外观模式的方便仅限于将几个方法调用联合起来。而代理对象位于某个对象和它的客户之间，可以保护对象的访问。


这个模式看起来开销有点大，但在出于性能考虑是非常有用。代理对象可以作为对象（也叫“真正的主体”）的保护者，让真正的主体对象做尽量少的工作。

一种示例用法是我们称之为“懒初始化”（延迟初始化）的东西。假设初始化真正的主体是开销很大的，并且正好可以作为客户代码将它初始化后并不真正使用它。在这种情况下，代理对象可以作为真正的主体的接口起到帮助作用。代理对象接收到初始化请求，但在真正的主体真正被使用之前都不会将它传递过去。

![](https://upload-images.jianshu.io/upload_images/9403248-e6dace34826aee86.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

图展示了这个场景，当客户代码发出初始化请求时，代理对象回复一切就绪，但并没有将请求传递过去，只有在客户代码真正需要真正的主体多做些工作的时候才将两个请求一起传递过去。

## 一个例子

在真正的主体做某件工作开销很大是，代理模式很有用处。在web应用中，开销最大的操作之一就是网络请求，此时尽可能地合并HTTP请求是有意义的。我们来看一个这种场景下应用代理模式的实例。

## 一个视屏列表（expando）
我们假设又一个用来播放选中视频的应用。你可以在这里看到真实的例子http://www.jspatterns.com/book/7/proxy.html

页面上又一个视频标题的列表，当用户点击视频标题的时候，标题下方的区域会展开并显示视屏的更多信息，同时也是的视频可被播放。视频的详细信息和用来播放的URL并不是页面的一部分，它们需要通过网络请求来获取。服务端可以接收多个视频ID，这样我们就可以在合适的时候通过一次请求多个视频信息来减少HTTP请求以加快应用的速度。

我们的应用允许一次展开好几个（或全部）视频，所以这是一个合并网络请求的绝好机会。

![](https://upload-images.jianshu.io/upload_images/9403248-4524f76d06639be8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 没有代理对象的情况

这个应用中最主要的角色是两个对象：

- videos
负责对信息区域展开/收起（videos.getInfo()方法）和播放视屏的响应（videos.getPlayer()方法）

- http

负责通过http.makeRequest（）方法与服务端通讯

当没有代理对象的时候，videos.getInfo()会为每个视频调用一次http.makeRequest()方法。当我们添加代理对象proxy后，它将位于videos和http中间，接收对makeRequest()的调用，并在可能的时候合并请求。

我们首先看一下没有代理对象的代码，然后添加嗲里对象来提升应用的响应速度。


## HTML

HTML代码仅仅是一个链接列表：

```
<p><span id="toggle-all">Toggle Checked</span></p>
   <ol id="vids">
       <li><input type="checkbox" checked><a
   href="http://new.music.yahoo.com/videos/--2158073">Grave
   digger</a></li>
       <li><input type="checkbox" checked><a
   href="http://new.music.yahoo.com/videos/--4472739">Save
   Me</a></li>
       <li><input type="checkbox" checked><a
   href="http://new.music.yahoo.com/videos/--45286339">Crus
   h</a></li>
       <li><input type="checkbox" checked><a
       href="http://new.music.yahoo.com/videos/--2144530">Don't
   Drink The Water</a></li>
       <li><input type="checkbox" checked><a
   href="http://new.music.yahoo.com/videos/--217241800">Fun
   ny the Way It Is</a></li>
       <li><input type="checkbox" checked><a
   href="http://new.music.yahoo.com/videos/--2144532">What
   Would You Say</a></li>
   </ol>
```

## 事件处理
现在我们来看一下事件处理的逻辑。首先我们定义一个方便的快捷函数$:
```js
 var $ = function (id) {
       return document.getElementById(id);
   };
```

使用事件代理，我们将所有id ="vids"的条目是那个的点击事件同意放到一个函数中处理：
```js
$('vids').onclick = function (e) {
       var src, id;
       e = e || window.event;
       src = e.target || e.srcElement;
       if (src.nodeName !== "A") {
          return;

          }
       if (typeof e.preventDefault === "function") {
          e.preventDefault();
       }
       e.returnValue = false;
       id = src.href.split('--')[1];
       if (src.className === "play") {
          src.parentNode.innerHTML = videos.getPlayer(id);
return; }
       src.parentNode.id = "v" + id;
       videos.getInfo(id);
   };
```

## videos对象

videos对象有三个方法：
- getPlayer（）
返回播放视频需要的HTML代码

- updateList()
网络请求的回调函数，接收从服务器返回的数据，然后生成用于视频详细信息的HTML代码。这一部分也没有什么太有趣的事情。

- getInfo()

这个方法切换视屏信息的可视状态，同时也调用http对象的方法，并传递updateList（）作为回调函数。

下面是这个对象的代码片段：

```js
var videos = {
       getPlayer: function (id) {...},
       updateList: function (data) {...},
       getInfo: function (id) {
          var info = $('info' + id);
          if (!info) {
              http.makeRequest([id], "videos.updateList");
return; }
          if (info.style.display === "none") {
              info.style.display = '';
} else {
              info.style.display = 'none';
          }
} };
```

## http对象

http对象只有一个方法，它像Yahoo！的YQL服务发起一个JSONP请求：

```js
 var http = {
       makeRequest: function (ids, callback) {
          var url =
   'http://query.yahooapis.com/v1/public/yql?q=',
sql = 'select * from music.video.id where ids IN
   ("%ID%")',
              format = "format=json",
              handler = "callback=" + callback,
              script = document.createElement('script');
          sql = sql.replace('%ID%', ids.join('","'));
          sql = encodeURIComponent(sql);
          url += sql + '&' + format + '&' + handler;
          script.src = url;
          document.body.appendChild(script);
       }
};
```

YQL(Yahoo! Query Language)是一种web service，它提供了使用类似SQL的语法来调用很多其他web service的能力，使得使用者不需要学习每个service的API。

当所有的六个视频都被选中后，将会向服务端发起六个独立的像这样的YQL请求：

```
 select * from music.video.id where ids IN ("2158073")
```

## 代理对象

前面的代码工作的很正常，但我们可以让它工作的更好。proxy对象就在这样的场景中出现，并接管了http和videos对象之间的通讯。它将使用一个简单的逻辑来尝试合并请求：50ms的延迟。videos对象并不直接调用后台接口，而是调用proxy对象的方法。proxy对象在转发这个请求前将会等待一段时间，如果在等待的50ms内有另一个来自videos的调用，则他们将被合并请求以提升点击“toggle”时的体验，一次展开多个视频。它也可以显著降低服务的负载，因为web服务器只需要处理更少亮的请求。

合并后查询两个视频信息的YQL大概是这样：

```
select * from music.video.id where ids IN ("2158073",
   "123456")
```

在修改后的代码中，唯一变化是videos。getInfo()现在调用的是proxy。makeRequest()而不是http.makeRequest()，像这样：

```
proxy.makeRequest(id, videos.updateList, videos);
```

proxy对象创建了一个队列来收集50ms之内接收到的视频ID，然后将这个队列传递给http对象，并提供回调函数，因为videos.updateList()只能处理一次接收到的数据。

下面是proxy对象的代码：

```js
 var proxy = {
       ids: [],
       delay: 50,
       timeout: null,
       callback: null,
    context: null,
    makeRequest: function (id, callback, context) {
       // add to the queue
       this.ids.push(id);
this.callback = callback; this.context = context;
       // set up timeout
       if (!this.timeout) {
           this.timeout = setTimeout(function () {
               proxy.flush();
           }, this.delay);
       }
    },
    flush: function () {
       http.makeRequest(this.ids, "proxy.handler");
       // clear timeout and queue
       this.timeout = null;
       this.ids = [];
    },
    handler: function (data) {
var i, max;
       // single video
       if (parseInt(data.query.count, 10) === 1) {
           proxy.callback.call(proxy.context,
data.query.results.Video);
return;
}
          // multiple videos
for (i = 0, max = data.query.results.Video.length; i < max; i += 1) {
              proxy.callback.call(proxy.context,
   data.query.results.Video[i]);
} }
};
```

了解代理模式后就在只简单地改动一下原来的代码的情况下，将多个web serivice请求合并为一个。

![](https://upload-images.jianshu.io/upload_images/9403248-afabcc5f767e038e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/9403248-5ea51ee9eab22f18.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


了解代理模式后就在只简单地改动一下原来的代码的情况下，将多个 web service 请求合并为一个。
图 7-4 和 7-5 展示了使用代理模式将与服务器三次数据交互(不用代理模式 时)变为一次交互的过程。


## 使用嗲里对象做缓存

在这个例子中，客户对象（videos）已经可以做到不对同一个对象重复发出请求。但显示情况中并不总是这样。这个代理对象还可以通过缓存之前的请求结果到cache属性中来进一步保护真正的主体http对象（图7-6）。然后当videos对象需要对同一个ID的视频请求第二次时，proxy对象可以直接从缓存中取出，从而避免一次网络交互。

![](https://upload-images.jianshu.io/upload_images/9403248-c3b3a0c93e8f1941.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
