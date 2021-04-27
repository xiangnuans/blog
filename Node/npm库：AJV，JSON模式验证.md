# NPM酷库042：ajv，JSON 模式验证
 schema  npm  node.js  javascript  4.4k 次阅读  ·  读完需要 5 分钟
NPM酷库，每天两分钟，了解一个流行NPM库。·

在NPM酷库041中，我们学习了如何用validator库来验证字符串是否是Email、URL等，在开发中，除了字符串，我们还需要对更复杂的数据进行验证。比如需要Object满足那些属性，每个属性都是什么类型的，这些条件称之为数据模式验证。

在对数据的模式验证领域有专门的标准，叫做 JSON Schema。就是按照JSON Schema标准声明一个模式对象，然后使用模式验证工具去验证目标数据。

# ajv
ajv 是一个非常流行的JSON Schema验证工具，并且拥有非常出众的性能表现。下方的例子中，我们使用ajv来验证用户输入的表单数据是否合法。

```
const Ajv = require('ajv');

let schema = {
  type: 'object',
  required: ['username', 'email', 'password'],
  properties: {
    username: {
      type: 'string',
      minLength: 4
    },
    email: {
      type: 'string',
      format: 'email'
    },
    password: {
      type: 'string',
      minLength: 6
    },
    age: {
      type: 'integer',
      minimum: 0
    },
    sex: {
      enum: ['boy', 'girl', 'secret'],
      default: 'secret'
    },
  }
};

let ajv = new Ajv();
let validate = ajv.compile(schema);

let valid = validate(data);
if (!valid) console.log(validate.errors);
```
在上述代码中，我们声明了一个数据模式`schema` ，这个模式要求目标数据为一个对象，对象可以有五个字段 `username`、`email`、`password`、`age`、`sex`，并分别定义了五个字段的类型和数据格式要求，并且其中 `username、email、password` 必填。然后我们使用这个模式去验证用户输入的数据 `data` 是否满足我们的需求。

注意：

`JSON Schema` 是一个声明模式描述对象的标准，并非一个库
ajv 是一个`JSON Schema`标准验证器的实现，除了ajv还有很多其他的库
代码中的 `schema` 是使用 `JSON Schema `生成的模式描述对象
代码中 `data` 是我们要进行检查的数据

参考资料：
- JSON Schema http://json-schema.org

- AJV https://github.com/epoberezki...
