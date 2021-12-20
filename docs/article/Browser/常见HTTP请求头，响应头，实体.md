# 常见HTTP请求头，响应头，实体

## 一、常用的http请求头

### 1.Accept
- **Accept: text/html** 浏览器可以接受服务器回调的类型为text/html。
- **Accept: */***代表浏览器可以处理所有类型，（一般浏览器发送给服务器都是发这个）

### 2. Accept-Encoding

- **Accept-Encoding：gzip，deflate**浏览器申明自己接受的编码方法，通常指定压缩方法，是否支持压缩，支持什么压缩方法（gzip，deflate）

### 3. Accept-Language
- **Accept-Language: zh-CN,zh;q=0.9** 浏览器申明自己接收的语言

### 4. Connection
- **Connection: keep-alive**当一个网页打开完成后，客户端和服务器之间用于传输HTTP数据的TCP连接不会关闭，如果客户端再次访问这个服务器上的网页，会继续使用这一条已经建立的连接。

 代表一个Request完成后，客户端和服务器之间用于传输HTTP数据的TCP连接会关闭， 当客户端再次发送Request，需要重新建立TCP连接。

### 5. Host（发送请求时，该报头域是必需的）

- **Host:www.baidu.com**请求报头域主要用于指定被请求资源的Internet主机和端口号，它通常从HTTP URL中提取出来的。

### 6.Referer

- **Referer:https://www.baidu.com/?tn=62095104_8_oem_dg** 当浏览器向web服务器发送请求的时候，一般会带上Referer，告诉服务器我是从哪个页面链接过来的，服务器籍此可以获得一些信息用于处理。

### 7. User-Agent

- **User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36** 告诉HTTP服务器， 客户端使用的操作系统和浏览器的名称和版本。

### 8.Cache-Control
- **Cache-Control:private** 默认为private  响应只能够作为私有的缓存，不能再用户间共享
- **Cache-Control:public** 响应会被缓存，并且在多用户间共享。正常情况, 如果要求HTTP认证,响应会自动设置为 private.
- **Cache-Control:must-revalidate** 响应在特定条件下会被重用，以满足接下来的请求，但是它必须到服务器端去验证它是不是仍然是最新的。
- **Cache-Control:no-cache**  响应不会被缓存,而是实时向服务器端请求资源。
- **Cache-Control:max-age=10** 设置缓存最大的有效时间，但是这个参数定义的是时间大小（比如：60）而不是确定的时间点。单位是[秒 seconds]。
- **Cache-Control:no-store** 在任何条件下，响应都不会被缓存，并且不会被写入到客户端的磁盘里，这也是基于安全考虑的某些敏感的响应才会使用这个。


### 9.Cookie

Cookie是用来存储一些用户信息以便让服务器辨别用户身份的（大多数需要登录的网站上面会比较常见），比如cookie会存储一些用户的用户名和密码，当用户登录后就会在客户端产生一个cookie来存储相关信息，这样浏览器通过读取cookie的信息去服务器上验证并通过后会判定你是合法用户，从而允许查看相应网页。当然cookie里面的数据不仅仅是上述范围，还有很多信息可以存储是cookie里面，比如sessionid等。

### 10. Range(用于断点续传)

- **Range:bytes=0-5** 指定第一个字节的位置和最后一个字节的位置。用于告诉服务器自己想取对象的哪部分。

## 二、常用的http响应头

### 1. Cache-Control（对应请求中的Cache-Control）

- **Cache-Control:private** 默认为private 响应只能够作为私有的缓存，不能再用户间共享
- **Cache-Control:public** 浏览器和缓存服务器都可以缓存页面信息。
- **Cache-Control:must-revalidate** 对于客户机的每次请求，代理服务器必须向服务器验证缓存是否过时。
- **Cache-Control:no-cache**浏览器和缓存服务器都不应该缓存页面信息。
- **Cache-Control:max-age=10**  是通知浏览器10秒之内不要烦我，自己从缓冲区中刷新。
- **Cache-Control:no-store** 请求和响应的信息都不应该被存储在对方的磁盘系统中


### 2. Content-Type
- **Content-Type：text/html;charset=UTF-8** 告诉客户端，资源文件的类型，还有字符编码，客户端通过utf-8对资源进行解码，然后对资源进行html解析。通常我们会看到有些网站是乱码的，往往就是服务器端没有返回正确的编码。

### 3. Content-Encoding

- **Content-Encoding:gzip** 告诉客户端，服务端发送的资源是采用gzip编码的，客户端看到这个信息后，应该采用gzip对资源进行解码。

### 4. Date

- **Date: Tue, 03 Apr 2018 03:52:28 GMT** 这个是服务端发送资源时的服务器时间，GMT是格林尼治所在地的标准时间。http协议中发送的时间都是GMT的，这主要是解决在互联网上，不同时区在相互请求资源的时候，时间混乱问题。

### Server

- **Server：Tengine/1.4.6**  这个是服务器和相对应的版本，只是告诉客户端服务器信息。

### 7. Expires

- **Expires:Sun, 1 Jan 2000 01:00:00 GMT** 这个响应头也是跟缓存有关的，告诉客户端在这个时间前，可以直接访问缓存副本，很显然这个值会存在问题，因为客户端和服务器的时间不一定会都是相同的，如果时间不同就会导致问题。所以这个响应头是没有Cache-Control：max-age=*这个响应头准确的，因为max-age=date中的date是个相对时间，不仅更好理解，也更准确。

### 8. Last-Modified

- **Last-Modified: Dec, 26 Dec 2015 17:30:00 GMT** 所请求的对象的最后修改日期(按照 RFC 7231 中定义的“超文本传输协议日期”格式来表示)

### 9. Connection

- **Connection：keep-alive** 这个字段作为回应客户端的Connection：keep-alive，告诉客户端服务器的tcp连接也是一个长连接，客户端可以继续使用这个tcp连接发送http请求。

### 10. Etag

**ETag: "737060cd8c284d8af7ad3082f209582d"** 就是一个对象（比如URL）的标志值，就一个对象而言，比如一个html文件，如果被修改了，其Etag也会被修改，所以，ETag的作用跟Last-Modified的作用差不多，主要供WEB服务器判断一个对象是否改变了。比如前一次请求某个html文件时，获得了其 ETag，当这次又请求这个文件时，浏览器就会把先前获得ETag值发送给WEB服务器，然后WEB服务器会把这个ETag跟该文件的当前ETag进行对比，然后就知道这个文件有没有改变了。

### 11. Refresh

- **Refresh: 5; url=http://baidu.com**  用于重定向，或者当一个新的资源被创建时。默认会在5秒后刷新重定向。


### 12. Access-Control-Allow-origin

- **Access-Control-Allow-Origin:** * *号代表所有网站可以跨域资源共享，如果当前字段为*那么Access-Control-Allow-Credentials就不能为true
- **Access-Control-Allow-Origin: www.baidu.com** 指定哪些网站可以跨域资源共享

### 13. Access-Control-Allow-Methods

- Access-Control-Allow-Methods：GET,POST,PUT,DELETE  允许哪些方法来访问

### 14. Access-Control-Allow-Credentials

- **Access-Control-Allow-Credentials: true** 是否允许发送cookie。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可。如果access-control-allow-origin为*，当前字段就不能为true

### 15. Content-Range

- **Content-Range： bytes 0-5/7877**指定整个实体中的一部分的插入位置，他也指示了整个实体的长度。在服务器向客户返回一个部分响应，它必须描述响应覆盖的范围和整个实体长度。
