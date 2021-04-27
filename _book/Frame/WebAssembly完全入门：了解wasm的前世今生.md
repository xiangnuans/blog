# WebAssembly完全入门：了解wasm的前世今生

[转载](https://www.infoq.cn/article/lwlcldGJyC7lye95EWl8)

## WebAssembly是什么？

### 定义
> WebAssembly或者wasm是一个可移植、体积小、加载快并且兼容Web的全新格式

当然，我知道，即使你看了定义也不知道 WebAssembly 到底是什么东西。废话不多说，我们通过一个简单的例子来看看 WebAssembly 到底是什么。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-30-068b401834c9ac5c6c7c3452ef7fc5a7.png)

上图的左侧是用 C++ 实现的求递归的函数。中间是十六进制的 Binary Code。右侧是指令文本。可能有人就问，这跟 WebAssembly 有个屁的关系？**其实，中间的十六进制的 Binary Code 就是 WebAssembly。**

### 编译目标

大家可以看到，其可写性和可读性查到无法想象。那是因为WebAssembly不是用来给各位用手一行一行撸的代码，WebAssembly是一个编译目标。什么是编译目标？当我们写TypeScript的时候，Webpack最后打包生成的JavaScript文件就是编译目标。可能大家已经猜到了，上图的Binary就是左侧的C++代码经过编译器编译之后的结果。

## WebAssembly的由来

### 性能瓶颈

在业务需求越来越复杂的现在，前端的开发逻辑越来越复杂，相应的代码量随之变得越来越多。相应的，整个项目的起步的时间越来越长。在性能不好的电脑上，启动一个前端的项目甚至要花上十多秒。这些其实还好，说明前端越来越受到重视，越来越多的人开始进行前端的开发

但是除了逻辑代码复杂、代码量大，还有另一个原因是JavaScript这门语言本身的缺陷，JavaScript没有静态变量类型。这么解释型编程语言的作者Brendan Eich，仓促的创造了这么如果被广泛使用的语言，以至于JavaScript的发展史甚至某种层面上变成了填坑史。为什么说没有静态类型会降低效率。这会涉及到一些JavaScript引擎的一些知识。


静态变量类型多带来的问题
![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-30-889a44e9778c5e6c1a0f4097b3540367.png)

这是 Microsoft Edge 浏览器的 JavaScript 引擎 ChakraCore 的结构。我们来看一看我们的 JavaScript 代码在引擎中会经历什么。- JavaScript 文件会被下载下来。

然后进入 Parser，Parser 会把代码转化成 AST（抽象语法树）。
然后根据抽象语法树，Bytecode Compiler 字节码编译器会生成引擎能够直接阅读、执行的字节码。
字节码进入翻译器，将字节码一行一行的翻译成效率十分高的 Machine Code。
在项目运行的过程中，引擎会对执行次数较多的 function 记性优化，引擎将其代码编译成 Machine Code 后打包送到顶部的 Just-In-Time(JIT) Compiler，下次再执行这个 function，就会直接执行编译好的 Machine Code。但是由于 JavaScript 的动态变量，上一秒可能是 Array，下一秒就变成了 Object。那么上一次引擎所做的优化，就失去了作用，此时又要再一次进行优化。


### asm.js出现

所以为了解决这个问题，WebAssembly 的前身，asm.js 诞生了。asm.js 是一个 Javascript 的严格子集，合理合法的 asm.js 代码一定是合理合法的 JavaScript 代码，但是反之就不成立。同 WebAssembly 一样，asm.js 不是用来给各位用手 一行一行撸 的代码，asm.js 是一个 编译目标。它的可读性、可读性虽然比 WebAssembly 好，但是对于开发者来说，仍然是无法接受的。

asm.js 强制静态类型，举个例子

```js
function asmJs() {
    'use asm';

    let myInt = 0 | 0;
    let myDouble = +1.1;
}

```

为什么 asm.js 会有静态类型呢？因为像0 | 0这样的，代表这是一个 Int 的数据，而+1.1则代表这是一个 Double 的数据。


### asm.js不能解决所有的问题

可能有人有疑问，这问题不是解决了吗？那为什么会有WebAssembly？WebAssembly又解决了什么问题？打击可以再看一下上面的ChakaCore的引擎解构。无论asm.js对静态类型的问题做的再好，它始终逃不过要经过parser，要经过ByteCode Compiler，而这两步是JavaScript代码在引擎执行过程当中消耗时间最多的两步。而WebAssembly不用经过这两步。这就是WebAssembly比asm.js更快的原因。

