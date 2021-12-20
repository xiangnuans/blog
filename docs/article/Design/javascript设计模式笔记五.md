# JavaScript设计模式-策略模式

策略模式允许在运行的时候选择算法。你的代码的使用者可以在处理特定任务的时候根据即将要做的事情的上下文来从一些可用的算法中选择一个。


使用策略模式的一个例子是解决表单验证的问题。你可以创建 一个validator对象，又一个validate()方法。这个方法被调用时不用区分具体的表单类型，它总是会返回同样的结果--一个

但是根据具体的徐阿哟验证的表单和数据，你代码的使用者可以选择进行不同类别的检查。你的validator选择 最佳的策略来出来这个任务，然后将具体的数据检查工作交给合适的算法去做。

## 数据验证示例

假设你有一个下面这样的数据，它可能来自页面上的一个表单，你希望验证它是不是有效的数据：

```js
const data = {
  first_name: "Super",
  last_name: "Man",
  age: "unknown",
  username: "o_O"
};

```

对这个例子中的validator，它需要知道哪个是最佳策略，因此你需要先配置它，给它设定好规则以确定哪些是有效的数据/


假设你不需要姓，名字可以接收任何内容，但要求年龄是一个数字，并且用户名只允许包含字母和数字，配置可能是这样的：

```js
validator.config = {
  first_name: 'isNonEmpty',
  age: 'isNumber',
  userName: 'isAlphaNum'
}
```

现在validator对象已经有了用来处理数据的配置，你可以调用validate（）方法，然后将任何验证错误打印到控制台上。

```js
validator.validate(data);
if (validator.hasError()) {
  console.log(validator.messages.join("\n"));
}
```
它可能会打印出这样的信息：

```
Invalid value for *age*, the value can only be a valid number, e.g. 1, 3.14 or 2010
Invalid value for *username*, the value can only contain characters and numbers, no special symbols
```

现在我们来看一下这个validator是如何实现的。所有可用的用来检查的逻辑都是拥有一个validate（）方法的对象，他们还有一行辅助信息用来显示错误信息：

```js
// checks for non-empty values
validator.types.isNonEmpty = {
  validate: function(value) {
    return value !== "";
  },
  instructions: "the value cannot be empty"
};

// checks if a value is a number
validator.types.isNumber = {
  validate: function (value) {
    return !isNaN(value);
},
instructions: "the value can only be a valid number, e.g. 1, 3.14 or 2010"
};
// checks if the value contains only letters and numbers
validator.types.isAlphaNum = {
  validate: function (value) {
    return !/[^a-z0-9]/i.test(value);
  },
  instructions: "the value can only contain characters and numbers, no special symbols"
}

```

最后，validator对象的核心是这样的：

```js
const validator = {
  // all avaliable checks
  types: {},

  // error messages in the current
  // validation session
  messages: [],
  config: {},

  // the interface method
  // `data` is key => value pairs
  validate: function(data) {
    let i, msg, type, checker, result_ok;

    // reset all messages
    this.messages = [];
    for (i in data) {
      if (data.hasOwnProperty(i)) {
        type = this.config[i];
        checker = this.types[type];
        if (!type) {
          continue; // no need to validate
        }

        if (!checker) {
          throw {
            name: "ValidationError",
            message: "No handler to validate type" + type,
          };
        }
        result_ok = checker.validate(data[i]);
        if (!result_ok) {
          msg = "Invalid value for * " + i + "*, " + checker.instructions;
          this.messages.push(msg);
        }
      }
    }
    return this.hasErrors();
  },
  // helper
  hasErrors: function() {
    return this.messages.length ! == 0;
  }
};
```

如你所见，validator对象是通用的，在所有的需要验证的场景下都可以保持这个样子。改进它的办法就是增加更多类型的检查。如果你讲它用在很多页面上，每块你就会有一个非常好的验证类型的集合。然后在每个新的使用场景下你需要做的仅仅是配置validator然后调用validate（）方法。


