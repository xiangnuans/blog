---
title: 基于 Server-Sent Events (SSE) 实现服务端向客户端的实时消息推送
date: 2024-9-12
---

是的，SSE（Server-Sent Events）是一种基于 HTTP 的单向通信技术，允许服务器向客户端主动推送消息。与 WebSocket 不同的是，SSE 是单向的，只允许服务器向客户端发送消息，而客户端不能向服务器发送消息。

使用 SSE 的步骤大致如下：

### 客户端
在客户端，通过 JavaScript 的 `EventSource` 对象来监听服务器发送的事件：
```javascript
const eventSource = new EventSource('your-server-endpoint');

eventSource.onmessage = function(event) {
  console.log('Message from server:', event.data);
};

eventSource.onerror = function(error) {
  console.log('Error:', error);
};
```

### 服务端
服务端需要返回一个持续不断的 HTTP 连接，并以特定的格式发送消息：
1. 响应头需要设置 `Content-Type: text/event-stream`。
2. 发送的数据格式为 `data: <message>\n\n`。

例如，使用 Node.js 创建一个简单的 SSE 服务器：
```javascript
const http = require('http');

http.createServer((req, res) => {
  // 设置 SSE 响应头
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // 向客户端发送数据
  setInterval(() => {
    res.write(`data: ${new Date().toISOString()}\n\n`);
  }, 1000);
}).listen(3000, () => {
  console.log('SSE server running on http://localhost:3000');
});
```

### 优点：
- 非常适合服务器推送较少但需要实时更新的场景，如推送通知、股票价格更新等。
- 相比 WebSocket，SSE 更加简单，基于 HTTP 协议，容易集成和调试。

### 缺点：
- 只支持从服务器到客户端的单向通信，如果需要双向通信，可能需要额外的 WebSocket 或其他方式。
- 连接中断后客户端需重新连接，但 `EventSource` 会自动尝试重新建立连接。