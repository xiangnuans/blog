# egg常见问题笔记


## egg日志的时区问题
问题：服务器中打印date时间是正常的，但是日志里的时间少了8小时
方法：（待亲自验证）试下加 TZ 这个环境变量来启动看看。或者自定义 formatter，看下 egg-logger 源码


## node后台快速开发框架（TypeScript）

基于egg.js后台快速开发框架，极速编码

码云：https://gitee.com/tjp0515/cool-admin-api
github：https://github.com/apgzs/cool-admin-api
bilibili：https://www.bilibili.com/video/av69398358

## 定时任务多次执行

app.js 里做了一些初始化的定时任务的逻辑，没有使用官方的schedule，用的是node-cron，每次重启的时候，为啥会执行好几次呀？这个要怎么解决呢？

方案一：放到agent里执行
方案二：放到schedule里，设置worker执行一次
方案三：在应用启动前调用脚本执行


## ctx.ip总是拿到127.0.0.1应该怎么处理

nginx配置

```js
location / {
  proxy_set_header Host $host;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_pass http://127.0.0.1:7071;
}
```

缺少exports.proxy = true;
