---
title: create-react-app脚手架本地调试
---

# 本地怎么从`create-react-app`到`react-scripts`

- `packages`目录下

## `create-react-app`开始调用`react-scripts`

源代码如下：

```js
 await executeNodeScript(
          {
            cwd: process.cwd(),
            args: nodeArgs,
          },
          [root, appName, verbose, originalDirectory, templateName],
          `
        const init = require('${packageName}/scripts/init.js');
        init.apply(null, JSON.parse(process.argv[1]));
      `
        );
  
```
        
        
        
 ## 替换代码

```js
   // 加载script脚本，并执行init方法
const scriptPath = path.resolve(
    process.cwd(),
    'node_modules',
    packageName,
    'scripts',
    "init.js"
)

const init = require(scriptPath);
init(root, appName, verbose, originalDirectory, templateName)

```
        
        
        