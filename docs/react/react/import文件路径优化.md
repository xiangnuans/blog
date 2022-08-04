---
title: import文件路径优化
autoGroup-1: 其他
---

## import文件路径优化

## 快速导航

<TOC />

## 使用create-react-app初始化


```shell
mkdir test && cd test
create-react-app
```

文件`import ..from '../../../'`， from的路径引用优化，@表示src当前路径，修改配置文件./config/webpack.config.js，查找文件的alias：
```json
alias: {
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web',
      },
```
在alias对象中加入一行配置
```js
'@': path.join(__dirname, '..', 'src'),
```

完整的alias：

```js
alias: {
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web',
        '@': path.join(__dirname, '..', 'src'),
      },
```


## 使用create-umi脚手架搭建react项目
```shell
mkdir test && cd test
create-umi
```

项目初始化以后，根目录下的文件jsconfig.json中已经配置好了路径
```js
 "paths": {
      "@/*": ["./src/*"]
    }
```

所以开发中可直接使用`'@/'`