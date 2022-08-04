# package.json中的workspaces

[官网](https://yarnpkg.com/lang/en/docs/workspaces/)
https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/

package.json中的有个workspace设置，如下：
```
"workspace": [
  "packages/*"
]
```

不知道是什么意思，Google一下，原来是yarn特性。为了方便monorepo的管理，yarn提供了这个选项

为了方便代码的管理和维护，许多库都在使用monorepo的结构，比如 Babel, React, Jest, Vue, Angular。monorepo管理存在的一个共同难题是依赖的管理。如果为每个repo都独立安装依赖，当多个repo之间有共同的依赖时会造成重复安装，既占用空间又影响速度。yarn的workspaces功能就是为了解决这个问题。开启后，yarn会统一分析多个repo的依赖，如果有共同的依赖(同一个库，版本需求一致)，那么就会把依赖从该repo的node_modules提升到外部的node_modules中。这样避免重复安装。

## 实践:
在以workspaces的工作方式添加了多个repo后，在其中任意一个中执行yarn install xxx，则会在整个工程的根目录下创建该依赖。同时创建了指向各个repo的symlink。如此各个repo中就不会再报找不到依赖的错误了。

## 注意:
使用此feature需要工程为private，即在最外层的package.json中写入: "private": true

目前应该只有yarn支持此功能，npm还需要依赖第三发插件实现。

https://stackoverflow.com/questions/46947557/do-yarn-workspaces-work-with-npm-too

[好文推荐](https://juejin.im/post/5d583231e51d45620541039e#heading-23)
