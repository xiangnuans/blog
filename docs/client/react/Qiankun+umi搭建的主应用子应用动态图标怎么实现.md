---
title: Qiankun+umi搭建的主应用子应用动态图标怎么实现？
autoGroup-1: 微前端qiankun
---

微前端的主应用是基于qiankun和umi框架搭建而成，主应用注册了多个子应用，子应用的ico需要动态设置显示后端获取的图标数据

# umi框架默认的配置

```json
 headScripts: [
    {
      src: './scripts/loading.js',
      async: true
    }
    // {
    //   src: './favicon.ico',
    //   async: true
    // }
  ],
  links: [
    {
      href: './favicon.ico',
      type: 'image/x-icon',
      rel: 'icon'
    },
    {
      href: './iconfont.css',
      rel: 'stylesheet'
    }
  ],
```
在文件夹public下面默认是有`favico.ico`的默认图标的

# 所有的子应用图标相同

- 替换`public`文件下的`favico.ico`
- `links`文件都不需要配置

# 子应用需要设置不同的图标
- 图标数据是从后台配置中获取，在运行时主入口接口获取到图标相关数据
- 获取图标`link`设置

```js
data?.appLogo &&
document.querySelectorAll("link[rel*='icon']").forEach((item: any) => {
  item.href = data?.appLogo;

  // 设置图标的内联样式
  item.style.borderRadius = '8px';
});

```
- 设置图标的圆角样式，但是并没有生效

# 多次加载
上述设置后，会出现新的问题，多次加载，首先会加载默认的图标，因为如下配置：

```js
 headScripts: [
    {
      src: './scripts/loading.js',
      async: true
    }
    // {
    //   src: './favicon.ico',
    //   async: true
    // }
  ],
  links: [
    {
      href: './favicon.ico',
      type: 'image/x-icon',
      rel: 'icon'
    },
    {
      href: './iconfont.css',
      rel: 'stylesheet'
    }
  ],
```
- 删除`public`下的`favico.ico`文件
- 将配置`href: ''`设置为空字符串

```js
 links: [
    {
      href: '',
      type: 'image/x-icon',
      rel: 'icon'
    },
    {
      href: './iconfont.css',
      rel: 'stylesheet'
    }
  ],

```

# 会加载umi默认的图标，如何解决
- 在`public`目录下创建一个空的`favicon.ico`文件，用于占位。
- 在你的应用中，使用Javascript动态修改`favicon`