### WebAssembly横空出世

所以在2015年，我们迎来了WebAssembly。WebAssembly是经过编译器编译之后的代码，体积小、起步快。在语法上完全脱离了JavaScript，同时具有沙盒化的执行环境。WebAssembly同样的强制静态类型，是C/C++/Rust的编译目标

## WebAssembly的优势

### WebAssembly和asm.js性能对比

下面的图是Unity WebGL使用和不适用WebAssembly的起步时间对比的一个BenchMark，给大家当作一个参考。通过这些对比也可以从侧面看出，目前所有的主流浏览器都已经只吃了WebAssembly V1（Node>=8.0.0）

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-30-329904b29808704e0e6e13dd24e56422.png)

## 与JavaScript做对比

我自己在一个用create-react-app新建的项目中，分别对比了 WebAssembly 版本和原生 JavaScript 版本的递归无优化的 Fibonacci 函数，下图是这两个函数在值是 45、48、50 的时候的性能对比。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-30-671278a878c4d2637d125db80810d926.png)

看图说话，这就是 WebAssembly 与 JavaScript 很实际的一个性能对比。几乎稳定的是 JavaScript 的两倍。

## WebAssembly在大型项目中的应用

在这里能够举的例子还是很多，比如AutoCAD、GoogleEarth、Unity、Unreal、PSPDKit、WebPack等等

### AutoCAD

这是一个用于画图的软件，在很长的一段时间是没有 Web 的版本的，原因有两个，其一，是 Web 的性能的确不能满足他们的需求。其二，在 WebAssembly 没有面世之前，AutoCAD 是用 C++ 实现的，要将其搬到 Web 上，就意味着要重写他们所有的代码，这代价十分的巨大。

而在 WebAssembly 面世之后，AutoCAD 得以利用编译器，将其沉淀了 30 多年的代码直接编译成 WebAssembly，同时性能基于之前的普通 Web 应用得到了很大的提升。正是这些原因，得以让 AutoCAD 将其应用从 Desktop 搬到 Web 中。

### Google Earth

Google Earth 也就是谷歌地球，因为需要展示很多 3D 的图像，对性能要求十分高，所以采取了一些 Native 的技术。最初的时候就连 Google Chrome 浏览器都不支持 Web 的版本，需要单独下载 Google Earth 的 Destop 应用。而在 WebAssembly 之后呢，谷歌地球推出了 Web 的版本。而据说下一个可以运行谷歌地球的浏览器是 FireFox。

### Unity 和 Unreal 游戏引擎

这里给两个油管的链接自己体验一下。

