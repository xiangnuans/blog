---
title: javaScript知识点
date: 2019-04-27 16:34:08
tags: JavaScript
---

# 推荐资源：
http://javascript.info/
# 闭包 
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures
# ES6面向对象（https://www.html.cn/archives/7383）
# 箭头函数(this作用域不同)
- 只有一个参数，括号可以参略，
- 只有一行return，{}可以参略，
- 与传统函数相比，作用域不同，箭头函数在哪个对象中调用，this就是哪个对象


```
例：var obj = {
	name = “1”,
	f: funcition() {
		var me = this; //需要重新获取
		window.setTimeout(function(){
			console.log(me.name, ‘in timeout’)
		}, 1000)
	}
	fn: function() {
		setTimeout(
			() => {
				conosle.log(this, ‘箭头函数的this’)
			}， 1000
		)
	}
      }
）
```

# class 静态属性和实例属性

## 静态属性

指的是class本身的属性，即Class.propname，而不是定义在实例对象（this）的属性。

ES6使用静态属性和实例属性

```
// 定义静态属性
StaticMethod.firstName = 'pcsa';

// 定义实例属性
// ES6实例属性只能在constructor构造函数中定义
constructor(){
	super();
	this.width='40cm'
}
getWidth() {
	return this.width;  
}
为了可读性的目的，对于那些在constructor里面已经定义的实例属性，新写法允许直接列出
width；

```
**说明**：目前ES6，只有这种写法可行，因为ES6明确规定，Class内部只有静态方法，没有静态属性


**ES7有一个静态属性的提案**，目前Babel转码器支持。安装babel-preset-stage-0包含了0-3的stage，可根据需要天假，不同的stage封装了不同的插件，官方推荐使用stage-1安装命令

```
npm i --save babel-preset-stage-0
```

ES7使用静态属性和实例属性：

```
// StaticMethod.js
// ES7提案，定义静态属性
static lastName="piss"

// ES7 定义实例属性
height='150cm';

getHeight() {
	reteurn this.height;   // ES7的使用也要加上this


StaticMethod.firstName = "pcc"
```