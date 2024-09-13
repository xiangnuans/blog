---
title: react-scripts解读
autoGroup-2: create-react-app脚手架核心源码
---


> 掘金迁移过来，图片有问题，有兴趣可以查看我的掘金文章
原文：https://juejin.cn/post/7122436068812521479

# React官方脚手架

-   以5.0.1版本为例
-   创建项目执行过程

# 源码解读debug
创建项目`create-react-app my-app`，前面`/packages/create-react-app`源码解读，详细可以从[create-react-app之pacakage/create-react-app核心源码解读（一）](https://juejin.cn/post/7122058981756895239)

相当于在`packages/react-scripts`运行命令：
```js
yarn init
```
以下`scripts/init.js`，代码从上到下按需执行解析

## 1. 进入函数
```js
 const appPackage = require(path.join(appPath, 'package.json'));
```

- `debug`代码如下：

<!-- ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7e16091a7954e5099162f9b55e7f229~tplv-k3u1fbpfcp-watermark.image?) -->

- 接着执行，`useyarn`返回`false`，因为前面使用的`npm`安装的依赖
- `templateName`的值为`cra-template`；
- `templatePath`运行值为`'my-app/node_modules/cra-template'`;
- `templateJsonPath`运行值`'my-app/node_modules/cra-template/template.json'`
- 获取`templateJson`读取值为：

<!-- ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91c9690e6e9c4e848d8efe29c3678710~tplv-k3u1fbpfcp-watermark.image?) -->


## 2. `templatePackageToReplace`
执行返回`false`

## 3. 新建项目`my-app`的`package.json`中添加`scripts`，具体源码如下：
```js
appPackage.scripts = Object.assign(
    {
      start: 'react-scripts start',
      build: 'react-scripts build',
      test: 'react-scripts test',
      eject: 'react-scripts eject',
    },
    templateScripts
  );
  ```
  
 到这里是不是很眼熟，`create-react-app`脚手架初始化的项目，`package.json`中就是这样
 
 ## 4. 设置 eslint config
 ```js
  appPackage.eslintConfig = {
    extends: 'react-app',
  };
```

## 5. 设置browers list
<!-- ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f37d096d8e974071819bdc8162b581cf~tplv-k3u1fbpfcp-watermark.image?) -->

## 6. 异步写入`package.json`
```js
fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );
```
执行完成后，就去新建的项目`my-app`下查看如下：

<!-- ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7eeead3d8aa74863b33cc6303c6c33b8~tplv-k3u1fbpfcp-watermark.image?) -->

- 判断是否存在`README.md`，返回`false`

## 8. 拷贝模版项目到新建项目目录下
在`create-react-app/packages`目录下可以看到有`cra-template`为初始化项目模版
- `templateDir`运行值为`'my-app/node_modules/cra-template/template'`
- `appPath`运行值为`'/Users/coco/project/shiqiang/create-react-app/packages/my-app'`
- 源码执行拷贝
```js
const templateDir = path.join(templatePath, 'template');
  if (fs.existsSync(templateDir)) {
    fs.copySync(templateDir, appPath);
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templateDir)}`
    );
    return;
  }
  ```
运行完，去`my-app`下查看，此时的目录如下：

<!-- ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3149ca457315447681c4173274d7fdab~tplv-k3u1fbpfcp-watermark.image?) -->
不存在`.gitignore`文件

## 9. 判断是否存在`.gitignore`
源码如下：
```js
const gitignoreExists = fs.existsSync(path.join(appPath, '.gitignore'));
  if (gitignoreExists) {
    // Append if there's already a `.gitignore` file there
    const data = fs.readFileSync(path.join(appPath, 'gitignore'));
    fs.appendFileSync(path.join(appPath, '.gitignore'), data);
    fs.unlinkSync(path.join(appPath, 'gitignore'));
  } else {
    // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
    // See: https://github.com/npm/npm/issues/1862
    fs.moveSync(
      path.join(appPath, 'gitignore'),
      path.join(appPath, '.gitignore'),
      []
    );
  }
