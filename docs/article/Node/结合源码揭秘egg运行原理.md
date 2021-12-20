[转载自](https://github.com/SunShinewyf/issue-blog/issues/30)
# 关于egg
egg是阿里开源的一个框架，为企业级框架和应用而生，相较于express和koa，有更加严格的目录结构和规范，使得团队可以在基于egg定制化自己的需求或者根据egg封装出适合自己团队业务的更上层框架

# egg所处的定位
天猪曾经在这篇优秀的博文中给出关于egg的定位，如下图：
![](https://raw.githubusercontent.com/SunShinewyf/issue-blog/master/assets/technical/20.png)

可以看到egg处于的是一个中间层的角色，基于koa，不同于koa以middleware为主要生态，egg根据不同的业务需求和场景，加入了plugin,extends等这些功能，可以让开发者摆脱在使用middleware功能时无法控制使用顺序的被动状态，而且还可以增加一些请求无关的一些功能。除此之外，egg还有很多其他优秀的功能，在这里不详述。想了解更多可以移步这里

# 初始化项目
egg有直接生成整个项目的脚手架功能，只需要执行如下几条命令，就可以生成一个新的项目：

```
$ npm i egg-init -g
$ egg-init helloworld --type=simple
$ cd egg-helloworld
$ npm i
```
启动项目：

```
$ npm run dev
$ open localhost:7001
```
# egg是如何运行起来的

下面通过追踪源码来讲解一下egg究竟是如何运行起来的：

查看`egg-init`脚手架生成的项目文件，可以看到整个项目文件是没有严格意义上的入口文件的，根据`package.json`中的`script`命令，可以看到执行的直接是`egg-bin dev`的命令。找到`egg-bin`文件夹中的`dev.js`,会看到里面会去执行`start-cluster`文件：

```js
//dev.js构造函数中
this.serverBin = path.join(__dirname, '../start-cluster');
// run成员函数
* run(context) {
	//省略
    yield this.helper.forkNode(this.serverBin, devArgs, options);
}
```
移步到start-cluster.js文件，可以看到关键的一行代码：

```js
require(options.framework).startCluster(options);
```
其中`options.framework`打印信息为:

> /Users/wyf/Project/egg-example/node_modules/egg

找到对应的`egg`目录中的`index.js`文件：

```js
exports.startCluster = require('egg-cluster').startCluster;
```
继续追踪可以看到最后运行的其实就是`egg-cluster`中的`startCluster`,并且会`fork`出`agentWorker`和`appWorks`，官方文档对于不同进程的`fork`顺序以及不同进程之间的`IPC`有比较清晰的说明,
主要的顺序如下：

- Master 启动后先 fork Agent 进程
- Agent 初始化成功后，通过 IPC 通道通知 Master
- Master 再 fork 多个 App Worker
- App Worker 初始化成功，通知 Master
- 所有的进程初始化成功后，Master 通知 Agent 和 Worker 应用启动成功
通过代码逻辑也可以看出它的顺序:

```js
//在egg-ready状态的时候就会执行进程之间的通信
this.ready(() => {
  //省略代码
  const action = 'egg-ready';
  this.messenger.send({ action, to: 'parent' });
  this.messenger.send({ action, to: 'app', data: this.options });
  this.messenger.send({ action, to: 'agent', data: this.options });
});

this.on('agent-exit', this.onAgentExit.bind(this));
this.on('agent-start', this.onAgentStart.bind(this));
this.on('app-exit', this.onAppExit.bind(this));
this.on('app-start', this.onAppStart.bind(this));
this.on('reload-worker', this.onReload.bind(this));

// fork app workers after agent started
this.once('agent-start', this.forkAppWorkers.bind(this));
```
通过上面的代码可以看出，master进程会去监听当前的状态，比如在检测到agent-start的时候才去fork AppWorkers,在当前状态为egg-ready的时候，会去执行如下的进程之间的通信：

- master---> parent
- master ---> agent
- master ---> app
`fork`出了`appWorker`之后，每一个进程就开始干活了，在`app_worker.js`文件中，可以看到进程启动了服务，具体代码：

```js
//省略代码
function startServer() {
  let server;
  if (options.https) {
    server = require('https').createServer({
      key: fs.readFileSync(options.key),
      cert: fs.readFileSync(options.cert),
    }, app.callback());
  } else {
    server = require('http').createServer(app.callback());
  }
 //省略代码
}
```
然后就回归到koa中的入口文件干的事情了。

除此之外，每一个appWorker还实例化了一个Application：

```js
const Application = require(options.framework).Application;
const app = new Application(options);
```
在实例化`application(options)`时，就会去执行`node_modules->egg`模块下面loader目录下面的逻辑，也就是`agentWorker`进程和多个`appWorkers`进程要去执行的加载逻辑，具体可以看到`app_worker_loader.js`文件中的`load():`

```js
load() {
    // app > plugin > core
    this.loadApplicationExtend();
    this.loadRequestExtend();
    this.loadResponseExtend();
    this.loadContextExtend();
    this.loadHelperExtend();

    // app > plugin
    this.loadCustomApp();
    // app > plugin
    this.loadService();
    // app > plugin > core
    this.loadMiddleware();
    // app
    this.loadController();
    // app
    this.loadRouter(); // 依赖 controller
  }
}
```
这也是下面要讲的东西了

在真正执行业务代码之前，egg会先去干下面一些事情：

## 加载插件
`egg`中内置了如下一系列插件:

- onerror 统一异常处理
- Session Session 实现
- i18n 多语言
- watcher 文件和文件夹监控
- multipart 文件流式上传
- security 安全
- development 开发环境配置
- logrotator 日志切分
- schedule 定时任务
- static 静态服务器
- jsonp jsonp 支持
- view 模板引擎
加载插件的逻辑是在egg-core里面的plugin.js文件，先看代码：

```js
loadPlugin() {

    //省略代码
    //把本地插件，egg内置的插件以及app的框架全部集成到allplugin中
    this._extendPlugins(this.allPlugins, eggPlugins);
    this._extendPlugins(this.allPlugins, appPlugins);
    this._extendPlugins(this.allPlugins, customPlugins);

    //省略代码
    //遍历操作
    for (const name in this.allPlugins) {
      const plugin = this.allPlugins[name];

      //对插件名称进行一些校验
      this.mergePluginConfig(plugin);
      //省略代码
      }
      if (plugin.enable) {
        //整合所有开启的插件
        enabledPluginNames.push(name);
      }
 }
```
如上代码（只是贴出了比较关键的地方），这段代码主要是将本地插件、`egg`中内置的插件以及应用的插件进行了整合。其中`this.allPlugins`的结果如下：

![](https://raw.githubusercontent.com/SunShinewyf/issue-blog/master/assets/technical/21.png)

可以看出，`this.allPlugins`包含了所有内置的插件以及本地开发者自定义的插件。先获取所有插件的相关信息，然后将所有插件进行遍历，执行`this.mergePluginConfig()`函数，这个函数主要是对插件名称进行一些校验。之后还对项目中已经开启的插件进行整合。`plugin.js`文件还做了一些其他事情，比如获取插件路径，读取插件配置等等，这里不一一讲解。

## 扩展内置对象
> 包括插件里面定义的扩展以及开发者自己写的扩展，这也是这里讲的内容。

在对内置对象进行扩展的时候，实质上执行的是`extend.js`文件，扩展的对象包括如下几个：

- Application
- Context
- Request
- Response
- Helper
通过阅读`extend.js`文件可以知道，其实最后每个对象的扩展都是直接调用的`loadExtends`这个函数。拿`Application`这个内置对象进行举例：

```js
loadExtend(name, proto) {
    // All extend files
    const filepaths = this.getExtendFilePaths(name);
    // if use mm.env and serverEnv is not unittest
    const isAddUnittest = 'EGG_MOCK_SERVER_ENV' in process.env && this.serverEnv !== 'unittest';
    for (let i = 0, l = filepaths.length; i < l; i++) {
      const filepath = filepaths[i];
      filepaths.push(filepath + `.${this.serverEnv}.js`);
      if (isAddUnittest) filepaths.push(filepath + '.unittest.js');
    }

    const mergeRecord = new Map();
    for (let filepath of filepaths) {
      filepath = utils.resolveModule(filepath);
      if (!filepath) {
        continue;
      } else if (filepath.endsWith('/index.js')) {
        // TODO: remove support at next version
        deprecate(`app/extend/${name}/index.js is deprecated, use app/extend/${name}.js instead`);
      }
      const ext = utils.loadFile(filepath);

      //获取内置对象的原有属性
      const properties = Object.getOwnPropertyNames(ext)
        .concat(Object.getOwnPropertySymbols(ext));

		//对属性进行遍历
      for (const property of properties) {
        if (mergeRecord.has(property)) {
          debug('Property: "%s" already exists in "%s"，it will be redefined by "%s"',
            property, mergeRecord.get(property), filepath);
        }

        // Copy descriptor
        let descriptor = Object.getOwnPropertyDescriptor(ext, property);
        let originalDescriptor = Object.getOwnPropertyDescriptor(proto, property);
        if (!originalDescriptor) {
          // try to get descriptor from originalPrototypes
          const originalProto = originalPrototypes[name];
          if (originalProto) {
            originalDescriptor = Object.getOwnPropertyDescriptor(originalProto, property);
          }
        }
       //省略代码
       //将扩展属性进行合并
        Object.defineProperty(proto, property, descriptor);
        mergeRecord.set(property, filepath);
      }
      debug('merge %j to %s from %s', Object.keys(ext), name, filepath);
    }
},
```
将`filepaths`进行打印,如下图：

![](https://raw.githubusercontent.com/SunShinewyf/issue-blog/master/assets/technical/22.png)

可以看出，`filepaths`包含所有的对`application`扩展的文件路径，这里会首先将所有插件中扩展或者开发者自己自定义的扩展文件的路径获取到，然后进行遍历，并且对内置对象的一些原有属性和扩展属性进行合并，此时对内置对象扩展的一些属性就会添加到内置对象中。所以在执行业务代码的时候，就可以直接通过访问`application.`属性（或方法）进行调用。

## 加载中间件
对中间件的加载主要是执行的`egg-core`中的`middleware.js`文件，里面的代码思想也是和上面加载内置对象是一样的，也是将插件中的中间件和应用中的中间件路径全部获取到，然后进行遍历。

遍历完成之后执行中间件就和`koa`一样了，调用`co`进行包裹遍历。

加载控制器
对控制器的加载主要是执行的`egg-core`中的`controller.js`文件
`egg`的官方文档中，插件的开发这一节提到：

插件没有独立的 `router` 和 `controller`

所以在加载`controller`的时候，主要是load应用里面的`controller`即可。详见代码;
```js
loadController(opt) {
    opt = Object.assign({
      caseStyle: 'lower',
      directory: path.join(this.options.baseDir, 'app/controller'),
      initializer: (obj, opt) => {
        if (is.function(obj) && !is.generatorFunction(obj) && !is.class(obj)) {
          obj = obj(this.app);
        }
        if (is.promise(obj)) {
          const displayPath = path.relative(this.app.baseDir, opt.path);
          throw new Error(`${displayPath} cannot be async function`);
        }
        if (is.class(obj)) {
          obj.prototype.pathName = opt.pathName;
          obj.prototype.fullPath = opt.path;
          return wrapClass(obj);
        }
        if (is.object(obj)) {
          return wrapObject(obj, opt.path);
        }
        if (is.generatorFunction(obj)) {
          return wrapObject({ 'module.exports': obj }, opt.path)['module.exports'];
        }
        return obj;
      },
    }, opt);
    const controllerBase = opt.directory;

    this.loadToApp(controllerBase, 'controller', opt);
    this.options.logger.info('[egg:loader] Controller loaded: %s', controllerBase);
},
```
这里主要是针对`controller`的类型进行判断（是否是`Object,class,promise,generator`)，然后分别进行处理

加载`service`
加载`service`的逻辑是`egg-core`中的`service.js,service.js`这个文件比较简单，代码如下:
```js
loadService(opt) {
    // 载入到 app.serviceClasses
    opt = Object.assign({
      call: true,
      caseStyle: 'lower',
      fieldClass: 'serviceClasses',
      directory: this.getLoadUnits().map(unit => path.join(unit.path, 'app/service')),
    }, opt);
    const servicePaths = opt.directory;
    this.loadToContext(servicePaths, 'service', opt);
  },
```
首先也是先获取所有插件和应用中声明的`service.js`文件目录，然后执行`this.loadToContext()`

`loadToContext()`定义在`egg-loader.js`文件中，继续追踪，可以看到在`loadToContext()`函数中实例化了`ContextLoader`并执行了`load()`，其中`ContextLoader`继承自`FileLoader`,而且`load()`是声明在`FileLoader`类中的。
通过查看`load()`代码可以发现里面的逻辑也是将属性添加到上下文(`ctx`)对象中的。也就是说加载`context`对象是在加载`service`的时候完成的。

而且值得一提的是：在每次刷新页面重新加载或者有新的请求的时候，都会去执行`context_loader.js`里面的逻辑，也就是说`ctx`上下文对象的内容会随着每次请求而发生改变，而且`service`对象是挂载在`ctx`对象下面的，对于`service`的更新，这里有一段代码：
```js
// define ctx.service
Object.defineProperty(app.context, property, {
  get() {
    // distinguish property cache,
    // cache's lifecycle is the same with this context instance
    // e.x. ctx.service1 and ctx.service2 have different cache
    if (!this[CLASSLOADER]) {
      this[CLASSLOADER] = new Map();
    }
    const classLoader = this[CLASSLOADER];

	 //先判断是否有使用
    let instance = classLoader.get(property);
    if (!instance) {
      instance = getInstance(target, this);
      classLoader.set(property, instance);
    }
    return instance;
  },
});
```
在更新`service`的时候，首先会去获取`service`是否挂载在`ctx`中，如果没有，则直接返回，否则实例化`service`，这也就是`service`模块中的延迟实例化

加载路由
加载路由的逻辑主要是`egg-core`中的`router.js`文件
```
loadRouter() {
    // 加载 router.js
    this.loadFile(path.join(this.options.baseDir, 'app/router.js'));
},
```
可以看出很简单，只是加载应用文件下的`router.js`文件

加载配置
直接加载配置文件并提供可配置的方法。

设置应用信息
对`egg`应用信息的设置逻辑是对应的`egg-core`中的`egg-loader.js`,里面主要是提供一些方法获取整个`app`的信息，包括`appinfo，name,path`等，比较简单，这里不一一列出

执行业务逻辑
然后就会去执行如渲染页面等的逻辑

总结
这里只是我个人针对源代码以及断点调试总结的一些东西，如有不同见解或者觉得有哪些错误的地方，可以私聊拍砖
