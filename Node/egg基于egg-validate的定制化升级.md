[转载](http://www.fly63.com/article/detial/4021)
# egg基于egg-validate的定制化升级

## 简单讲一下这个egg-validate

egg-validate是基于parameter的。安装:

```
npm install --save egg-validate
```

启用

```js
// config/plugin.js
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
```

配置

```js
// config/config.default.js
exports.validate = {
  // convert: false,
  // validateRoot: false,
};
```
用途嘛，就是对参数进行检验。比如检验一个用户名是不是字符串，可以这么写，

```js
ctx.validate({ userName: ‘string‘ });
```

注意：默认就会`ctx.request.body`进行校验，你想校验`ctx.query`的话，那就`ctx.validate({ userName: 'string}, ctx.query)`, params就ctx.params。它会在校验失败时抛出一个异常，没有捕获的话，会返回一个422错误。

```js
let errs = app.validator.validate({ userName: ‘string‘ }, ctx.request.body);
```

`ctx.validate`校验不通过会抛出异常，而`app.validator.validate`校验不通过回返回错误。你可以自己选择要对这个错误怎么处理，是不管呢还是返回给前端。

## 关于校验规则rule

完全和`parameter`的校验规则一样，建议看readme文档。
`ctx.validate({ userName: 'string' });`这里面的rule就是`{ userName: 'string' }`,它回这么校验，首先判断这个`userName`有没有在`ctx.request.body`，没有就抛出参数不存在，然后就是`userName`不能为空、然后得是`string`。有一个不符合都会抛出错误。

你想判断一个用户的信息是否正确可以这么写：

```js
ctx.validate({
      userName: 'userName', // 自定义的校验规则
      password: 'password', // 自带的校验规则
      sex: ['men', 'women'],    // 性别是men或者women
      age: {
        type: 'number',         // 年龄范围0-120
        min: 0,
        max: 120
      }
    });
```

注意：这里有个坑，年龄怎么 填都会报格式错误，这是因为 配置的时候默认把参数类型转型关了，配置回来就好：

```js
config.validate = {   // 配置参数校验器，基于parameter
    convert: true,    // 对参数可以使用convertType规则进行类型转换
    // validateRoot: false,   // 限制被验证值必须是一个对象。
  };
```

## 主要使用的几个点，核心使用

1. 使用自带的校验规则：

password：‘password’，或者

```js
password: {
  type: 'password',
  allowEmpty: true,
}
```

校验规则有这些，文档很详细了：

![20190704135119472.png](https://upload-images.jianshu.io/upload_images/9403248-ccaa3d6613a11c53.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 自定义的校验规则

通过app.validator.addRule添加：

```js
  // 校验用户名是否正确
  app.validator.addRule('userName', (rule, value)=>{        // value就是待检验的数据
    if (/^\d+$/.test(value)) {
      return "用户名应该是字符串";
    }
    else if (value.length < 3 || value.length > 10) {
      console.log("用户名的长度应该在3-10之间");
    }
  });
```

这个可以直接放在app.js里面。return的就是错误消息message，但是err不止这个，还有错误字段啊啥的、都会帮我们自动包装好。

3. app.validator.addRule(‘userName‘, (rule, value)=>{里面这个字符串‘userName‘
添加了这个规则就可以直接使用ctx.validate({userName: ‘userName‘});。
或者

```js
ctx.validate({userName:  {
    type: 'userName',
    isAdmin: true'
});
```
4. app.validator.addRule(‘userName‘, (rule, value)=>{里面这个rule

像3、那样的规则就是把
```js
{
    type: 'userName',
    isAdmin: true'
}
```

直接赋值给rule传过来

```js
{ type: ‘userName‘, isAdmin: true }
```

然后你可以自己加判断，比如如果 `isAdmin`的话，管理员用户名不能有中文啊，长度至少5位啊啥的。


5. 在哪里addRule
上面写的是推荐大家在`app.js`里面`addRule`。为什么呢？
当然你可以在任何你能取到app的地方调用`app.validator.addRule(‘userName‘, (rule, value)=>{去addRule。`

但是不建议在`controller`里面`addRule`。因为`controller`在每次路由匹配到之后都会进行实例化，所以请求了n遍，也就执行了这个`addRule n`遍。

而且代码会变的很臃肿。不易于管理。

在`app.js addRule`当然是很棒的，只在`app`加载时`add`一次。

但是问题又来了，随着`rule`变多，你在`app.js`里面写了很多代码都是关于`addRule`的，但是`app.js`又不止要写`addRule`、还写了一些别的，那看起来多乱啊。也不利于管理。

如果将来新的项目要用到相同的校验规则难道还有从`app.js`里面手动拷贝吗。

所以下面接着讲`eggjs`基于`egg-validate`的定制化升级


## `eggjs`基于`egg-validate`的定制化升级

**我们希望能达到怎么样的一个效果呢？**

- `app.js`里面少写一些代码，最好就写一两行，做个配置这样子
- 对于所有的自定义校验规则独立出文件夹，可以取名`validate`，就丢在`app/`下面
- 针对相似的校验规则进一步抽象成文件，就叫做`user.js`这样，丢在`app/validate/`下面
- 针对某一条特定的校验规则，如校验用户的`userName`就丢在`app/validate/user.js`里面
- 然后保持`egg-validate`的使用规则不变，原来是`ctx.validate`现在还是`ctx.vallidate`。同时其他的插件、配置不受影响。这叫做代码侵入性小。


### 首先把`app.js`里面导入模块写出来

我们使用`Loader`来加载`validate`下面的所有文件:

```js
const path = require('path');

module.exports = app => {

  // 你的其它代码，balabala

  // 加载所有的校验规则
  const directory = path.join(app.config.baseDir, 'app/validate');
  app.loader.loadToApp(directory, 'validate');
}
```

### 然后建立实际的校验规则文件

建立app/validate/user.js文件

```js
module.exports = app =>{

  let { validator } = app;

  // 校验用户名是否正确
  validator.addRule('userName', (rule, value)=>{
    console.log(rule);
    if (/^\d+$/.test(value)) {
      return "用户名应该是字符串";
    }
    else if (value.length < 3 || value.length > 10) {
      console.log("用户名的长度应该在3-10之间");
    }
  });

  // 添加自定义参数校验规则
  validator.addRule('123', (rule, value) => {
    if (value !== '123'){
      return 'must be 123';
    }
  });
};
```

这样定制化升级就完成了。之后需要再新建检验规则就写在validate里面，某一类相似校验规则要复用就直接拷贝文件就好了。