- Unity WebGL 的戳这里:
[https://youtu.be/rIyIlATjNcE](https://youtu.be/rIyIlATjNcE)
- Unreal 引擎的戳这里:
[https://www.youtube.com/watch?v=TwuIRcpeUWE](https://www.youtube.com/watch?v=TwuIRcpeUWE)


## WebAssembly要取代JavaScript？

答案是否定的

大家可以看到这是一个协作的关系。WebAssembly是被设计成JavaScript的一个完善、补充，而不是一个替代品。WebAssembly将很多变成语言带到了Web中。但是JavaScript因其不可思议的能力，仍然将保留现有的地位

## 什么时候使用WebAssembly？

说了这么多我到底什么时候该使用它呢？总结下来，大部分情况两点。

- 对性能有很高要求的App/Module/游戏
- 在Web中使用C/C++/Rust/Go的库举个简单的例子。如果你要实现的Web版本的Ins或者Facebook，你想要提高效率。那么就可以对图片进行压缩、解压缩、处理的工具，用C++实现，然后再编译回WebAssembly

## WebAssembly的几个开发工具

- AssemblyScript：支持直接讲TypeScript编译成WebAssembly。这对于很多前端同学来说，入门的门槛还是很低的
[https://github.com/AssemblyScript/assemblyscript](https://github.com/AssemblyScript/assemblyscript)

- Emscripten：可以说是WebAssembly的灵魂工具不为过，上面说了很多编译，这个就是哪个编译器。将其他的高级语言，编译成WebAssembly
[https://github.com/kripken/emscripten](https://github.com/kripken/emscripten)

- WABT: 是个将WebAssembly在字节和文本格式相互转换的一个工具，方便开发者去理解这个wasm到底在做什么事
[https://github.com/WebAssembly/wabt](https://github.com/WebAssembly/wabt)

## WebAssembly的意义

在我的个人理解上，WebAssembly并没有要替代JavaScript，一统天下的意思。我总结就两个点
- 给了Web更好的性能
- 给了Web更多的坑关于WebAssembly的性能问题，之前也花了很大的篇幅讲过了。而更多的可能，随着WebAssembly的技术越来越成熟，势必会有更多的应用，从Desktop被搬到Web上，这会使本来已经十分强大的Web更加丰富和强大

## WebAssembly实操

要进行这个实际操作，你需要安装上文提到过的编译器Emscripten，然后按照这个步骤去安装。以下的步骤都默认为你已经安装了Emscripten

安装步骤：[http://webassembly.org.cn/getting-started/developers-guide/](http://webassembly.org.cn/getting-started/developers-guide/)

## WebAssembly在Node中的应用

### 导入Emscripten环境变量

进入到你的 emscripten 安装目录，执行以下代码。
```js
source emsdk/emsdk_env.sh
```

新建 C 文件
用 C 实现一个求和文件test.c，如下。

```c
int add(int a, int b) {
    return a + b;
}
```

使用 Emscripten 编译 C 文件
在同样的目录下执行如下代码。

```wasm
emcc test.c -Os -s WASM=1 -s SIDE_MODULE=1 -o test.wasm
```
emcc就是 Emscripten 编译器，test.c是我们的输入文件，-Os表示这次编译需要优化，-s WASM=1表示输出 wasm 的文件，因为默认的是输出 asm.js，-s SIDE_MODULE=1表示就只要这一个模块，不要给我其他乱七八糟的代码，-o test.wasm是我们的输出文件。

编译成功之后，当前目录下就会生成test.wasm。

编写在 Node 中调用的代码
新建一个 js 文件test.js。代码如下。

```js
const fs = require('fs');
let src = new Uint8Array(fs.readFileSync('./test.wasm'));
const env = {
    memoryBase: 0,
    tableBase: 0,
    memory: new WebAssembly.Memory({
        initial: 256
    }),
    table: new WebAssembly.Table({
        initial: 2,
        element: 'anyfunc'
    }),
    abort: () => {throw 'abort';}
}
WebAssembly.instantiate(src, {env: env})
.then(result => {
    console.log(result.instance.exports._add(20, 89));
})
.catch(e => console.log(e));

```

执行 test.js
运行以下代码。

```
node test.js
```

然后就可以看到输出的结果 109 了。

## WebAssembly 在 React 当中的应用
通过 fetch 的方法调用 直接用 fetch 的方式。大概的调用方式如下。

```js
const fibonacciUrl = './fibonacci.wasm';
const {_fibonacci} = await this.getExportFunction(fibonacciUrl);
```
而getExportFunction具体代码如下。

```js
getExportFunction = async (url) => {
    const env = {
      memoryBase: 0,
      tableBase: 0,
      memory: new WebAssembly.Memory({
        initial: 256
      }),
      table: new WebAssembly.Table({
        initial: 2,
        element: 'anyfunc'
      })
    };
    const instance = await fetch(url).then((response) => {
      return response.arrayBuffer();
    }).then((bytes) => {
      return WebAssembly.instantiate(bytes, {env: env})
    }).then((instance) => {
      return instance.instance.exports;
    });
    return instance;
};

```
通过 import C 文件来调用
先通过 Import 的方式来引进依赖。

```js
import wasmC from './add.c';
```
然后进行调用。具体的方式如下。

```js
wasmC({
  'global': {},
  'env': {
    'memoryBase': 0,
    'tableBase': 0,
    'memory': new WebAssembly.Memory({initial: 256}),
    'table': new WebAssembly.Table({initial: 0, element: 'anyfunc'})
  }
}).then(result => {
  const exports = result.instance.exports;
  const add = exports._add;
  const fibonacci = exports._fibonacci;
  console.log('C return value was', add(2, 5643));
  console.log('Fibonacci', fibonacci(2));
});
```
详细的代码在这里: [https://github.com/detectiveHLH/webassembly-in-react](https://github.com/detectiveHLH/webassembly-in-react)

## 写在后面

如今技术出现的越来越多，但是实际上在工作中能够用到的，越并不是那么多。其实很多大厂所输出的一些技术，都是有业务场景的，有业务做推动。而不是凭空造轮子。所以总结下来适合自己的才是最好的。当然不是说不要了解新技术，了解新技术跟上步伐是十分必要的。我们现在不用，不代表不需要了解。相反，以后再遇到类似的业务场景时，我们就会多一种选择，可以更加从容的对待