# egg-bin源码解析笔记（转载）

`egg-bin`是一个本地开发者工具，集成到egg中，里面涵盖了很多功能，比如调试，单元测试和代码覆盖率等这些功能，可以说是比较强大了。

下面就`egg-bin`源码分析一些东西（针对的是4.13.2）

egg-bin如何工作的：

在本地运行`egg`项目的时候，我们往往会根据不同的场景（调试、测试等）来选择不同的命令（`egg-bin dev、egg-bin debug`）启动项目，从而达到我们需要的效果，但是`egg-bin`是如何让命令运行起来的呢？

比如在命令行中回车下面的命令：
```
$ egg-bin dev --port 7001
```
开始进入`node_modules/egg-bin/bin/egg-bin.js`文件，文件代码比较简单：
```
#!/usr/bin/env node
'use strict';
const Command = require('..');
new Command().start();
```

其中，`Command`对应的是`node_modules/egg-bin/bin.egg-bin.js`中的E`EggBin`对象。首先理清以下`egg-bin`中对应的几个对象之间的关系，如下图：
![](https://raw.githubusercontent.com/SunShinewyf/issue-blog/master/assets/technical/23.png)

其中最后导出的`EggBin`对象以及`DevCommand、AutodCommand、TestCommand、PkgFilesCommand`继承于`egg-bin/lib/command.js`里面导出的Command对象，而`egg-bin/lib/command.js`里面导出的`Command`又是继承于第三库[command-bin](https://github.com/node-modules/common-bin)，而`command-bin`中导出的CommandBin对象又是一个yards属性，该属性是目前比较流行的命令工具[yargs](https://github.com/yargs/yargs)。`DebugCommand`和`CovCommand`则分别继承自`DevCommand`和`TestCommand`。

进入`index.js`文件源代码，该文件至少定义了`EggBin`这个对象，并且将一些`sub command`挂载到`EggBin`这个导出对象中，有如下几个自命令：

```js
// load directory
this.load(path.join(__dirname, 'lib/cmd'));
```

- Command --- 继承自 common-bin的基础命令对象
- CovCommand --- 代码覆盖率命令对象
- DevCommand --- 本地开发命令对象
- TestCommand --- 测试命令对象
- DebugCommand --- 调试命令对象
- PkgfilesCommand --- 包文件对象

接着就是执行`bin/egg-bin.js`文件中的`new Command().start()`这一行，首先会先去执行`EggBin`构造函数中的内容：

```js
class EggBin extends Command {
  constructor(rawArgv) {
    // 获取用户输入的options
    super(rawArgv);
    this.usage = 'Usage: egg-bin [command] [options]';

    // load 对应目录下的command文件
    this.load(path.join(__dirname, 'lib/cmd'));
  }
}
```

## 获取命令参数

由于上面的继承关系，第一行就会直接执行到`Command-bin/lib/command.js`中的第一行
```js
/**
  * original argument
  * @type {Array}
  */
this.rawArgv = rawArgv || process.argv.slice(2);
```

此时 this.rawArgv的值如下：
```
0: "dev"
1: "--port"
2: "7001"
```

## load 配置文件

获取到这个参数之后就会直接将该参数传给`yargs`并将y`yargs`对象赋给自己的一个`yargs`属性

```js
/**
  * yargs
  * @type {Object}
  */
this.yargs = yargs(this.rawArgv);
```

然后就开始`load`命令行文件了，通过追踪，也可以发现最后执行的也是`common-bin`中的`load`命令`common-bin`中的`load`成员函数，该函数要求参数是所需要获取的命令文件的绝对路径，其中`common-bin/command.js`中的`load`源码如下：

```js
load(fullPath) {
    // 省略对参数的校验
    // load entire directory
    const files = fs.readdirSync(fullPath);
    const names = [];
    for (const file of files) {
      if (path.extname(file) === '.js') {
        const name = path.basename(file).replace(/\.js$/, '');
        names.push(name);
        this.add(name, path.join(fullPath, file));
      }
    }
   // 省略
  }
```
其中files文件的值为egg-bin/lib/cmd下文件名称：
```
0: "autod.js"
1: "cov.js"
2: "debug.js"
3: "dev.js"
4: "pkgfiles.js"
5: "test.js"
```

然后将files进行遍历，执行下面的add的操作:
```js
  /**
   * add sub command
   * @param {String} name - a command name
   * @param {String|Class} target - special file path (must contains ext) or Command Class
   * @example `add('test', path.join(__dirname, 'test_command.js'))`
   */
 add(name, target) {
    assert(name, `${name} is required`);
    if (!(target.prototype instanceof CommonBin)) {
      assert(fs.existsSync(target) && fs.statSync(target).isFile(), `${target} is not a file.`);
      debug('[%s] add command `%s` from `%s`', this.constructor.name, name, target);
      target = require(target);
      assert(target.prototype instanceof CommonBin,
        'command class should be sub class of common-bin');
    }
    this[COMMANDS].set(name, target);
  }
```

其中要求 参数`target`也是对应的文件的绝对路径。在进行条件判断之后直接使用`set`将该命令挂载在`this[COMMANDS]`变量中。遍历完成后`this[COMMANDS]`的值如下所示：

![](https://raw.githubusercontent.com/SunShinewyf/issue-blog/master/assets/technical/25.png)

## 执行start()

最重要的`start`操作，追根溯源也是执行的`common-bin`里面的`start()`, `start()`里面主要使用`co`包了一个`generator`函数，并且在`genertor`函数中执行了`this[DISPATCH]`,然后，重头戏来了，`this[DISPATCH]`的源码如下：
```js
  /**
   * dispatch command, either `subCommand.exec` or `this.run`
   * @param {Object} context - context object
   * @param {String} context.cwd - process.cwd()
   * @param {Object} context.argv - argv parse result by yargs, `{ _: [ 'start' ], '$0': '/usr/local/bin/common-bin', baseDir: 'simple'}`
   * @param {Array} context.rawArgv - the raw argv, `[ "--baseDir=simple" ]`
   * @private
   */
  * [DISPATCH]() {
    // define --help and --version by default
    this.yargs
      // .reset()
      .completion()
      .help()
      .version()
      .wrap(120)
      .alias('h', 'help')
      .alias('v', 'version')
      .group([ 'help', 'version' ], 'Global Options:');

    // get parsed argument without handling helper and version
    const parsed = yield this[PARSE](this.rawArgv);
    const commandName = parsed._[0];

    if (parsed.version && this.version) {
      console.log(this.version);
      return;
    }

    // if sub command exist
    if (this[COMMANDS].has(commandName)) {
      const Command = this[COMMANDS].get(commandName);
      const rawArgv = this.rawArgv.slice();
      rawArgv.splice(rawArgv.indexOf(commandName), 1);

      debug('[%s] dispatch to subcommand `%s` -> `%s` with %j', this.constructor.name, commandName, Command.name, rawArgv);
      const command = this.getSubCommandInstance(Command, rawArgv);
      yield command[DISPATCH]();
      return;
    }

    // register command for printing
    for (const [ name, Command ] of this[COMMANDS].entries()) {
      this.yargs.command(name, Command.prototype.description || '');
    }

    debug('[%s] exec run command', this.constructor.name);
    const context = this.context;

    // print completion for bash
    if (context.argv.AUTO_COMPLETIONS) {
      // slice to remove `--AUTO_COMPLETIONS=` which we append
      this.yargs.getCompletion(this.rawArgv.slice(1), completions => {
        // console.log('%s', completions)
        completions.forEach(x => console.log(x));
      });
    } else {
      // handle by self
      yield this.helper.callFn(this.run, [ context ], this);
    }
  }
```

首先会去执行`yargs`中的一些方法，这里`common-bin`只是保留了`yargs`中一些对自己有用的方法，比如`completion()、wrap()、alias()`等，具体关于`yargs`的`API`可以移步[这里](https://github.com/yargs/yargs/blob/master/docs/api.md)。接着是执行`this[PARSE]`将`rawArgv`进行处理，处理后的`parse`对象结构如下：

![](https://raw.githubusercontent.com/SunShinewyf/issue-blog/master/assets/technical/24.png)

接着就是对获取到的命令行进行校验，如果存在`this[COMMAND]`对象中就执行。在当前例子中也就是去执行`DevCommand`。而由于`DevCommand`最终也是继承于`common-bin`的，然后执行`yield command[DISPATCH]()`;又是递归开始执行`this[DISPATCH]`了，直到所有的子命令递归完毕，才会去使用`helper（common-bin`中支持的异步关键所在)类继续执行每个`command`文件中的`*run()`函数。

## egg-bin中的子命令文件

**dev.js**

作为在`egg`项目中本地开发最为重要的开发命令，`dev.js`无疑肩负着比较重要的指责。在`dev.js`中，主要是定义了一些默认的端口号，以及入口命令等。`*run`的源码如下：
```js
  * run(context) {
    const devArgs = yield this.formatArgs(context);
    const env = {
      NODE_ENV: 'development',
      EGG_MASTER_CLOSE_TIMEOUT: 1000,
    };
    const options = {
      execArgv: context.execArgv,
      env: Object.assign(env, context.env),
    };
    debug('%s %j %j, %j', this.serverBin, devArgs, options.execArgv, options.env.NODE_ENV);
    yield this.helper.forkNode(this.serverBin, devArgs, options);
  }
```

主要是对当前的上下文参数进行转化并对端口进行了一些处理，然后就开始调用`helper`的`forkNode`来执行入口命令，其中`this.serverBin`的值为：`Users/uc/Project/egg-example/node_modules/egg-bin/lib/start-cluster`,下面的事情可以异步[这里](./结合源码揭秘egg运行原理)进行了解：

**debug.js**

有上分析可知，`DebugCommand`继承于`DevCommand`，所以在`constructor`的时候就会去执行`dev`中的一些`options`，而且在`debug.js`中的`*run`函数中直接调用的是`dev.js`中的`formatArgs()`参数处理。关键源码（有删减）如下：
```js
 * run(context) {
    const proxyPort = context.argv.proxy;
    context.argv.proxy = undefined;

    const eggArgs = yield this.formatArgs(context);
    //省略部分

    // start egg
    const child = cp.fork(this.serverBin, eggArgs, options);

    // start debug proxy
    const proxy = new InspectorProxy({ port: proxyPort });
    // proxy to new worker
    child.on('message', msg => {
      if (msg && msg.action === 'debug' && msg.from === 'app') {
        const { debugPort, pid } = msg.data;
        debug(`recieve new worker#${pid} debugPort: ${debugPort}`);
        proxy.start({ debugPort }).then(() => {
          console.log(chalk.yellow(`Debug Proxy online, now you could attach to ${proxyPort} without worry about reload.`));
          if (newDebugger) console.log(chalk.yellow(`DevTools → ${proxy.url}`));
        });
      }
    });

    child.on('exit', () => proxy.end());
  }
