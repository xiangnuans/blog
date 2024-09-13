---
title: create-react-app核心源码解读（一）
autoGroup-2: create-react-app脚手架核心源码
---

> 掘金迁移过来，图片有问题，有兴趣可以查看我的掘金文章
原文：https://juejin.cn/post/7122058981756895239


# React官方脚手架
- 以5.0.1版本为例
- 创建项目执行过程


# 源码解读debug


## 1. 克隆项目到本地

```shell
git clone https://github.com/facebook/create-react-app.git
```


## 2. 首先将全局的create-react-app(之前mac电脑安装了全局的create-react-app)替换为当前create-react-app，当前文件目录下执行命令

```shell
npm link
```

执行`create-react-app ...`即为当前克隆项目

## 3. 找到packages/create-react-app目录
- 找到`index.js`
```js
'use strict';

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];

if (major < 14) {
  console.error(
    'You are running Node ' +
      currentNodeVersion +
      '.\n' +
      'Create React App requires Node 14 or higher. \n' +
      'Please update your version of Node.'
  );
  process.exit(1);
}

const { init } = require('./createReactApp');

init();
```
- **以使用脚手架新建项目（比如：`create-react-app my-app`）为例，相当于走的`react-script 的init`启动方式，如果`yarn start`或者`yarn build`实际执行的流程不同，后续在补充`TODO`**

打断点第一行`const currentNodeVersion = process.versions.node;`

执行命令：
```shell 
 node --inspect-brk create-react-app my-app
```
debug代码如下：

<!-- ![截屏2022-07-19 09.17.28.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/121289cacda143268806988d9e9292f2~tplv-k3u1fbpfcp-watermark.image?) -->

判断当前运行node版本，小于V14，抛错，退出；否则继续向下执行，进入`init`

- `createReactApp.js`：
```js
 const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action(name => {
      projectName = name;
    })
    .option('--verbose', 'print additional logs')
    .option('--info', 'print environment debug info')
    .option(
      '--scripts-version <alternative-package>',
      'use a non-standard version of react-scripts'
    )
    .option(
      '--template <path-to-template>',
      'specify a template for the created project'
    )
    .option('--use-pnp')
    .allowUnknownOption()
    .on('--help', () => {
      console.log(
        `    Only ${chalk.green('<project-directory>')} is required.`
      );
      console.log();
      console.log(
        `    A custom ${chalk.cyan('--scripts-version')} can be one of:`
      );
      console.log(`      - a specific npm version: ${chalk.green('0.8.2')}`);
      console.log(`      - a specific npm tag: ${chalk.green('@next')}`);
      console.log(
        `      - a custom fork published on npm: ${chalk.green(
          'my-react-scripts'
        )}`
      );
      console.log(
        `      - a local path relative to the current working directory: ${chalk.green(
          'file:../my-react-scripts'
        )}`
      );
      console.log(
        `      - a .tgz archive: ${chalk.green(
          'https://mysite.com/my-react-scripts-0.8.2.tgz'
        )}`
      );
      console.log(
        `      - a .tar.gz archive: ${chalk.green(
          'https://mysite.com/my-react-scripts-0.8.2.tar.gz'
        )}`
      );
      console.log(
        `    It is not needed unless you specifically want to use a fork.`
      );
      console.log();
      console.log(`    A custom ${chalk.cyan('--template')} can be one of:`);
      console.log(
        `      - a custom template published on npm: ${chalk.green(
          'cra-template-typescript'
        )}`
      );
      console.log(
        `      - a local path relative to the current working directory: ${chalk.green(
          'file:../my-custom-template'
        )}`
      );
      console.log(
        `      - a .tgz archive: ${chalk.green(
          'https://mysite.com/my-custom-template-0.8.2.tgz'
        )}`
      );
      console.log(
        `      - a .tar.gz archive: ${chalk.green(
          'https://mysite.com/my-custom-template-0.8.2.tar.gz'
        )}`
      );
      console.log();
      console.log(
        `    If you have any problems, do not hesitate to file an issue:`
      );
      console.log(
        `      ${chalk.cyan(
          'https://github.com/facebook/create-react-app/issues/new'
        )}`
      );
      console.log();
    })
    .parse(process.argv);

  if (program.info) {
    console.log(chalk.bold('\nEnvironment Info:'));
    console.log(
      `\n  current version of ${packageJson.name}: ${packageJson.version}`
    );
    console.log(`  running from ${__dirname}`);
    return envinfo
      .run(
        {
          System: ['OS', 'CPU'],
          Binaries: ['Node', 'npm', 'Yarn'],
          Browsers: [
            'Chrome',
            'Edge',
            'Internet Explorer',
            'Firefox',
            'Safari',
          ],
          npmPackages: ['react', 'react-dom', 'react-scripts'],
          npmGlobalPackages: ['create-react-app'],
        },
        {
          duplicates: true,
          showNotFound: true,
        }
      )
      .then(console.log);
  }

  if (typeof projectName === 'undefined') {
    console.error('Please specify the project directory:');
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
    );
    console.log();
    console.log('For example:');
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green('my-react-app')}`
    );
    console.log();
    console.log(
      `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
  }
```

- 执行`commander`交互命令，完成，判断`program.info`，不会走入判断；接着执行`typeof projectName === 'undefind'`，不会走入，`checkForLatestVersion`

- **该部分代码接上部分代码，属于`init`的一部分**

```js
 checkForLatestVersion()
    .catch(() => {
      try {
        return execSync('npm view create-react-app version').toString().trim();
      } catch (e) {
        return null;
      }
    })
    .then(latest => {
      if (latest && semver.lt(packageJson.version, latest)) {
        console.log();
        console.error(
          chalk.yellow(
            `You are running \`create-react-app\` ${packageJson.version}, which is behind the latest release (${latest}).\n\n` +
              'We recommend always using the latest version of create-react-app if possible.'
          )
        );
        console.log();
        console.log(
          'The latest instructions for creating a new app can be found here:\n' +
            'https://create-react-app.dev/docs/getting-started/'
        );
        console.log();
      } else {
        const useYarn = isUsingYarn();
        createApp(
          projectName,
          program.verbose,
          program.scriptsVersion,
          program.template,
          useYarn,
          program.usePnp
        );
      }
    });

```
- 执行`checkForLatestVersion`，具体解析见[create-react-app脚手架核心远嘛解读（三）](https://juejin.cn/post/7122062622442127391/)

返回数据：`.then(latest)`， `latest`为5.0.1, 判断最新版本有，获取到的当前版本小于最新版本，给出版提示信息，否则，判断是否使用`yarn`命令，接着执行创建新的应用`createApp(..)`

- 执行`createApp`，具体源码函数解读见[create-react-app脚手架核心源码解读（四）](https://juejin.cn/post/7122065194896850974/)

至此，初始化`init`函数关键内容完成解读；

创建项目的前置内容完成；

后续完成创建项目具体[create-react-app脚手架核心源码解读（四）](https://juejin.cn/post/7122065194896850974/)



 
 















