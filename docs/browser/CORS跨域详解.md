# CORS跨域详解

## 一、为什么会有跨域问题

- 浏览器同源策略
- (跨域是浏览器的限制，抓包工具等可以拿到数据)
- 浏览器一旦发现AJAX请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉

## 二、如何解决跨域

- jsonp
- nginx反向代理
- CORS（跨域资源共享），支持所有类型的http请求，本文主要介绍这种方式

## 三、简单请求和非简单请求

Ajax 按照条件可以分为两种请求方式，简单请求和非简单请求。

同时满足以下两个条件，就属于**简单请求**

1. 使用下列方法之一

- head
- get
- post

2. 请求的header是

- Accept
- Accept-Language
- Content-Language
- Content-Type 只限于三个值
  - application/x-www-form-urlencodes
  - multipart/form-data
  - text/plain

**对于简单请求，浏览器直接发出CORS请求。在头部字段中，增加一个Origin字段。（chrome有时会隐藏这个字段）**

## 四、CORS请求相关的字段，都以Access-Control-开头

- Access-Control-Allow-Origin ：必选
  - （一个或者多个允许跨越的）请求头Origin字段的值
  - *：接受任何域名
- Access-Control-Allow-Credentials： 可选
  - true：表示允许发送cookie，此时 Access-Control-Allow-Origin 不能设置为*，必须指定明确的，与请求网页一致的域名；
  - 不设置该字段，不需要浏览器发送cookie

- Access-Control-Expose-Headers：可选
  - 列出了哪些首部可以作为响应的一部分暴露给外部
  - 默认，只有六种暴露给外部    
    - Cache-Control
    - Content-Language
    - Content-Type
    - Expires
    - Last-Modified
    - Pragma
  - 如果想让客户端可以访问到其他的首部信息，可以将他们在Access-Control-Expose-Headers里面列出来

## 五、withCredentials 属性

CORS默认不发送Cookie和HTTP认证信息，如果要把Cookie 发送到服务器，一方面需要服务器同意，设置响应头 Access-Control-Allow-Credentials：true；另一方面，客户端发送请求时，也要进行一些设置，例如 xhr.withCredentials = true;

## 六、非简单请求
非简单请求就是那种对服务器有特殊要求的请求，比如请求方法为PUT 或者 DELETE，或者 Content-Type 为 application/json；

### 预检请求和回应

非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，成为“预检”。浏览器会询问服务器，当前网页所在的域名是否在是否在许可名单之内，以及可以使用哪些 HTTP 动词和头部信息段，只有得到肯定答复，才会发出正式的接口请求。否则，报错。

1、预检请求

- 用OPTIONS方法，询问。预检请求包括三个字段
  - Origin：表示请求来自哪个域；
  - Access-Control-Request-Method：必须，浏览器会使用的请求方法；
  - Access-Control-Request-Headers: 浏览器发送 CORS 请求会额外发送的头部信息段；

2、预检回应

- 服务器收到预检请求后，检查了Origin，Access-Control-Request-Method，Access-Control-Request-Headers字段后，确认允许跨域，就可以做出回应
- 如果浏览器否认了“预检”请求，会返回一个正常的HTTP回应，但是没有任何CORS相关的头部信息字段，浏览器会认为不同意，触发一个错误
- 服务器回应的其他CORS字段
  - Access-Control-Allow-Methods:  必需，逗号分隔的字符串，表示服务器支持的所有跨域请求方法；
  - Access-Control-Allow-Headers：浏览器支持的所有头部字段；Access-Control-Allow-Credentials：Cookie
  - Access-Control-Allow-Max-Age:  指定本次请求的有效期；

## 七、服务端如何设置CORS

- 如果设置请求头Content-Type：application/x-www-form-urlencoded，则为简单请求
  - 直接设置响应头 Access-Control-Allow-Origin 为 *，或者具体的域名；
  - 如果响应头Access-Control-Allow-Credentials 为 true，则此时Access-Control-Allow-Origin 不能设置为*，必须指定明确的域名；
- 如果设置请求头 Content-Type：application/json，则为非简单请求
  - 处理 OPTIONS 请求，服务端可以单独写一个路由
  - 可以把这部分抽离处理，作为一个中间件，例如Koa；

