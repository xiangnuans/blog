# egg 的 Controller 最佳实践

router描述了URL与Controller的对应关系。egg约定所有的路由都需要在`app/router`中申明，路由和对应的处理方法分开两个地方维护，开发时进场需要在`router.js`和`Controller`之间来回切换

前后协作时，后端需要为每个API都生成一份对应的API文档给前端

## 更优雅的实现

得益于JavaScript加入的decorator特性，可以是我们跟Java/C#一样，更加直观自然的做面向切面编程。

```js

// 基础版
@route('/intro')
async intro() { }

// 定义 Method
@route('/intro', { method: 'post' })
async intro() { }

// 增加权限
@route('/intro', { method: 'post', role: xxxRole })
async intro() { }

// Controller 级别中间件
@route('/intro', { method: 'post', role: xxxRole, beforeMiddleware: xxMiddleware })
async intro() { }

```

## 为什么是这样的方案

> 为什么如此复杂的功能，是不是在滥用`Decorator`?

先看看`route`的功能:
- 路由定义
- 参数校验
- 权限
- `Controller`级别中间件

router 官方完整定义中包含的功能：路由定义、中间件、权限及文档中未直接写的“权限”：

```
router.verb('router-name', 'path-match', middleware1, ..., middlewareN, app.controller.action);
```

比较下来会发现，只是多了参数校验的功能

## 参数校验

```js
class PostController extends Controller {
    async create() {
        const ctx = this.ctx;
        try {
            // 校验参数
            // 如果不传第二个参数会自动校验 `ctx.request.body`
            ctx.validate(createRule);
        } catch (err) {
            ctx.logger.warn(err.errors);
            ctx.body = { success: false };
            return;
        }
    }
};

```

在我们的业务实践中这个方案会有两个问题：

- 参数漏校验

比如用户提交的数据为 `{ a: 'a', 'b': 'b', c: 'c' }`，如果校验规则只定义了 `a`，那么 `b、c `就被漏掉了，并且后续业务中可能会使用这 2 个值。


- egg 一个request生命周期内，可以随时随地通过 `ctx.request`拿到用户数据

因为“参数漏校验”问题的存在，导致后续业务变的不稳定，随时可能都会因为用户的异常数据导致业务崩溃，或者出现安全问题。

## 解决方案

为了解决“参数漏校验”问题，我们做了如下约定：

- Controller 也需要申明入参

```js
class UserController extends Controller {
    @route('/api/user', { method: 'post' })
    async updateUser(username) {
        // ...
    }
}

```

上面的例子中，即使用户提交了海量数据，业务代码中也只能拿到 username

- Controller 之外的业务不应该直接访问 ctx.request 上的数据

也就是说，当某个 Service 方法依赖用户数据时，应该通过入参获取，而不是直接访问 ctx.request

基于以上约定，分别看看 JS、TypeScript 下我们如何解决参数校验问题：

- JS

```js
@route('/api/user', {
    method: 'post',
    rule: {
        username: { type: 'string', max: 20 },
    }
})
async updateUser(username) {
    // ...
}
```
这里使用了 egg-validate 底层依赖的 parameter 作为校验库

- TypeScript

```ts
@route('/api/user', {
    method: 'post'
})
async updateUser(username: R<{ type: string, max: 20 }>) {
    // ...
}
```

没看错，手动调用 ctx.validate(createRule) 并捕获异常的逻辑确实被我们省略掉了。“懒惰”是提高生产力的第一要素。参数、规则都有了，为什么还要自己撸代码呢？

## 新的前后端协作实践

传统的前后端开发协作方式中，后端提供 Api 给前端调用，代码类似这样：

```js
function updateUser() {
    request
        .post(`/api/user`, { username })
        .then(ret => {

        });
}

```

前端同学需要关注路由、参数、返回值。而这些信息 Controller 都已经有了，直接生成前台 service 用起来是不是更方便呢：

- Controller 代码：

```js
export class UserController {

  @route({ url: '/api/user' })
  async getUserInfo(id: number) {
    return { ... };
  }
}
```

- 生成Service

```js
export class UserService extends Base {
  /** 首页  */
  async getUserInfo(id: number) {
    const __data = { id };
    return await this.request({
      method: `get`,
      url: `/api/user`,
      data: __data,
    });
  }

}

export const metaService = new UserService();
export default new UserService();

```

- 前台使用

```js
import { userService } from 'service/user';

const userInfo = await userService.getUserInfo(id);
```
对比原来的写法：
```js
function updateUser() {
    return new Promise((resolve, reject) => {
        request
        .post(`/api/user`, { username })
        .then(ret => {
            resolve(ret);
        });
    });
}

```

userService.getUserInfo 内部封装了 request 逻辑，前端不需要在关心调用过程。

## 如何在自己的项目中使用

我们已经把最佳实践抽象为了 egg-controller 插件，可以按下面的步骤安装使用：

1. 安装 egg-controller

```
npm i egg-controller
```

2. 启用插件

打开 config/plugin.js，增加以下配置

```js
aop: {
    enable: true,
    package: 'egg-aop',
},
controller: {
    enable: true,
    package: 'egg-controller',
},

```

3. 使用插件

详细用法参考[egg-controller 文档](https://github.com/zhang740/egg-controller#egg-controller)
