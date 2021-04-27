# 使用node-clinic快速定位性能问题

1. 安装

```
npm install -g clinic
```

2. 启动服务

```
clinc doctor -- node app.js
```

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-19-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-11-19%20%E4%B8%8B%E5%8D%885.30.04.png)

1. 跑一次压测

```
ab -c 10 -n 10000 http://127.0.0.1:7001/DouyinApp
```

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-19-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-11-19%20%E4%B8%8B%E5%8D%885.42.37.png)


