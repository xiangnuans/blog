[转载自](https://github.com/SunShinewyf/issue-blog/issues/33)

> egg-init是egg的一个脚手架，用于快速生成一个egg项目或者插件

在剖析`egg-init`之前，先介绍一下脚手架的相关知识

# 关于脚手架
脚手架主要是在项目启动过程中生成一些初始文件的，而且一旦生成了初始化文件之后，脚手架就没有用武之地了。但是在一个工程化体系过程中，脚手架的作用还是很大的：

- 规范团队中的协作开发
- 快速生成配置文件，节省开发时间
- 降低框架的学习成本
脚手架一般运行在本地，并且有一些配置选项可以选用。

目前比较流行的脚手架就是yeoman,具体怎么使用可以移步这里

# 如何开发脚手架
- npm bin
需要在`package.json`中声明`bin`字段的命令
```js
"bin": {
    "init": "bin/init.js"
 },
 ```
- 建立相应的init.js文件
```
#!/usr/bin/env node  //首行必须加上
//具体逻辑
```
在`init.js`里面可以添加一些具体的逻辑，如读取文件路径，获取开发者的一些动态设置选项等

- 全局安装之后，通过`npm link`或者全局安装创建软链接，我们配置的`init`命令才能生效
# egg-init
`egg-init`提供的options有如下几种:

选项：
```
  --type          boilerplate type                                      [字符串]
  --dir           target directory                                      [字符串]
  --force, -f     force to override directory                             [布尔]
  --template      local path to boilerplate                             [字符串]
  --package       boilerplate package name                              [字符串]
  --registry, -r  npm registry, support china/npm/custom, default to auto detect
                                                                        [字符串]
  --silent          do not ask, just use default value                       [布尔]
  --version       显示版本号                                              [布尔]
  -h, --help      显示帮助信息                                            [布尔]
```
可以根据个人情况选择相应的配置

`egg-init`实现的方式也和前面说的方法一样，入口文件就是`bin/egg-init.js，`但是这个文件很简单，最终调用的是`lib/init-command.js`。

首先是在构造函数中初始化了一些参数，然后在`run`主函数里面获取了注册地址，并在terminal中打印出了`use registry:`的信息，然后是根据用户输入的项目名来生成相应的项目dir。

`egg-init`支持四种项目类型，分别是：

- simple
- empty
- framework
- plugin
其中四种项目类型的一些定义都放在`boilerplateMapping`这个变量中。并且会通过交互式命令行工具`yargs`记录用户的选择，从而在指定的`dir`下面下载不同的项目类型文件包。并且会在控制台中打印出下载地址，比如当选择`simple`时，下载包地址为：`http://registry.npm.taobao.org/egg-boilerplate-simple/download/egg-boilerplate-simple-3.0.0.tgz`

在下载文件之前会通过`askForVariable`这个函数来收集用户的一些自定义信息，比如`project name、project description`等,当设置完了所有的这些配置项之后，就开始在指定的目录中生成文件了。

`egg-init`初始化的文件
当选择项目类型为`simple`时，生成的文件如下图所示:

![](https://raw.githubusercontent.com/SunShinewyf/issue-blog/master/assets/technical/29.png)

对于`app,config,test`这些文件，就不说了，基本上也是初始化了`egg`的一些示例文件。
`eslintrc`里面声明了如下扩展:
```js
{
  "extends": "eslint-config-egg"
}
```
对于`eslintrc`配置的一些说明，可以移步这里

`eslint-config-egg`这个`npm`包则是声明了一些书写egg时需要遵循的一些书写规范。

- `.autod.conf.js`则是声明了`autod`的配置方式，对于`autod`的学习，可以参见这里和这里,主要是给用户提供自行升级依赖版本的便利
- `package.json`，里面已经配备好了一些字段，比如`dependencies、devDependencies`以及`script`等命令。
# 总结
`egg-init`脚手架的功能主要是生成项目的初始化文件，比较好的是为开发者生成了一些配置，比如说`eslint`以及`gitignore`等，会比较方便。相较于自己新建每个文件要快得多。
