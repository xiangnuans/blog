# Koa深入学习笔记一

Node原生模块整理

1）assert：  断言模块为不变量的验证提供了一组断言函数。 该模块提供了推荐的严格模式和较为宽松的遗留模式。

2）async_hooks： 异步钩子模块提供了一个 API 来注册回调，它跟踪在 Node.js 应用程序中创建的异步资源的生存期。

3） Buffer：（Buffer 类位于全局范围内，因此不太可能需要使用 require (‘ Buffer')。 缓冲区
） 在 TypedArray 引入之前，JavaScript 语言没有读取或操作二进制数据流的机制。 Buffer 类作为 Node.js API 的一部分被引入，用于在 TCP 流、文件系统操作和其他上下文中与 octet 流进行交互。
使用 TypedArray，Buffer 类实现了 Uint8Array API，这种方式更加优化，更适合 Node.js。


4）child_process:  子进程模块提供以与 popen (3)类似但不完全相同的方式生成子进程的能力。 此功能主要由子进程提供。 函数:


5) Cluster:  Js 的一个实例在一个线程中运行。 为了利用多核系统的优势，用户有时会希望启动一个 Node.js 进程集群来处理负载。 集群模块允许简单地创建所有共享服务器端口的子进程。

6) console:  控制台模块提供了一个简单的调试控制台，类似于 web 浏览器提供的 JavaScript 控制台机制。 模块导出两个特定的组件: 一个 Console 类，其方法包括 Console.log ()、 Console.error ()和 Console.warn () ，可用于写入任何 Node.js 流。 配置为写入 process.stdout 和 process.stderr 的全局控制台实例。 可以使用全局控制台而无需调用 require (“ console”)。

7) crypto: 加密模块提供了加密功能，包括一组用于 OpenSSL 的散列、 HMAC、密码、解密、签名和验证函数的包装器。

8) debugger: Js 包含一个可通过 V8 Inspector 和内置调试客户端访问的进程外调试工具。 要使用它，启动 Node.js，带有 inspect 参数，然后是调试脚本的路径; 将显示一个提示，表明调试器的成功启动:

9) dns: Dns 模块包含属于两个不同类别的函数:
使用基础操作系统设施执行名称解析的函数，以及不一定执行任何网络通信的函数。 此类别只包含一个函数: dns.lookup ()。 希望以与同一操作系统上的其他应用程序相同的方式执行名称解析的开发人员应该使用 dns.lookup ()。

连接到实际 DNS 服务器以执行名称解析的函数，并且始终使用网络执行 DNS 查询。 此类别包含 dns 模块中除 dns.lookup ()以外的所有函数。 这些函数不使用 dns.lookup ()(例如 / etc / hosts)使用的同一组配置文件。 如果开发人员不想使用底层操作系统的设施进行名称解析，而是希望始终执行 DNS 查询，那么他们应该使用这些函数。 下面是一个解析‘ archive. org'的示例，然后反向解析返回的 IP 地址。


10)events: Js 的大部分核心 API 都是围绕惯用的异步事件驱动架构构建的，在这种异步通道中，某些类型的对象(称为“发射器”)发出命名事件，从而导致调用 Function 对象(“ listeners”)。


例如: 一张网。 服务器对象在每次对等点连接到它时发出一个事件; 一个 fs。 Readstream 在打开文件时发出事件; 流在可以读取数据时发出事件。

发出事件的所有对象都是 EventEmitter 类的实例。 这些对象公开一个 eventEmitter.on ()函数，该函数允许将一个或多个函数附加到对象发出的命名事件。 通常，事件名称采用大小写混合格式，但可以使用任何有效的 JavaScript 属性键。


当 EventEmitter 对象发出事件时，将同步调用附加到该特定事件的所有函数。 被调用的侦听器返回的任何值都将被忽略，并将被丢弃

下面的示例显示一个带有单个侦听器的简单 EventEmitter 实例。 方法用于注册侦听器，而 eventEmitter.emit ()方法用于触发事件。


