# Webpack5更新日志

[转载](https://mp.weixin.qq.com/s?__biz=MzIzOTkwMjM0OQ==&mid=2247484134&idx=1&sn=03ec1f6df7e024ba2fd1b381547594b6&chksm=e9224904de55c01212e0c4624ccc23b2ab57e2a49a418df0dadf63991b30f736ae071a80f25b#rd)

webpack 团队于北京时间 10 月 12 日凌晨发布了 v5.0.0-beta.0 版本，本文译自 webpack/changelog-v5。此部分主要面向非插件开发的 webpack 使用者。

## 简要说明

此版本重点关注以下内容：

- 我们尝试通过持久化存储优化构建性能。

- 我们尝试采用更好的算法与 defalut 来改善长效缓存。

- 我们尝试通过更好的 Tree Shaking 和代码生成来改善 bundle 的大小。

- 我们尝试清除内部结构中奇怪的代码，同时在不影响 v4 功能基础上实现了新特性。

- 我们目前尝试通过引入破坏性更改来为新特性做准备，以便于我们能尽可能长期地使用 v5。


## 主要更改

### 移除废弃的代码
v4 中所有废弃的代码均已删除。

迁移：以确保你的 webapck 4 不打印弃用警告。

以下是已删除但在 v4 中没有弃用警告的内容：

现在必须为 IgnorePlugin 和 BannerPlugin 传递一个 options 对象。

### 自动一处Node polyfills

早期，webpack的目的是允许在浏览器中运行大多数node模块，但是模块整体格局发生了变化，现在许多模块的主要用途是以编写前端为目的

webpack <= 4,附带了许多node核心模块的polyfil，一旦模块中使用了任何核心模块，这些模块就会被自动启用

虽然这使得为node便携模块变得简单，但它会将超大的polyfill添加到package中。在许多情况下，这些polyfill并非必要

webpack 5会停止自动polyfill这些核心模块，并专注于前端兼容的模块

**迁移：**

- 尽可能擦韩国女士使用与前端兼容的模块。
- 可以为node核心模块手动添加polyfil。错误信息将提示如何进行此操作
- package作者：在package.json中使用browser字段，以是的package与前端代码兼容。为browser提供可选的`implementations/dependencies。`


### 采用新算法生成chunk ID 以及 module ID

添加了用于长效缓存的新算法。在生产模式下，默认启用这些功能。

`chunkIds: "deterministic", moduleIds: "deterministic"`

此算法采用确定性的方式将短数字 ID（3 或 4 个字符）分配给 modules 和 chunks。这是基于 bundle 大小和长效缓存间的折中方案。

**迁移：**

最好使用 chunkIds 和 moduleIds 的默认值。你还可以选择使用旧的默认值，chunkIds: "size", modules: "size"，这将生成较小的 bundle，但这会使得它们频繁地进行缓存。

### 以新算法混淆export名称

添加了新算法来处理export的名称。默认情况下启用
如果可能，它将以确定性方式破坏export的名称

迁移：不需要进行任何操作

### 为chunk IDs命名

在开发模式下默认启用，以新的算法为 chunk id 命名，给 chunk（以及文件名）提供易于理解的名称。module ID 由其相对于 context 的路径决定。chunk ID 由 chunk 的内容决定。

因此，你不再需要使用 import(/* webpackChunkName: "name" */ "module") 进行调试。但是，如果你要控制生产环境的文件名，那仍可使用

可以在生产中使用 chunkIds: "named"，但要确保在使用时不会意外地泄露有关模块名称的敏感信息。

**迁移：**如果你不喜欢在开发中更改文件名，则可以传递 chunkIds: "natural" 以使用旧的数字模式。

### JSON模块

JSON 模块现在符合规范，并会在使用非默认导出时发出警告。

迁移：使用默认导出。

### 嵌套tree-shaking

webpack 现在可以追踪对 exports 嵌套属性的访问。重新导出 namespace 对象，这可以改善 Tree Shaking 操作（未使用 export elimination 和 export mangling）。

```js
// inner.js
export const a = 1;
export const b = 2;

// module.js
import * as inner from "./inner";
export { inner }

// user.js
import * as module from "./module";
console.log(module.inner.a);
```

在此示例中，可以在生成模式下移除 export b。

### 内部模块（inner-module） tree-shaking

webpack 4 没有分析模块 export 与 import 之间的依赖关系。webpack 5 有一个新的选项 optimization.innerGraph，该选项在生产模式下默认启用，它对模块中的符号进行分析以找出从 export 到 import 的依赖关系。

如下述模块所示：

```js
import { something } from "./something";

function usingSomething() {
  return something;
}

export function test() {
  return usingSomething();
}
```

内部图算法将确定仅在使用 export 的 test 时使用 something。这样可以将更多 export 标记为未使用，并从 bundle 中删除更多的代码。

如果设置了 "sideEffects": false，则可以省略更多模块。在此示例中，当未使用 export 的 test 时，将忽略 ./something。

如需获取有关未使用的 export 的信息，需使用 optimization.unusedExports。如需删除无副作用的模块，需使用 optimization.sideEffects。

此方式可以分析以下符号：

- 函数声明（function declarations）

- class 声明（class declarations）

- 带有 export default 或带有变量声明（variable declarations）的

  - 函数表达式（function expressions）

  - class 语句（class expressions）

  - /*#__PURE__*/ 表达式

  - 局部变量（local variables）

  - imported bindings

### 编译器空闲并关闭（idle and close）

现在需要再使用编译器（compilers）后将其关闭。编译器具有 enter 和 leave 空闲状态，并具有这些状态的 hook。插件可以使用这些 hook 执行不重要的工作。（即，持久化缓存将延迟存储到磁盘）。在编译器关闭时，所有剩余工作应尽快完成。回调执行时，表明关闭已完成。

插件及其各自的作者应该会期望某些用户可能会忘记关闭编译器。因此，所有工作最终也应该在空闲时完成。当工作完成时，应防止进程退出。

当传递 callback 时，webpack() 实例会自动调用 close。

迁移：使用 node.js API 时，请确保在完成后调用 Complier.close。

### 改进代码生成

此版本添加了新的选项 output.ecmaVersion。它允许为 webpack 生成的运行时代码指定最大 EcmaScript 版本。

webpack 4 仅能于生成 ES5 的代码。webpack 5 现支持 ES5 或 ES2015 的代码。

默认配置将生成 ES2015 的代码。如果你需要支持旧版浏览器（例如，IE11），则可以将其降为 output.ecmaVersion: 5。

默认配置将生成 ES2015 的代码。如果你需要支持旧版浏览器（例如，IE11），则可以将其降为 output.ecmaVersion: 5。

生产模式中的默认压缩（default minimizing）也使用 ecmaVersion 选项生成较小的代码。（自 alpha.31 起）

### chunk 分割以及 module size

与之前展示单个数值相比，模块现在以更好的方式展示其 size。除此之外，现在也拥有了不同类型的 size。

目前，SplitChunksPlugin 已知道如何处理这些不同的 size，并将它们应用于 minSize 和 maxSize。默认情况下，仅处理 javascript 的 size，但你可以传递多个参数来管理它们：

```js
minSize: {
	javascript: 30000,
	style: 50000,
}
```
迁移：检查构建中使用了哪些类型的 size，并在 splitChunks.minSize 和可选的 splitChunks.maxSize 中进行配置。

### 持久化缓存

目前包含文件系统缓存。它是可选的，可以通过以下配置启用：

```js
cache: {
  // 1. 设置缓存类型为 filesystem
  type: "filesystem",

  buildDependencies: {
    // 2. 将你的配置添加为 buildDependency 以在更改配置时，使得缓存失效。
    config: [__filename]

    // 3. 如果你还有其他需要构建的内容，可以在此处添加它们
    // 请注意，loader 和所有模块中配置中引用的内容会自动添加
  }
}
```
**重要内容：**

默认情况下，webpack 会假定其所处的 node_modules 目录仅由包管理器修改。针对 node_modules 目录，将跳过哈希和时间戳处理。出于性能方面考虑，仅使用 package 的名称和版本。symlinks（例如，npm/yarn link）很友好。除非你使用 cache.managedPaths: [] 选项取消此优化，否则请不要直接在 node_modules 中编辑文件。

默认情况下，缓存将分别存储在 node_modules/.cache/webpack 中（当使用 node_modules 时）和 .pnp/.cache/webpack（当使用 Yarn PnP 时，自 alpha.21 起）。你可能永远不必手动删除它。

当使用 Yarn PnP webpack 时，如果 yarn 的缓存不可变（通常不会发生变化）。你可以通过 cache.immutablePaths: [] 退出此优化。

### 用于 single-file-target 的 chunk 分割

目前，仅允许启动单个文件 target（如 node，WebWorker，electron main）支持在运行时自动加载引导程序所需的相关代码片段。

这允许对带有 chunks: "all" 的 target 使用 splitChunks。

值得注意的是，由于 chunk 加载是异步的，因此这也会使初始估算也为异步操作。当使用 output.library 时，这可能会出现问题，因为导出的值的类型目前为 Promise。从 alpha.14 开始，这将不适用于 target: "node"，因为 chunk 加载在此 target 下为同步。

### 更新解析器

enhanced-resolve 已更新至 v5。具体改进如下：

- 当使用 Yarn PnP 时，解析器将直接处理无需其他插件

- 此 resolve 可追踪更多的依赖项，例如文件缺失

- 别名（aliasing）可能包含多种选择

- 可以设置别名（aliasing）为 false

- 性能提升

### 不包含 JS 的 chunk

不包含 JS 代码的 chunk 将不再生成 JS 文件。

### 实验阶段特性

并非所有特性从开始就文档。在 webpack 4 中，我们添加了实验性功能，并在 changelog 中指出它们是实验性的，但是从配置中并不能很清楚的了解这些功能是实验性的。

并非所有特性从开始就文档。在 webpack 4 中，我们添加了实验性功能，并在 changelog 中指出它们是实验性的，但是从配置中并不能很清楚的了解这些功能是实验性的。

并非所有特性从开始就文档。在 webpack 4 中，我们添加了实验性功能，并在 changelog 中指出它们是实验性的，但是从配置中并不能很清楚的了解这些功能是实验性的。

以下实验性功能将随 webpack 5 一同发布：

- 像 webpack 4 一样对 .mjs 提供支持（experiments.mjs）

- 像 webpack 4 一样对旧版 WebAssembly 提供支持（experiments.syncWebAssembly）

- 根据更新规范[2] 对新版 WebAssembly 提供支持（experiments.asyncWebAssembly）

  - 这使得 WebAssembly 模块成为异步模块

- Top Level Await[3] Stage 3 阶段提案（experiments.topLevelAwait）

  - 在顶层使用 await 使模块成为异步模块

- 使用 import 引入异步模块（experiments.importAsync）

- 使用 import await 引入异步模块（experiments.importAwait）

- asset 模块类似类似于 file-loader（experiments.asset）（自 alpha.19 起）

- 导出 bundle 作为模块（experiments.outputModule）（自 alpha.31 起）

  - 这将从 bundle 中移除 IIFE 的包装器，强制执行严格模式，通过 <script type="module"> 进行懒加载，并在 module 模式下将其进行压缩

请注意，这也意味着针对 .mjs 的支持和 WebAssembly 的支持将被默认禁用。

### Stats

chunk 间关系默认情况下是隐藏的。可以使用 stats.chunkRelations 进行切换。

Stats 现阶段可以区分 files 和 auxiliaryFiles。

（自 alpha.19 起）

默认情况下，Stats 会隐藏模块和 chunk id。可以使用 stats.ids 进行切换。

所有模块的列表均按照到 entrypoint 的距离排序。可以使用 stats.modulesSort 进行切换。

chunk 模块列表和 chunk 根模块列表分别根据模块名进行排序。可以分别使用 stats.chunkModulesSort 和 stats.chunkRootModulesSort 进行更改。

在串联模块中，嵌套模块列表进行拓扑排序。可以通过 stats.nestedModulesSort 进行更改。

chunks 和 assets 会显示 chunk id 的提示。

### 最低 Node.js 版本
Node.js 的最低支持版本从 6 变更为 8。

迁移：升级到最新的 node.js 可用版本。
