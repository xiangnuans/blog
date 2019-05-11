---
title: 如何设置代理IP
date: 2019-05-05 11:23:13
tags: 爬虫
---

# 场景

在爬取网站数据时，防止被封，要用代理IP，比如现在已经有一批IP地址了，请问怎么访问网站时使用这些IP呢？

- https://eggjs.org/zh-cn/core/httpclient.html#%E8%B0%83%E8%AF%95%E8%BE%85%E5%8A%A9

如果需要对HttpClient的请求进行抓包调试，可以添加一下配置到config.local.js:

```
// config.local.js
module.exports = () => {
  const config = {};

  // add http_proxy to httpclient
  if (process.env.http_proxy) {
    config.httpclient = {
      request: {
        enableProxy: true,
        rejectUnauthorized: false,
        proxy: process.env.http_proxy,
      },
    };
  }
  return config;
}
```

然后启动你的抓包工具，如Charles或fiddler

最后通过以下指令启动应用：
```
http_proxy=http://127.0.0.1:8888 npm run dev
```
然后就可以正常操作了，所有经过HttpClient的请求，都可以在你的抓包工具中查看到


- https://github.com/node-modules/urllib seach proxy


资料：
https://www.cnblogs.com/CraryPrimitiveMan/p/3674421.html
