# egg中cookie与Session的使用笔记

> HTTP 请求都是无状态的，但是我们的 Web 应用通常都需要知道发起请求的人是谁。为了解决这个问题，HTTP 协议设计了一个特殊的请求头：Cookie。服务端可以通过响应头（set-cookie）将少量数据响应给客户端，浏览器会遵循协议将数据保存，并在下次请求同一个服务的时候带上（浏览器也会遵循协议，只在访问符合 Cookie 指定规则的网站时带上对应的 Cookie 来保证安全性）

## Cookie的设置和获取

Cookie 设置语法：`ctx.cookies.set(key, value, options)`

```js
this.ctx.cookies.set('name','Andy');
```

Cookie 获取语法：ctx.cookies.get(key, options)

```js
this.ctx.cookies.get('name');
```
在响应某一个 HTML 页面时，设置 Cookies：
```js
'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {

  async index() {

    /*
     *
     *  设置 cookies
     *  ctx.cookies.set(key, value, options)
     *  参数：
     *  key : cookies 的名称
     *  value ： cookies 的值
     *  optons ： 配置
     */
    this.ctx.cookies.set('username', 'Andy', {
      maxAge: 1000 * 3600 * 24, // cookies 有效期：一天
      httpOnly: true,
      signed: true, // 对 Cookies 进行签名，防止用户修改
      encrypt: true, // 对 Cookies 进行加密，同时获取时ye需要解密
    });

    // 显示表单页面，加载并渲染 HTML 模版文件
    // this.ctx.csrf 用户访问页面时生成的密钥
    await this.ctx.render('home');
  }
}

module.exports = HomeController;
```

然后打开其他页面时，可以获取这个页面中设置的 Cookies：

```js
'use strict';

const Controller = require('egg').Controller;

class NewsController extends Controller {

  // 获取数据显示到新闻页面
  async index() {

    //  获取 cookies 值
    const userinfo = this.ctx.cookies.get('username', {
      encrypt: true, // 对被加密的 Cookies 进行解密
    });
    console.log(userinfo);

    // 调用 Service 层方法
    const listInfo = await this.service.news.getNewsList();
    // 渲染模版引擎
    await this.ctx.render('news', { list: listInfo });
  }
}

module.exports = NewsController;
```

## 其他问题

1. 如何持久化存储Cookie？

默认情况下，当浏览器关闭后，Cookie自动销毁。可以设置Cookie的`options`参数（`maxAge`或者`expires`，两者选其一）设置Cookie有效期。

2. Cookie如何设置中文？

默认情况下，egg中的Cookie无法设置中文。但是，如果对Cookie进行加密操作，则可以设置中文Cookie了。还有一种方式，也可以通过将Buffer转换为base64进行设置中文了。

3. Cookie如何设置对象？

对对象进行序列化和反序列化操作即可设置对象：

- `JSON.stringify()`
- `JSON.parse()`

4. 如何清除Cookie？

将Cookie设置为空：`this.ctx.cookies.set('name', null)`, 或者设置`maxAge`过期时间为0

## Session的工作流程

当浏览器访问服务器并发送第一次请求时，服务器端会创建一个 session 对象，生成一个类似于 key，value 的键值对，然后将 key(cookie) 返回到浏览器（客户）端，浏览器下次再访问时，携带 key(cookie)，找到对应的 session（value）。

**示例代码：**
设置Session：

```js
'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {

  async index() {

    //  设置 session
    this.ctx.session.username = 'Andy';

    // 显示表单页面，加载并渲染 HTML 模版文件
    // this.ctx.csrf 用户访问页面时生成的密钥
    await this.ctx.render('home');
  }
}

module.exports = HomeController;
```

获取 Session：

```js
'use strict';

const Controller = require('egg').Controller;

class NewsController extends Controller {

  // 获取数据显示到新闻页面
  async index() {

    //  获取 session 值
    const username = this.ctx.session.username;
    console.log(username);

    // 调用 Service 层方法
    const listInfo = await this.service.news.getNewsList();
    // 渲染模版引擎
    await this.ctx.render('news', { list: listInfo });
  }
}

module.exports = NewsController;
```
设置 Session 的有效期

方法一：

```js
'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {

  async index() {

    // 设置 session
    this.ctx.session.username = 'Andy';

    //  设置 Session 的过期时间（基于 Cookies），默认过期时间 24H.
    this.ctx.session.maxAge = 2000;


    // 显示表单页面，加载并渲染 HTML 模版文件
    // this.ctx.csrf 用户访问页面时生成的密钥
    await this.ctx.render('home');
  }
}

module.exports = HomeController;
```

方法二（全局配置）

推荐在 config.default.js 文件中设置 Session。

因为 Session 是基于 Cookies 的，所以 Session 的配置和 Cookies 基本是一样的，可以使用 Cookies 里面的配置：

```js
  // 配置 Session
  config.session = {
    key: 'SESSION_ID', // 设置 Session cookies 里面的 key
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
    renew: true, // 每次刷新页面，Session 都会被延期。
  };
```

