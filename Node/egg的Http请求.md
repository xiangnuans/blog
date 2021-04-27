[官网](https://github.com/eggjs/egg/blob/17fab1c1d645076bda76be351fcb3c6f86cea4ca/docs/source/zh-cn/core/httpclient.md)

[HTTP状态码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)

# data: Object
需要发送的请求数据，根据 method 自动选择正确的数据处理方式。

GET，HEAD：通过 `querystring.stringify(data)` 处理后拼接到 `url` 的 `query` 参数上。
`POST，PUT 和 DELETE` 等：需要根据 `contentType` 做进一步判断处理。
contentType = json：通过 `JSON.stringify(data)` 处理，并设置为 `body` 发送。
其他：通过 `querystring.stringify(data)` 处理，并设置为 `body` 发送。
```js
// GET + data
ctx.curl(url, {
  data: { foo: 'bar' },
});

// POST + data
ctx.curl(url, {
  method: 'POST',
  data: { foo: 'bar' },
});

// POST + JSON + data
ctx.curl(url, {
  method: 'POST',
  contentType: 'json',
  data: { foo: 'bar' },
});
```

# dataAsQueryString: Boolean
如果设置了 `dataAsQueryString=true，`那么即使在 POST 情况下， 也会强制将 `options.data` 以 `querystring.stringify `处理之后拼接到 url 的 `query` 参数上。
**可以很好地解决以 stream 发送数据，且额外的请求参数以 url query 形式传递的应用场景：**

```js
ctx.curl(url, {
  method: 'POST',
  dataAsQueryString: true,
  data: {
    // 一般来说都是 access token 之类的权限验证参数
    accessToken: 'some access token value',
  },
  stream: myFileStream,
});
```
