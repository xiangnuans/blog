# 聊聊TypeScript中的设计模式--装饰器篇（decorators）

[转载自](https://github.com/forthealllight/blog/issues/33)

## 什么是装饰者模式

最近在看nestjs等支持TypeScript的node框架，经常看到这样一种写法

```js
import { Controller, Get } from '@nestjs/common';

@Controller('cats')

export class CatsController {
  @Get()
  findAll() {
    return 'This action returns all cats';
  }
}
```

上述代码定义了一个处理URL为“/cats”的控制器，该控制器对于URL为“/cats”的get方法执行findAll()函数，返回相应的字符串

在上述的代码中，用@controller('cats')修饰CatsController类，通过@get来修饰类中的findAll方法，这就是典型的装饰着模式。通过@controller('cats')和@get修饰后的类CatsController，简单来说，就是拥有了丰富的“内涵”

下面看看具体装饰者模式的定义：

我们知道继承模式是丰富子元素“内涵”的一种重要方式，不管是继承接口还是子类继承基类。而装饰者模式可以在不改变继承关系的前提下，包装现有的模块，使其内涵更加丰富，并不会影响到原有的功能。与继承相比，更加灵活。

JavaScript中的装饰器处于建议征集的第二阶段，通过babel和TypeScript都可以实现装饰器的语法

## 二、TypeScript中的装饰器

Typescript中的装饰器与类相关，分别可以装饰类的实例函数和静态函数、类本身、类的属性、类中函数的参数以及类的set/get存取器，下面来一一介绍：

### 1. 类方法的装饰器

下面来介绍一下用装饰器来修饰函数，首先看一个例子：

```js
let temple;
function log(target, key, descriptor) {
  console.log(`${key} was called!`);
  temple = target;
}
class P {
    @log
    foo() {
      console.log('Do something');
    }
}

const p = new P()
console.log(P.prototype === temple) //true
```

上述是实例方法foo中我们用log函数修饰，log函数接受三个参数，通过P.prototype === temple(target)可以判断，在类的实例函数的装饰器函数第一个参数为类的原型，第二个参数为函数名本身，第三个参数为该函数的描述属性

具体总结如下：

- target: 如果装饰的是类的实例函数，那么target就是类的原型。如果修饰的是类的静态函数，那么target就是类本身
- key: 该函数的函数名
- descriptor：该函数的描述属性，比如configurable、value、enumerable等

从上述的例子中我们可以看到，用来装饰器来修饰相应的类的函数十分方便

```js
@log
foo() {

}
```

### 2. 类的装饰器

装饰函数也可以直接修饰类

```js
let temple
function foo(target) {
  console.log(target)
  temple = target
}
@foo
class P {
  constructor() {

  }
}
const p = new P();
temple === P // true
```
当装饰函数直接修饰类的时候，装饰函数接受唯一的参数，这个参数就是被修饰累本身。上述的例子中，输出的target就是类P的本身。

此外，在修饰类的时候，如果装饰函数有返回值，该返回值会重新定义这个类，也就是会所当装饰函数 有返回值时，其实是生成了一个新类，该新类会通过返回值来定义。

举例来说：

```js
function foo(target) {
  return class extends target {
    name = 'Jony';
    sayHello() {
      console.log('Hello ' + this.name)
    }
  }
}
@foo
class P {
  constructor() {}
}
const p = new P()
p.sayHello(); // 会输出Hello Jony
```

上面的例子可以看到，当装饰函数foo有返回值时，实际上P类已经被返回值所代表的新类所代替，因此P的实例p拥有sayHello方法

### 3. 类的属性的装饰器

下面我们来看类的属性的装饰器，装饰函数修饰类的属性时，在类实例化的时候调用属性的装饰函数，举例来说：

```js
function foo(target, name) {
  console.log("target is", target);
  console.log("name is", name);
}
class P {
  @foo
  name = 'Jony'
}
const p = new P ();
// 会依次输出 target is f P()  name is Jony
```

这里对于类的属性的装饰器函数接受两个参数，对于静态属性而言，第一个参数是类本身，对于实例属性而言，第一个参数是类的原型，第二个参数是指属性的值

### 4. 类函数参数的装饰器

接着来看类函数参数的装饰器，累函数的参数装饰器可以修饰类的构建函数中的参数，以及类中其它普通函数中的参数。该装饰器在类的方法被调用的时候执行，下面来看实例：

```js
function foo(target, key, index) {
  console.log("target is", target);
  console.log("key is ", key);
  console.log("index is", index)
}
class P {
  test(@foo a) {

  }
}
const p = new P ();
p.test ("Hello Jony")
// 依次输出 P()，test， 0
```

累函数参数的装饰器函数接受三个参数，依次为类本身，类中该修饰的函数本身，以及被修饰的参数在参数列表中的索引值。
- targe： 类本身
- key：该参数所在的函数的函数名
- index：该参数在函数参数列表中的索引值

从上面的Typescript中在基类汇总常用的装饰器后，我们发现

装饰器可以起到分离复杂逻辑的功能，且使用上极其简单方便。与继承相比，也更加灵活，可以从装饰类，到装饰类函数的参数

## 三、Typescript中的注解

在了解了Typescript 中的装饰器之后，接着我们呢来看TypeSCript中的注解

什么时注解，所谓注解的定义就是：

为相应的类附加元数据支持

所谓元数据可以简单的解释，就是修饰数据的数据，比如一个人有name、age等数据属性，那么name和age这些字段就是为了修饰数据的数据，可以简单的成为元数据。

元数据简单来说就是可以修饰某些数据的字段，下面给出装饰器和注解的解释和区别：

- 装饰器：定义劫持，可以对类、类的方法，类的属性以及类的方法的入参进行修改，不提供元数据的支持
- 注解：仅提供给元数据的支持

两者之间的联系

通过注解添加元数据，然后子啊装饰器中获取这些元数据，完成对类、类的方法等等的修改，可以在装饰器中添加元数据的支持，比如可以在装饰器工厂函数以及装饰器函数中添加元数据支持等

### 1. Typescript中的元数据操作

可以通过reflect-metadata包来实现对于元数据的操作。首先我们来看reflect-metadata的使用，首先定义使用元数据的函数：

```js
const formatMetadataKey = Symbol("format")

function format(formatString: string) {
  return reflect.metadata(formatMetadataKey, formatString)
}

function getFormat(target: any, propertyKey: stirng) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}
```
这里的format可以作为装饰器函数的工厂函数，因为format函数返回的是一个装饰器函数，上述的方法定义了元数据Sysmbol("format"),用Sysmbol的原因是为了防止元数据中的字段重复，而format定义了取元数据中相应字段的功能。

接着我们来在类中使用相应的元数据：

```js
class Greeter {
    @format("Hello, %s")
    name: string;

    constructor(name: string) {
        this.name = message;
    }
    sayHello() {
        let formatString = getFormat(this, "name");
        return formatString.replace("%s", this.name);
    }
}

const g = new Greeter("Jony");
console.log(g.sayHello());
```


在上述中，我们在name属性的装饰器工厂函数，执行@Format("Hello, %s")，返回一个装饰器函数，且该装饰器函数修饰了Greeter类的name属性，将“name”属性的值写入为"Hello, %s"。

然后再sayHello方法中，通过getFormat(this,"name")取到formatString为“Hello,%s”.

## 四、总结
通过装饰器，可以方便的修饰类，以及类的方法，类的属性等，相比于继承而言更加灵活，此外，通过注解的方法，可以在Typescript中引入元数据，实现元编程等。特别是在angularjs、nestjs中，大量使用了注解，特别是nestjs构建了类似于java springMVC式的web框架。
