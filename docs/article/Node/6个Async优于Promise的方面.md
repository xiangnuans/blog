# 6个Async、Await优于Promise的方面

## async/await快速入门

- async/await是一种编写异步代码的新方法，在着之前便携异步代码使用的是回调函数和promise
- async/await实际是建立在promise之上的。因此你不能把它和回调函数搭配使用
- async/await和promise一样，是非阻塞的
- async/await可以使异步代码在形式上更接近于同步代码

## 语法

假设有一个getJSON方法，它返回一个promise，该promise会被resolve为一个JSON对象。我们想要调用该方法，输出得到JSON对象，最后返回“done”

以下是使用promise的实现方式：

```js
const makeRequest = () => {
  getJSON()
    .then(data => {
      console.log(data)
      return 'done'
    })
}
makeRequest()
```

使用async/await则是这样

```js
const makeRequest = async() => {
  console.log(await getJSON())
  return "done"
}
makeRequest()
```

使用async/await时有以下几个区别：

1. 在定义函数时我们使用了async关键字。await关键字只能在使用async定义的函数的内部使用。所有async函数都会返回一个promise，该promise最终resolve的值就是你在函数中return的内容
2. 由于第一点中的原因，你不能在顶级作用域中await一个函数。因为顶级作用域不是一个async方法。
3. await getJSON()意味着直到getJSON()返回的promise在resolve之后，console.log才会执行并输出resolove的值。

## 为何使用async/await编写出来的代码更好呢？

### 1.简洁

看看我们节省了多少代码吧。即使是在这么一个简单的例子中，我们也节省了可观的代码。我们不需要为.then编写一个匿名函数来处理返回结果，也不需要创建一个data变量来保存我们实际用不到的值。我们还避免了代码嵌套。这些小优点会在真实项目中变得更加明显。

### 2. 错误处理

async/await终于使得用同一种构造(古老而好用的try/catch) 处理同步和异步错误成为可能。在下面这段使用promise的代码中，try/catch不能捕获JSON.parse抛出的异常，因为该操作是在promise中进行的。要处理JSON.parse抛出的异常，你需要在promise上调用.catch并重复一遍异常处理的逻辑。通常在生产环境中异常处理逻辑都远比console.log要复杂，因此这会导致大量的冗余代码

```js
const makeRequest = () => {
  try {
    getJSON()
      .then(result => {
        // this parse may fail
        const data = JSON.parse(result)
        console.log(data)
      })
      // uncomment this block to handle asynchronous errors
      // .catch((err) => {
      //   console.log(err)
      // })
  } catch (err) {
    console.log(err)
  }
}
```
现在看看使用了async/await的情况，catch代码块现在可以捕获JSON.parse抛出的异常了：

```js
const makeRequest = async () => {
  try {
    // this parse may fail
    const data = JSON.parse(await getJSON())
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}
```

### 3. 条件分支

假设有如下逻辑的代码。请求数据，然后根据返回数据中的某些内容决定是直接返回这些数据还是继续请求更多数据：

```js
const makeRequest = () => {
  return getJSON()
    .then(data => {
      if (data.needsAnotherRequest) {
        return makeAnotherRequest(data)
          .then(moreData => {
            console.log(moreData)
            return moreData
          })
      } else {
        console.log(data)
        return data
      }
    })
}
```

只是阅读这些代码已经够让你头疼的了。一不小心你就会迷失在这些嵌套(6层)，空格，返回语句中。

在使用async/await改写后，这段代码的可读性大大提高了：


```js
const makeRequest = async () => {
  const data = await getJSON()
  if (data.needsAnotherRequest) {
    const moreData = await makeAnotherRequest(data);
    console.log(moreData)
    return moreData
  } else {
    console.log(data)
    return data
  }
```

### 4. 中间值
你可能会遇到这种情况，请求promise1，使用它的返回值请求promise2，最后使用这两个promise的值请求promise3。对应的代码看起来是这样的：

```js
const makeRequest = () => {
  return promise1()
    .then(value1 => {
      // do something
      return promise2(value1)
        .then(value2 => {
          // do something
          return promise3(value1, value2)
        })
    })
}
```

如果promise3没有用到value1，那么我们就可以把这几个promise改成嵌套的模式。如果你不喜欢这种编码方式，你也可以把value1和value2封装在一个Promsie.all调用中以避免深层次的嵌套：

```js
const makeRequest = () => {
  return promise1()
    .then(value1 => {
      // do something
      return Promise.all([value1, promise2(value1)])
    })
    .then(([value1, value2]) => {
      // do something
      return promise3(value1, value2)
    })
}
```

这种方式为了保证可读性而牺牲了语义。除了避免嵌套的promise，没有其它理由要把value1和value2放到一个数组里。

同样的逻辑如果换用async/await编写就会非常简单，直观。

```js
const makeRequest = async () => {
  const value1 = await promise1()
  const value2 = await promise2(value1)
  return promise3(value1, value2)
}
```

### 5. 异常堆栈
假设有一段串行调用多个promise的代码，在promise串中的某一点抛出了异常：

```js
const makeRequest = () => {
  return callAPromise()
    .then(() => callAPromise())
    .then(() => callAPromise())
    .then(() => callAPromise())
    .then(() => callAPromise())
    .then(() => {
      throw new Error("oops");
    })
}

makeRequest()
  .catch(err => {
    console.log(err);
    // output
    // Error: oops at callAPromise.then.then.then.then.then (index.js:8:13)
  })
```

从promise串返回的异常堆栈中没有包含关于异常是从哪一个环节抛出的信息。更糟糕的是，它还会误导你，它包含的唯一的函数名是callAPromise，然而该函数与此异常并无关系。（这种情况下文件名和行号还是有参考价值的）。

然而，在使用了async/await的代码中，异常堆栈指向了正确的函数：

```js
const makeRequest = async () => {
  await callAPromise()
  await callAPromise()
  await callAPromise()
  await callAPromise()
  await callAPromise()
  throw new Error("oops");
}

makeRequest()
  .catch(err => {
    console.log(err);
    // output
    // Error: oops at makeRequest (index.js:7:9)
  })
```

这带来的好处在本地开发环境中可能并不明显，但当你想要在生产环境的服务器上获取有意义的异常信息时，这会非常有用。在这种情况下，知道异常来自makeRequest而不是一连串的then调用会有意义的多。

### 6. 调试

最后压轴的一点，使用async/await最大的优势在于它很容易被调试。由于以下两个原因，调试promise一直以来都是很痛苦的。

1. 你不能在一个返回表达式的箭头函数中设置断点（因为没有代码块）
2. 如果你在一个.then代码块中使用调试器的步进(step-over)功能，调试器并不会进入后续的.then代码块，因为调试器只能跟踪同步代码的『每一步』。

通过使用async/await，你不必再使用箭头函数。你可以对await语句执行步进操作，就好像他们都是普通的同步调用一样。



