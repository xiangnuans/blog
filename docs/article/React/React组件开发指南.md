# 轻松开发一个react组件

很多前端开发者在开发react组件的时候往往不知从何下手，如果你也有此困惑，那么读完本文肯定让你拨云见日立即手撸一个组件出来，这里将使用Damujiangr开发的yeoman脚手架轻松搭建一个react组件开发工程

建议在github或gitlab上创建工程，然后clone到本地，再执行以下操作，这样可以保证在生成package.json时自动填充repository、bugs、homepage等git仓库信息字段

- 首先是工具安装

```
[sudo] npm install -g yo                                 # yo工具安装
[sudo] npm install -g generator-react-component-magic    # template安装

yo react-component-magic                                 # 工程初始化

```

node.js版本建议选择8.x，windows系统可能有webpack plugin的兼容问题

```
├── doc                     // 使用文档
├── examples                // 示例代码
├── package.json
├── rollup.config.js
├── src                     // 源代码
├── style                   // 源代码样式
└── webpack.config.js
```

- src目录结构

```
├── __tests__			// 测试目录
├── components			// 组件目录
│   ├── Block.js		// 单一组件
│   └── __tests__		// 测试目录
└── index.js			// 主入口

```
复制代码
此结构支持单一组件的开发和导出，如图例中的Block.js，也支持多个组件同时开发和导出，在component下创建文件夹或者新的文件即可，只要在index.js中组织export的方式即可

单一文件导出示例

```
import Block from './components/Block';

export default Block;
```

多个组件导出示例

```
export { default as Block } from './components/Block';
export { default as Other } from './components/Other';
export { default as More } from './components/More';
```

代码规范约束使用的eslint，遵循airbnb代码规范

- rollup.config.js说明

作用是导出组件的外链版本，供在HTML中通过srcipt:src方式引入

在配置中可以通过修改output.name指定组件对外暴露的变量名

- webpack.config.js

作用是通过npm start运行本地开发时的一些配置

在配置中可以通过resolve.alias指定npm包名

- 执行npm run build会构建出组件代码，用于上传NPM，目录如下，其他style源代码也是生产代码

```
├── dist                    // 产物外链版本
├── esm                     // 产物ES6版本
├── lib                     // 产物ES5版本
└── style                   // 源代码样式
```


在package.json中已经配置好入口：

```
"main": "lib/index.js",		// 一般情况下的主入口
"module": "esm/index.js"	// 提案，用于引入ES Module的入口
```

本地开发测试和测试脚本 测试对组件开发来说是非常必要的，本例中可以在example中可以直接通过import方式引入正在开发的组件，进行本地测试 在example/app.js引入组件

```
import 'react-component-template/style/component.css';// eslint-disable-line
import Block from 'react-component-template/src'; // eslint-disable-line
```

通过npm start命令自动打开浏览器并打开热更新功能，可以方便的进行本地开发测试
测试框架使用的是Jest,可以在每级目录的__test__目录下编写对接的测试文件，执行npm run test命令即可得到测试结果，代码覆盖率报告使用的codecov, 如果你的工程上传到github，并配置好travis CI，可以通过codecov上传测试报告


但是我在执行npm run start时报错了，网上查到了解决方法

[解决方案](https://stackoverflow.com/questions/51554366/jest-securityerror-localstorage-is-not-available-for-opaque-origins)


- 上传NPM

> 首先要有一个npm账号

```
npm login
npm version <>
npm publish
```

到此为止，你就可以愉快地开发属于你自己的react组件了，并且可以发布到NPM上分享给其他人


