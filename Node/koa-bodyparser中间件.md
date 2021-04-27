# koa-bodyparser中间件

使用koa-body代替koa-bodyparser和koa-multer

之前使用koa2的时候，处理post请求使用的是`koa-bodyparser`，同时如果是图片上传使用的是`koa-multer`

这两者的组合没什么问题，不过`koa-multer`和`koa-route`（注意不是koa-router）存在不兼容的问题。

## koa-bodyparser

koa处理`post`请求的时候，需要对body传递过来的数据进行处理。
实际上如果要手动实现一个能够处理 `application/x-www-from-urlencoded` 的中间件，还是借助的原生 node.js 的方法进行处理。

koa封装了原生了node.js的request对象的`ctx.req`中。

而借助原生node.js的request对象，监听`data`事件及`end`事件，进行处理。


**实现中间件**

1. 实现listen监听body数据传输

当body数据传输结束后，将拼接的字符串进行解析，解析之后，将`Promise.resolve`即可

```js
function listen(ctx){
  let str = '';
  return new Promise((resolve,reject) => {
    ctx.req.addListener('data',(data)=>{
      str += data;
    });
    ctx.req.addListener('end',()=>{
      const res = jsonBodyparser(str);
      resolve(res);
    });
  });
}
```

2. 将字符串解析成对象

处理拼接的字符串很简单，我用了最简单的方式，就是拆分遍历字符串

```js
function jsonBodyparser(str){
  let parseBody = {};
  let strArr = str.split('&');
  for(let [index,item] of strArr.entries()){
    const itemArr = item.split("=");
    parseBody[itemArr[0]] = itemArr[1];
  }
  return parseBody;
}
```

3. exports中间件

参照了`koa-bodypaser`中间件实现方式，将结果封装进了`ctx.request.body`中

```js
module.exports = () => {
  return async (ctx, next) => {
    bodyPaser = await listen(ctx);;
    ctx.request.body = bodyPaser;
    await next();
  }
}
```

4. 使用中间件

```js
const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const postBodyParser= require('../middlewares/postBodyParser');
const router = new Router();

router.use(postBodyParser());

router.get('/',async (ctx)=>{
  const htm = fs.readFileSync(path.resolve('./views/login.html')).toString();
  ctx.body = htm;
}).post('/',async (ctx)=>{
  ctx.body = ctx.request.body;
});

module.exports = router;

```

**使用`koa-bodypaser`**

如果使用`koa-bodypaser`，则非常方便而且考虑的方面非常多

```js
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = require('./routes/index');


const app = new Koa();

app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

app.listen(5000,()=>{
  console.log('start : 5000');
});
```

## `koa-body`
`koa-body`主要是下面两个依赖：

```js
"co-body": "^5.1.1",
"formidable": "^1.1.1"
```

在koa2中使用`koa-body`，我使用的全局引入，而不是路由级别的引入，因为考虑到很多地方都有post请求或者，没必要只在路由级别引入。

1. 安装依赖

```js
yarn add koa-body
npm i koa-body -S
```

2. app.js

省略了 koa的一些基本的代码

```js
const koaBody = require('koa-body')
const app = new Koa();
app.use(koaBody({
  multipart: true, //支持文件上传
  encoding: 'gzip',
  formidable: {
    uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
    keepExtension: true, //保存文件的后缀
    maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小限制
    onFileBegin: (name, file) => {  // 文件上传前的设置
      // console.log(`name: ${name}`);
      // console.log(file);
    }
  }
}));
```

3. 有用的参数

1）`koa-body`的基本参数

|    参数名    |   描述   |  类型 | 默认值 |
| ----------- |---------|-------|-------|
| patchNode | 将请求体打到原生node的`ctx.req`中 | Boolean | `false` |
| patchKoa  | 将请求体打到原生koa的`ctx.req`中  | Boolean | `false` |
| jsonLimit | JSON数据体的大小限制 | String/Integer | `1mb` |
| formLimit | 限制表单请求大小限制 | String/Integer | `56kb` |
| textLimit | 限制 text body 的大小 | String/Integer | `56kb` |
| encoding | 表单的默认编码 | String | utf-8 |
| multipart | 是否支持`multipart-formdate`的表单 | Boolean | false |
| urlencoded | 是否支持 `urlencoded` | Boolean | true |
| text | 是否解析`text/plain`的表单 | Boolean | true |
| json | 是否解析`json` | Boolean | true |
| jsonStrict | 是否使用json严格模式，true会只处理数组和对象 | Boolean | true |
| formidable | 配置更多的关于multipart的选项 | Object | {} |
| onError | 错误处理 | Function | function() {} |
| stict | 严格模式 | 启用后不会解析GET、HEAD、DELETE请求 | Boolean | true |

2） formidable的相关配置参数


|    参数名    |   描述   |  类型 | 默认值 |
| ----------- |---------|-------|-------|
| maxFields | 限制字段的数量 | Integer | 1000 |
| maxFieldsSize | 限制字段的最大大小 | Integer | 2 * 1024 * 1024 |
| uploadDir | 文件上传的文件夹 | String | os.tmpDir() |
| keepExtensions | 保留原来的文件后缀 | Boolean | false |
| hash | 如果要计算文件的 hash，则可以选择 md5/sha1 | String | false |
| multipart | 是否支持多文件上传 | Boolean | true |
| onFileBegin | 文件上传前的一些设置操作 | Function | function(name,file){} |

4. 获取文件上传后的信息

这些代码是在路由中体现的

需要注意的是，如果是获取上传后文件的信息，则需要在` ctx.request.files` 中获取。

如果是获取其他的表单字段，则需要在 `ctx.request.body` 中获取，这是由 `co-body` 决定的（默认情况）。

```js
router.get('/', async (ctx) => {
  await ctx.render('index');
});

router.post('/',async (ctx)=>{
  console.log(ctx.request.files);
  console.log(ctx.request.body);
  ctx.body = JSON.stringify(ctx.request.files);
});
```

因为默认开启多个文件上传，因此`ctx.request.files`是一个对象，而且是通过表单的`name=photo`属性作为对象的key,值便是一个File对象，有用的字段如下：

|   参数名  |   描述   |
| ---------|---------|
| size | 文件大小 |
| path | 文件上传后的目录 |
| name | 文件的原始名称 |
| type | 文件类型 |
| lastModifiedDate | 上次更新的时间 |



