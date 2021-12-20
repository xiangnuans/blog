# 如何保存价值上千万的Node源代码

## 甲方突然要求做私有化部署

项目用node做的，node代码需要保护吗？

一般情况下不需要，因为代码跑在云端服务器上，只要服务器安全，node代码哪怕是铭文，也是安全的

假如某天甲方突然要求做私有化部署，而你老板爽快地答应了，并把这个问题丢给你。

好吧，现在情况改变了，你需要代码部署在不信任的环境。一旦把Node.js源代码在甲方的服务器进行打包或上线，那甲方就可以轻易地查看，分析，篡改和复制你的代码。

## 于是开始谷歌

有哪些方法可以保护js代码？

### 1. 加密

我们可以对js代码进行加密，每次执行前进行解密，实际运行的是解密后的代码，但是加密对执行效率会有影响，而且一旦密码被破解，源码就泄露了


### 2. 混淆

对代码进口行混淆，尽量地让代码变得不可读，据说这个思路是从代码写的很差的程序员身上学来的。常见的做法有：分离常量、打乱控制流、增加无意义代码、域名锁定、混淆字符串，禁用调试方法。

### 3. 编译

node代码是通过V8引擎来执行的，而V8引擎会将node代码编译成字节码（bytenode）之后再解释执行。如果我们能将node代码编译成字节码，将会进一步提高代码的安全性。毕竟反编译V8的字节码并非易事


### 4. 打包

把node代码和依赖，打包成一个可执行文件。这样可以增加一点破解的难度



## 然后从GitHub上抄代码

这里列出几个与js混淆，编译，打包相关的库或网站：

### 1. 混淆

- 一个强大的JS混淆器
[Gihttps://github.com/javascript-obfuscator/javascript-obfuscator thub](https://github.com/javascript-obfuscator/javascript-obfuscator "Github")

- 一套JS代码安全问题解决方案

[http://www.jshaman.com/](http://www.jshaman.com/ "http://www.jshaman.com/")


### 2. 编译

- 一个极简的Node字节码编译器

[https://github.com/OsamaAbbas/bytenode](https://github.com/OsamaAbbas/bytenode "Github")

### 3. 打包

-ncc可以把node项目打包成一个JS但文件，支持TypeScript，动态导入。

[https://github.com/zeit/ncc](https://github.com/zeit/ncc)

- [pkg]可以把node项目打包成一个二进制的可执行文件，pkg不支持动态导入，但是会将Node本身一起打包，可以实现再没安装node的环境运行

[https://github.com/zeit/pkg](https://github.com/zeit/pkg Github)

- [pmq20/node-packer]也能打包成一个二进制的可执行文件，它的优势在于支持各种形式的require, 也支持C++模块。可惜项目已经两年没更新了，只支持到Node.js 8.3.0, 对于更高版本的支持，请移步[slee047/node-packer](slee047/node-packer)。

[https://github.com/pmq20/node-packer](https://github.com/pmq20/node-packer github)


## 选出一个方法交差

没有绝对的安全可言，以上的方法只能是加大破解的难度。有道是世上无难事只怕有心人，只要有足够的技术和耐心，还是有可能还原出相应的代码。

作为防守方，我们能做是尽可能地多采用一些保护手段。在这里，提供一个JavaScript obfuscator + bytenode + node-packer的解决方案。

为什么选用node-packer而不是ncc，pkg呢？因为ncc和pkg无法处理混淆过的代码。

## 保护价值上千万的代码

假设我们需要保护的是这样的一个项目：

```js
// index.js
console.log("以下是价值上千万的代码:");
var a = 1;
var b = 1;
var c = a + b;
console.log("1 + 1 = " + c)
```

首先我们通过npm安装javascript-obfuscator 和 bytenode。然后在当前系统下安装node-packer。

由于node-packer无法打包由bytenode生成的.jsc字节码文件，所以需要添加以下文件来导入.jsc文件：

```js
// build.js
require('bytenode');

require('./index-obfuscated.jsc');
```

接着将以下指令加到package.json:

```js
  "scripts": {
    "obfuscate": "javascript-obfuscator index.js --string-array-encoding rc4",
    "bytenode": "bytenode --compile index-obfuscated.js",
    "nodec": "nodec build.js --skip-npm-install",
    "build": "npm run obfuscate && npm run bytenode && npm run nodec",
  }
```

最后运行`npm run build`，可以得到一个`a.out`（windows系统下是`a.exe`）的可执行文件。运行一下，价值上千万的代码就跑起来了。

此外你会发现项目目录下多了两个文件：`index-obfuscated.js`, `index-obfuscated.jsc`。它们分别是混淆之后的代码以及字节码文件。javascript-obfuscator支持多种混淆技术，可能通过查看文档，按照自己的项目需求，调配选用合适的选项。

## 结语

除了以上技术手段，别忘了加上license，注明版权信息。

感谢看到最后，最后我将为你提供这份价值上千万的代码示例。项目地址是

[https://github.com/iWinston/javascript-code-protection-example](https://github.com/iWinston/javascript-code-protection-example github)

