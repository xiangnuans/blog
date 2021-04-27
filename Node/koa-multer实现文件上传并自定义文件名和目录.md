# koa-multer实现文件上传并自定义文件名和目录

之前使用express的时候，使用multer进行文件上传，而`koa-multer`是`koa-modules`提供的文件上传中间件

使用multer最显著的特点就是要通过multer生成upload中间件。

1. upload.js

借助multer.diskStorage({})方法，实现自定义上传目录和文件名


文件路径`./utils.upload.js`

```js
const multer = require('koa-multer')
const path = require('path');

const storage = multer.diskStorage({
  desctination: 'public/uploads/' + new Date().getFullYear() +  (new Date().getMonth()+1) + new Date().getDate(),
  filename(ctx, file, cb) {
    const filenameArr = file.origininalname.split('.');
    cb(null, Date.now() + '.' + filenameArr[filenameArr.length-1])
  }
})

const upload = multer({storage});
module.exports = upload;
```

2. 在路由中使用upload

导出upload之后，就可以在路由中使用`upload`:

```js
router.gete('upload', async(ctx) => {
  await ctx.render('upload')
})


router.post('upload', upload.single('file'), async(ctx) => {
  console.log(ctx.req.file);
  ctx.body = ctx.request.body;
})
```

同样的，upload之后的文件信息，仍就存储在`ctx.req.file`中，用来提供相关的信息。

`filename` 是存储的文件名称，而可以通过 `destination` 切割出文件的上传文件夹 `201864，path` 没什么大的用处，因为 `linux` 上和 `windows` 是不同的，直接使用 `path` 不利于跨平台移植项目。

```
filename 是存储的文件名称，而可以通过 destination 切割出文件的上传文件夹 201864，path 没什么大的用处，因为 linux 上和 windows 是不同的，直接使用 path 不利于跨平台移植项目。
```
# 问题

`koa-multer`和`koa-route`并不能完美的结合，因此不建议使用`koa-route`，而是建议使用`koa-router`（两者是不同的）


