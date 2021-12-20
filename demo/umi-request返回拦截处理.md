# 场景：
在使用ant-design-pro框架开发前端服务的的时候，官方推荐使用umi-request作请求库，在对request封装文件中，想对后台接口的相应进行一些统一的处理，设置响应拦截器的时候，发现拿不到后台返回的数据

# 解决方法

拦截器中用response.clone处理完成后把response返回

官网：[umi-request](https://github.com/umijs/umi-request)

![](../public/images/umi-request.jpg)