```
返回`false`，于是进入`else`，运行完成，新建项目`gitignore`替换为`.gitignore`

<!-- ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ffee6076190403e8c81c833133c43e6~tplv-k3u1fbpfcp-watermark.image?) -->


## 10. 初始化`git repo`
源码如下：
```js
function tryGitInit() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync('git init', { stdio: 'ignore' });
    return true;
  } catch (e) {
    console.warn('Git repo not initialized', e);
    return false;
  }
}
```

- `yarn` or`npm`
```js
  if (useYarn) {
    command = 'yarnpkg';
    remove = 'remove';
    args = ['add'];
  } else {
    command = 'npm';
    remove = 'uninstall';
    args = [
      'install',
      '--no-audit', // https://github.com/facebook/create-react-app/issues/11174
      '--save',
      verbose && '--verbose',
    ].filter(e => e);
  }
  ```
  - 安装其他模板依赖项（如果存在）

```js
const dependenciesToInstall = Object.entries({
    ...templatePackage.dependencies,
    ...templatePackage.devDependencies,
  });
  if (dependenciesToInstall.length) {
    args = args.concat(
      dependenciesToInstall.map(([dependency, version]) => {
        return `${dependency}@${version}`;
      })
    );
  }
```
`debug`数据：

<!-- ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bc4cccd2eed4fcab39676aa0fc361fb~tplv-k3u1fbpfcp-watermark.image?) -->

`args`运行数据：

<!-- ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c06bc59d12a4eb2987cac9e29fca75d~tplv-k3u1fbpfcp-watermark.image?) -->

## 11. 判断是否安装react
- 源码如下：
```js
 if ((!isReactInstalled(appPackage) || templateName) && args.length > 1) {
    console.log();
    console.log(`Installing template dependencies using ${command}...`);

    const proc = spawn.sync(command, args, { stdio: 'inherit' });
    if (proc.status !== 0) {
      console.error(`\`${command} ${args.join(' ')}\` failed`);
      return;
    }
  }
```
- 函数`isReactInstalled`
```js
function isReactInstalled(appPackage) {
  const dependencies = appPackage.dependencies || {};

  return (
    typeof dependencies.react !== 'undefined' &&
    typeof dependencies['react-dom'] !== 'undefined'
  );
}
```

- 关键打印信息：
<!-- ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/138b047ee60d4ebe96d7ad3c222ce4ae~tplv-k3u1fbpfcp-watermark.image?) -->


## 12. 子进程执行安装命令
- 源码如下：
```js
 const proc = spawn.sync(command, args, { stdio: 'inherit' });
 ```
 
- 控制台运行信息如下：

<!-- ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9774a075a734e0b80553f1f30697bbc~tplv-k3u1fbpfcp-watermark.image?) -->

## 13. 执行删除，删除`node_modules`目录下的`cra-template`

<!-- ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73ccab30be82492e8dba4f2f1bf04244~tplv-k3u1fbpfcp-watermark.image?) -->

## 14. 显示最优雅的 cd 方式

- 源码如下：
```js
 let cdpath;
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }
```
运行后`cdpath`值为`my-app`

## 15. 成功信息提示打印
- 源码如下：
```js
 const displayedCommand = useYarn ? 'yarn' : 'npm';

  console.log();
  console.log(`Success! Created ${appName} at ${appPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} start`));
  console.log('    Starts the development server.');
  console.log();
  console.log(
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`)
  );
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} test`));
  console.log('    Starts the test runner.');
  console.log();
  console.log(
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}eject`)
  );
  console.log(
    '    Removes this tool and copies build dependencies, configuration files'
  );
  console.log(
    '    and scripts into the app directory. If you do this, you can’t go back!'
  );
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(`  ${chalk.cyan(`${displayedCommand} start`)}`);
  if (readmeExists) {
    console.log();
    console.log(
      chalk.yellow(
        'You had a `README.md` file, we renamed it to `README.old.md`'
      )
    );
  }
  console.log();
  console.log('Happy hacking!');
  ```
  
  - 控制台打印信息如下：
  
<!-- ![截屏2022-07-20 20.48.41.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f0239cddb11432b982d626e4d23bd08~tplv-k3u1fbpfcp-watermark.image?) -->

至此，新建项目`react-scripts`中的完成