```

此处首先是开启`egg`,做的是和`dev`里面一样的东西，然后则是实例化`InspectorProxy`进行`debug`操作，在命令行打印出`devtools`的地址。

**test.js**

这个命令主要是用来运行`egg`项目中的`test`文件的，也就是跑我们自己写的测试用例，关于如何写单元测试，可以异步[单元测试](https://eggjs.org/zh-cn/core/unittest.html),在这个文件，`*run`形式也和上面类似，然后调用`this.formatTestArgs()，formatTestArgs`源码如下（有删减）：
```js
  /**
   * format test args then change it to array style
   * @param {Object} context - { cwd, argv, ...}
   * @return {Array} [ '--require=xxx', 'xx.test.js' ]
   * @protected
   */
  * formatTestArgs({ argv, debugOptions }) {
    const testArgv = Object.assign({}, argv);

    /* istanbul ignore next */
    testArgv.timeout = testArgv.timeout || process.env.TEST_TIMEOUT || 60000;
    testArgv.reporter = testArgv.reporter || process.env.TEST_REPORTER;
    // force exit
    testArgv.exit = true;

    // whether is debug mode, if pass --inspect then `debugOptions` is valid
    // others like WebStorm 2019 will pass NODE_OPTIONS, and egg-bin itself will be debug, so could detect `process.env.JB_DEBUG_FILE`.

    if (debugOptions || process.env.JB_DEBUG_FILE) {
      // --no-timeout
      testArgv.timeout = false;
    }

    // collect require
    let requireArr = testArgv.require || testArgv.r || [];
    /* istanbul ignore next */
    if (!Array.isArray(requireArr)) requireArr = [ requireArr ];

    // clean mocha stack, inspired by https://github.com/rstacruz/mocha-clean
    // [mocha built-in](https://github.com/mochajs/mocha/blob/master/lib/utils.js#L738) don't work with `[npminstall](https://github.com/cnpm/npminstall)`, so we will override it.
    if (!testArgv.fullTrace) requireArr.unshift(require.resolve('../mocha-clean'));

    requireArr.push(require.resolve('co-mocha'));

    if (requireArr.includes('intelli-espower-loader')) {
      console.warn('[egg-bin] don\'t need to manually require `intelli-espower-loader` anymore');
    } else {
      requireArr.push(require.resolve('intelli-espower-loader'));
    }

    // for power-assert
    if (testArgv.typescript) {
      // remove ts-node in context getter on top.
      requireArr.push(require.resolve('espower-typescript/guess'));
    }

    testArgv.require = requireArr;

    let pattern;
    // changed
    if (testArgv.changed) {
      pattern = yield this._getChangedTestFiles();
      if (!pattern.length) {
        console.log('No changed test files');
        return;
      }
    }

    if (!pattern) {
      // specific test files
      pattern = testArgv._.slice();
    }
    if (!pattern.length && process.env.TESTS) {
      pattern = process.env.TESTS.split(',');
    }

    // collect test files
    if (!pattern.length) {
      pattern = [ `test/**/*.test.${testArgv.typescript ? 'ts' : 'js'}` ];
    }
    pattern = pattern.concat([ '!test/fixtures', '!test/node_modules' ]);

    // expand glob and skip node_modules and fixtures
    const files = globby.sync(pattern);
    files.sort();

    if (files.length === 0) {
      console.log(`No test files found with ${pattern}`);
      return;
    }

    // auto add setup file as the first test file
    const setupFile = path.join(process.cwd(), 'test/.setup.js');
    if (fs.existsSync(setupFile)) {
      files.unshift(setupFile);
    }
    testArgv._ = files;

    // remove alias
    testArgv.$0 = undefined;
    testArgv.r = undefined;
    testArgv.t = undefined;
    testArgv.g = undefined;
    testArgv.typescript = undefined;

    return this.helper.unparseArgv(testArgv);
  }

