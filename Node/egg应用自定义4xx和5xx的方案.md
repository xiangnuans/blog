[转载](https://github.com/eggjs/egg/issues/1086)

现在的错误处理插件是[egg-onerror](https://github.com/eggjs/egg-onerror)，但这个插件主要是优雅处理为捕获异常，也就是为了让应用不挂进行兜底，但是现在没有一种同意的业务员错误处理方案。

# 问题

## 业务校验

比如参数校验、业务演这个等等，这些并不术语异常，一般会在响应时专程对应的数据格式。常见的处理方式是接口返回错误，并在response转换

```
class User extends Controller {
  async show() {
    const error = this.check(this.params.id);
    if (error) {
      this.ctx.status = 422;
      this.ctx.body {
        message: error.message,
      };
      return;
    }

    // 继续处理
  }

  check(id) {
    if (!id) return { message: 'id is required' };
  }
}
```

但是业务场景是非常复杂的，可能在controller里面调用多层service，这样就必须把错误结果一层层传递。所以这种场景业务校验推荐使用异常的方式，类似上面的场景只需要抛出一个异常
```
class User extends Controller {
  async show() {
    this.check(this.params.id);

    // 继续处理
  }

  check(id) {
    if (!id) throw new Error('id is required');
  }
}
```

然后再中间件处理这个异常

# 异常类型区分

上面的示例也同样抛出Error，如果不写中间件处理同样回走到[oneror](https://github.com/eggjs/egg-onerror)插件，根据惠泽会打印错误日志并返回500.

这不是我们期望的，开发者希望但会正确的格式，比如status是422，body是一个含错误信息的json。所以我们需要明确已知异常和为捕获异常，并对他们做差异处理

# 标准化响应

如果在写一个api server的时候，希望响应格式是规范的，而开发者一般都比较关注正常结果，异常时会返回格式，所以对于一个API Server来说这也是非常重要的。

# 内容协商

有些应用会根据content-type来返回对应数据，这种情况错误处理也需要根据这种场景来返回相应的结果

# Spec

## 错误定义
### 种类

错误分为三种未捕获异常、系统异常、业务异常，以下是分类比较

| 定义 | 未捕获异常 | 系统异常 | 业务错误 |
|---|---|---|---|
| 类名 | Error | xxxException | xxxBizError |
| 说明 | js内置错误，未做任何处理 | 自己抛出的系统异常 | 自己跑出的业务异常 |
| 错误处理方式 | 由onerror插件处理 | 业务可扩展处理 | 业务处理 |
| 可识别 | 否 | 是 | 是 |
| 属性扩展 | 否 | 是 | 是 |


类名只是用来区分三种错误，继承可以自定义

所有的类均继承自Error类，并定义BaseError类，集成子BaseError的错误是可以被识别的，而其他三方继承Error的类都发被识别。

```
class BaseError extends Error {}

class HttpClientError extends BaseError {}
class HttpServerError extends BaseError {}

BaseError.check(BaseError); // true
BaseError.check(Error); // false
```
如果业务跑出自定义的系统异常和业务错误，可直接在错误里面处理，为捕获异常在onerror中处理

即成的错误可增加额外的属性，比如HttpError可增加额外属性，比如HttpError可增加status属性作为处理函数的输入


### 字段
标准字段包括

- name：一般为类名，如NotFoundError
- message: 错误的具体信息，可读的，如404 Not Found
- code：答谢的字符串，描述错误，如NOT_FOUND
http扩展

- status: http状态码，400

## 错误抛出
自行在代码里面引入对应的类
```
import { http } from 'egg-errors';

class User extends Controller {
  async show() {
    this.check(this.params.id);

    // 继续处理
  }

  check(id) {
    if (!id) throw new http.UnprocessableEntityError('id is required');
  }
}
```

自定义类

```
import { BaseError } from 'egg-errors';

class CustomError extends BaseError {
  constructor(message) {
    super(message);
    this.code = 'CUSTOM_ERROR';
  }
}

throw new CustomError('xxx');
```

## 错误处理

错误处理是最核心的功能，有如下规则：

1. 未捕获异常不错处理，向上抛
2. 系统异常会打印错误日志，但是会按照标准格式format
3. 业务异常根据标准格式format
4. 根据内容协商，返回对应的format值
5. 可自定义format

标准format

```
{
  "code": "",
  "message": ""
}
```



