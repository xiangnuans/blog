# 场景

在我个人博客中文章列表，采用滚动加载的方式显示文章

```
  componentDidMount() {
    if (this.props.location.pathname === '/hot') {
      this.setState(
        {
          likes: true,
        },
        () => {
          this.handleSearch();
        },
      );
    } else {
      this.handleSearch();
    }
    window.onscroll = () => {
      if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 100) {
        // 如果不是已经没有数据了，都可以继续滚动加载
        if (this.state.isLoadEnd === false && this.state.isLoading === false) {
          this.handleSearch();
        }
      }
    };

    document.addEventListener('scroll', lazyload);
  }
```

为当前页面的页面滚动事件添加处理函数。

```
window.onscroll = funcRef
```
获取页面顶部被卷起来的高度

```
export function getScrollTop() {
  return Math.max(
    //chrome
    document.body.scrollTop,
    //firefox/IE
    document.documentElement.scrollTop,
  );
}
```

获取浏览器视口的高度

```
export function getWindowHeight() {
  return document.compatMode === 'CSS1Compat'
    ? document.documentElement.clientHeight
    : document.body.clientHeight;
}
```

获取页面文档的总高度
```
export function getDocumentHeight() {
  //现代浏览器（IE9+和其他浏览器）和IE8的document.body.scrollHeight和document.documentElement.scrollHeight都可以
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  );
}
```

lazyload

```
// 用新的 throttle 包装 scroll 的回调
const lazyload = throttle(() => {
  // 获取所有的图片标签
  const imgs = document.querySelectorAll('#list .wrap-img img');
  // num 用于统计当前显示到了哪一张图片，避免每次都从第一张图片开始检查是否露出
  let num = 0;
  for (let i = num; i < imgs.length; i++) {
    // 用可视区域高度减去元素顶部距离可视区域顶部的高度
    let distance = viewHeight - imgs[i].getBoundingClientRect().top;
    // 如果可视区域高度大于等于元素顶部距离可视区域顶部的高度，说明元素露出
    if (distance >= 100) {
      // 给元素写入真实的 src，展示图片
      let hasLaySrc = imgs[i].getAttribute('data-has-lazy-src');
      if (hasLaySrc === 'false') {
        imgs[i].src = imgs[i].getAttribute('data-src');
        imgs[i].setAttribute('data-has-lazy-src', true);
      }
      // 前 i 张图片已经加载完毕，下次从第 i+1 张开始检查是否露出
      num = i + 1;
    }
  }
}, 1000);
```

throttle fn是我们需要包装的事件回调, delay是时间间隔的阈值

```
export function throttle(fn, delay) {
  // last为上一次触发回调的时间, timer是定时器
  let last = 0,
    timer = null;
  // 将throttle处理结果当作函数返回

  return function() {
    // 保留调用时的this上下文
    let context = this;
    // 保留调用时传入的参数
    let args = arguments;
    // 记录本次触发回调的时间
    let now = +new Date();

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
      clearTimeout(timer);
      timer = setTimeout(function() {
        last = now;
        fn.apply(context, args);
      }, delay);
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
      last = now;
      fn.apply(context, args);
    }
  };
}
```


