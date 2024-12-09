---
title: 服务端单向消息通知
date: 2024-12-7
---


实现服务端向客户端的单向消息通知，可以选择以下几种主流的技术方案，具体取决于你的应用场景、技术栈和需求：

## 1. WebSocket

WebSocket 是一种双向通信协议，非常适合实时消息通知。

### 优点:

-	支持服务器向客户端主动推送消息。
-	连接保持长时间活跃，适合高频实时通信。
-	被广泛支持的浏览器和服务器端技术。

### 实现步骤:

####	1.	服务端
使用 WebSocket 库（如 ws、socket.io 或框架自带的支持）来建立 WebSocket 服务。

```js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send(JSON.stringify({ type: 'welcome', message: 'Hello, Client!' }));

  // 推送消息
  setInterval(() => {
    ws.send(JSON.stringify({ type: 'notification', message: 'New update available!' }));
  }, 5000);

  ws.on('close', () => console.log('Client disconnected'));
});

```


####	2.	客户端
通过 WebSocket API 连接服务器并接收消息。
```js
const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Message from server:', data);
};

```

## 2. Server-Sent Events (SSE)

SSE 是一种单向的服务器到客户端的通信方式，轻量级且基于 HTTP 协议。

### 优点:

-	原生支持浏览器端。
-	适合频率不高的实时通知，连接自动重连。

### 实现步骤:

####	1.	服务端

使用 HTTP 响应头 text/event-stream 设置 SSE 流。

```js
const express = require('express');
const app = express();

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write('data: Connected to SSE\n\n');

  // 推送消息
  setInterval(() => {
    res.write(`data: ${JSON.stringify({ message: 'Notification!' })}\n\n`);
  }, 5000);
});

app.listen(3000, () => console.log('SSE server listening on port 3000'));

```

####	2.	客户端
使用 EventSource 接收 SSE。
```js
const eventSource = new EventSource('/events');

eventSource.onmessage = (event) => {
  console.log('Message from server:', event.data);
};
```

## 3. Push Notifications (Web Push)

Web Push 通知通过浏览器向用户推送消息，即使页面不活跃时也可使用。

### 优点:

-	用户离线也可以收到通知。
-	不需要长连接。

### 实现步骤:

1.	配置服务端，生成 VAPID 密钥对并发送消息。
2.	客户端订阅并注册 Service Worker。
3.	使用推送服务将消息发送到客户端。

## 4. HTTP Polling

客户端定期向服务端发送请求以获取最新数据。

### 优点:

-	实现简单，无需长连接。
-	不需要特殊协议支持。

### 缺点:

-	不适合高频推送，存在性能瓶颈。

### 实现:

#### 1.	服务端
提供一个用于返回消息的接口。
```js
app.get('/polling', (req, res) => {
  res.json({ message: 'Latest notification!' });
});
```

####	2.	客户端
通过 setInterval 定期轮询服务器。
```js
setInterval(async () => {
  const response = await fetch('/polling');
  const data = await response.json();
  console.log('Polling message:', data.message);
}, 5000);

```
## 5. Message Queues (可选)

在复杂架构中，可结合消息队列（如 Kafka、RabbitMQ）实现通知推送。

## 方案选择建议

	•	实时性要求高: 使用 WebSocket。
	•	轻量实时推送: 使用 SSE。
	•	离线推送需求: 使用 Web Push。
	•	实现简单: 使用 HTTP Polling。