```

代码里面的注释很清楚了，就是将单元测试的一些库`push`进`requireArr`的值如下：
![](https://raw.githubusercontent.com/SunShinewyf/issue-blog/master/assets/technical/26.png)

其中`mocha-clean`是清除上一次`mocha`遗留的堆栈了，后面两个就是egg选用的测试框架和断言库了。

然后就是加载egg项目中除掉`node_modules`和`fixtures`里面的`test`文件，即项目层面的`*.test.js`后面也就是开启进程进行单元测试。

**cov.js**

`cov.js`是用来测试代码的覆盖率的。其中`CovCommand`继承自`TestCommand`，在`cov`的`*run`中主要定义了字段，比如`exclude、nycCli、coverageDir、outputDir`等。根据英文命名就知道是什么意思了。然后继续执行`getCovArgs`是对参数的一些处理，源码也就很简单，就不贴出来了，在`getCovArgs`中将上面`test.js`中的承诺书一起`concat`进来了，最后返回的`covArgs`的样子是这样的：

![](https://raw.githubusercontent.com/SunShinewyf/issue-blog/master/assets/technical/27.png)

然后又是开启进程了。

**autod.js**和**pkgfiles.js**

这两个比较简单，这里就不再赘述了

# 总结

整个`egg-bin`看下来，还是很厉害的，涉及的都是我之前没听过或者听过但是没用过的高大尚的东西，比如`commander.js,yargs,mocha,co-mocha,power-assert,istanbuljs,nyc，`



