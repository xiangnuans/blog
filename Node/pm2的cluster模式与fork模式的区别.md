# pm2的cluster模式与fork模式的区别

## fork模式

fork模式使用最基本的进程运行方式，知识但实例运行server，无法实现TCP连接共享；好处时可以修改exec_interpreter，使用pm2运行js之外的语言，例如PHP或python


```
pm2 --interpreter [bash|python|...]
```

## cluster模式

利用node Cluster模块实现，只能用于启动node进程，无法应用于其他语言，可以启动多个server实例，并在各个实例之间实现负载均衡而且共享TCP连接，可以提升服务器的响应性能。


1. cluster用于运行一些可以共享TCP联机的worker进程，首先创建一个master进程，虽有根据设置的次数fork处响应用的workers，master和workers通过进程间通行（IPC）实现TCP句柄等数据交换，cluster模块自带负载均衡，默认使用Round-Robin算法实现，master监听TCP端口，并根据RR算法将请求交给钦定的worker进行处理。

cluster代码实现：

```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```
pm2内置了一cluster模式启动server的方式，不需要对代码进行改动，只需要生成自己的http server：

```js

var http = require('http');

http.createServer(function(req, res) {
  res.writeHead(200);
  res.end("hello world");
}).listen(8080);
```

随后：

```
pm2 start app.js -i 4
```
4表示启动4个server实例，输入0可以以机器CPU核心数来启动server实例。

2. 及时调整集群

pm2通过scale命令及时调整集群数，如果线上运行时发现worker数不足以支撑请求，可以使用

```
pm2 scale <app name> +3
```

添加三个server实例

3. 无缝重启

`pm2 reload <app name>`可以重启app对应的所有worker，重启对于每一个worker，会在一个新的worker生成之后再kill掉之前的worker，这样即便是对服务器进行更新时，也可以正常处理用户的请求，做到无缝升级重启。同时可以参考pm2的gracefulReload命令，实现在实例推出之前关闭数据库连接需要处理的操作：

```js
process.on('message', function (msg) {
  if (msg === 'shutdown') {
    close_all_connections();
    delete_cache();
    server.close();
    process.exit(0);
  }
});
```