11)fs: Fs 模块提供了一个 API，用于以类似于标准 POSIX 函数的方式与文件系统进行交互。

所有文件系统操作都有同步和异步的形式。

异步窗体总是将完成回调作为它的最后一个参数。 传递给完成回调的参数依赖于该方法，但第一个参数始终保留用于异常。 如果操作成功完成，则第一个参数将为 null 或未定义。


12)http:/http2: Coreapi 提供了一个专门围绕 http / 2协议特性设计的低级接口。 它不是专门为与现有的 http / 1模块 API 兼容而设计的。 但是，兼容性 API 是。

The http2 Core API is much more symmetric between client and server than the http API. For instance, most events, like 'error', 'connect' and 'stream', can be emitted either by client-side code or server-side code.

13)https: Https 是基于 tls / ssl 的 HTTP 协议。 在 Node.js 中，这是作为一个单独的模块实现的。

14) inspector: 检查器模块提供了与 V8检查器交互的 API。

15)net: Net 模块提供了一个异步网络 API，用于创建基于流的 TCP 或 IPC 服务器(net.createServer ())和客户机(net.createConnection ())

16)os: Os 模块提供了操作系统相关的实用程序方法和属性。

17)path: 路径模块提供了处理文件和目录路径的实用程序。

18)process: 流程对象是一个全局对象，它提供关于当前 Node.js 流程的信息并对其进行控制。 作为一个全局，Node.js 应用程序始终可以使用 require ()。 也可以使用 require ()显式地访问它:

19)querystring: Querystring 模块提供了解析和格式化 URL 查询字符串的实用工具。

20)readline: Readline 模块提供了一个接口，用于一次从可读流(如 process.stdin)中读取一行数据


21)repl:  模块提供了一个 Read-Eval-Print-Loop (REPL)实现，可以作为独立程序使用，也可以在其他应用程序中包含。

22)stream: 流是一个用于在 Node.js 中处理流数据的抽象接口。 流模块提供了实现流接口的 API。 有很多由 Node.js 提供的流对象。 例如，对 HTTP 服务器的请求和 process.stdout 都是流实例。 流可以是可读的、可写的，或者两者兼而有之。 所有流都是 EventEmitter 的实例。


23)string_decoder: 字符串解码器模块提供了一个 API，用于以保留编码的多字节 UTF-8和 UTF-16字符的方式将 Buffer 对象解码为字符串, const { StringDecoder } = require('string_decoder’);


24)timer: 定时器模块公开一个全局 API，用于调度将在未来某个时间段调用的函数。 因为计时器函数是全局的，所以不需要调用 require (‘ timers')来使用 API。


25)TLS(SSL): Tls 模块提供了构建在 OpenSSL 之上的传输层安全性(TLS)和安全套接字层(SSL)协议的实现。 该模块可以通过以下方式访问:  const tls = require('tls’);

26)tty: Tty 模块提供 tty. ReadStream 和 tty. WriteStream 类。 在大多数情况下，不需要或不可能直接使用这个模块


27)dgram: 模块提供了 UDP 数据报套接字的实现。

28)url: 模块提供 URL 解析和解析的工具

29)util: 模块主要是为了支持 Node.js 自己的内部 api 而设计的。 但是，许多实用程序对应用程序和模块开发人员也很有用。


30)v8: 模块公开了特定于 Node.js 二进制文件中内置的 V8版本的 api。


31)vm: 模块提供了用于在 V8虚拟机上下文中编译和运行代码的 api。 Vm 模块不是安全机制。 不要使用它来运行不受信任的代码。 “沙箱”这个术语在这些文档中的使用仅仅是指一个单独的上下文，并不提供任何安全保证。


32)work_threads: 允许使用并行执行 JavaScript 的线程。

33)zlib: 模块提供了使用 Gzip 和 deflate / flate 以及 Brotli 实现的压缩功能。
