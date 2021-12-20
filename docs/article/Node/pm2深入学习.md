# pm2深入学习

## 背景

对于线上项目，如果直接通过node app来启动，如果报错了可能直接停止导致整个服务崩溃，一般监控node有几个方案。

- supervisor：一般用作开发环境的使用
- forever：管理多个站点，一般每个站点的访问量不大的情况，不需要监控
- PM2: 网站的访问量比较大，需要完整的监控页面


## PM2的主要特性

- 内建负载均衡（使用node cluster集群模块）
- 监听文件变化，自动重启程序
- 支持性能监控
- 程序崩溃自动重启
- 服务器重新启动时自动重新启动
- 自动话部署项目

## 常用命令

```
pm2 start app.js --name application
pm2 start app.js --name start --watch // 添加进程监视
pm2 show (appname|id)
pm2 list
pm2 monit
pm2 logs
pm2 web // 监控运行这些进程的机器状态
pm2 stop (id|all)
pm2 restart (id| all)
pm2 delete (id|all) // 杀死指定/所有进程
pm2 start centos // 设置pm2开机自启（可选项：ubuntu, centos, rehat, gentoo, systemd, darwin, amazon）
pm2 save // 最后保存设置
```

## 配置PM2启动文件

pm2启动的方式可以进行很多的扩展，比如设置环境，设置错误信息打印，设置输入信息打印等等高级功能。那么命令就不能完成这些任务，所有pm2提供了配置文件的方式来启动～

pm2.config.js

```js
// 名称任意，按照个人习惯来
module.exports = {
  apps: [
    {
      name: 'kaifazhe', // 应用名称
      script: './build/server.js', // 启动文件地址
      cwd: './', // 当前工作路径
      watch: [
        // 监控变化的目录，一旦变化，自动重启
        'src',
        'build',
      ],
      ignore_watch: [
        // 忽视这些目录的变化
        'node_modules',
        'logs',
        'public',
      ],
      node_args: '--harmony', // node的启动模式
      env: {
        NODE_ENV: 'development', // 设置运行环境，此时process.env.NODE_ENV的值就是development
        ORIGIN_ADDR: 'http://www.yoduao.com'
      },
      env_production: {
        NODE_ENV: 'production',
      },
      out_file: './logs/out.log', // 普通日志路径
      error_file: './logs/err.log', // 错误日志路径
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};


```

> 对于上面的 env，我们可以在内部添加很多个参数变量，这样我们所使用的 process.env.XXX 就会对应发生变化,例如上面，我们 process.env.ORIGIN_ADDR 的值就是http://www.youdao.com～


## 日志

1. pm2日志
   上面配置文件可以看出来，我们可以配置logs，包括普通的out和错误的err日志。其实业不需要我们做什么，我们只需要在config里面配置好就行，他就会自动往里面写日志：

2. 日志分割

我们正常意义上的日志，以node为例，应该都是使用的log4js来进行按日期写入的，那么pm2可不可以按日期写入呢？答案时肯定的

pm2为我们提供了插件系统，而日期分割功能就正好用到了插件系统，！![pm2-logrotate](https://github.com/keymetrics/pm2-logrotate)

```
pm2 install pm2-logrotate // 看好了，是pm2 install而不是npm install
复
```

你装完之后它就自动启动，然后你还可以配置各种参数

然后就完成了日志按日期分割～

> 细心的小伙伴可能发现了，你上面让我安装的是pm2-logrotate，为啥你安装的是pm2-logrotate-ext，嗯，因为据说官方的pm2-logrotate存在一个bug，就是日期会正常分割，但是如果你前一天的文件没有写满比如你设置了1M但只写了500K那么第二天的日志还是会插入到原来的out.log(err.log)，所以大牛就写了这个解决了这个问题![pm2-logrotate-ext](https://github.com/Lujo5/pm2-logrotate-ext)



## 负载均衡

```
pm2 start server.js -i (number|max)

```

```
# 开启三个进程运行项目
pm2 start app.js -i 3
# 根据机器CPU核数，开启对应数目的进程运行项目
pm2 start app.js -i max
```

```
配置文件里对应的："instance": (number|max)
```

```
// pm2.config.js
"instances": 2,  // 启动两个实例

```

## 通过pm2配置文件来自动部署项目

在项目根目录下新建一个deploy.yml文件

```js
# deploy.yaml
apps:
  - script: ./start.js       # 入口文件
    name: 'app'              # 程序名称
    env:                     # 环境变量
      COMMON_VARIABLE: true
    env_production:
      NODE_ENV: production

deploy:                     # 部署脚本
  production:               # 生产环境
    user: lentoo            # 服务器的用户名
    host: 192.168.2.166     # 服务器的ip地址
    port: 22                # ssh端口
    ref: origin/master      # 要拉取的git分支
    ssh_options: StrictHostKeyChecking=no # SSH 公钥检查
    repo: https://github.com/**.git # 远程仓库地址
    path: /home              # 拉取到服务器某个目录下
    pre-deploy: git fetch --all # 部署前执行
    post-deploy: npm install &&  pm2 reload deploy.yaml --env production # 部署后执行
    env:
      NODE_ENV: production
```

使用pm2部署项目

- 首次部署

```
pm2 deploy deploy.yaml production setup
```

再次部署

```
pm2 deploy deploy.yaml production update
```


该部署流程同样适用前端项目
如vue-cli的项目，自动部署到服务器，自动执行npm run build 命令，生成的dist目录，指定到nginx的静态文件目录下。


## 配合`pm2-web`实现监控可视化

可能很多人不喜欢控制台，喜欢把监控进行可视化更方便查看和分析。pm2-web

```
npm install -g pm2-web
```

默认pm2-web会自动启动一个端口8080，但是我们还是喜欢可控状态的， 因此按照配置文件的方式启动。

```
$ pm2-web --config pm2-web-config.json
```

```js
// pm2-web-config.json
{
  "www": {
      "host": "localhost",
      "address": "0.0.0.0",
      "port": 6688
  }
}

```

这样你就可以在浏览器查看可视化的监控状态了～

> pm2-web依赖node-inspector,而node-inspector对于高版本node无法安装，很多人提了issue，但是感觉开发者也处于放弃了的状态。我也不打算在本地安装低版本node，所以感兴趣的大家可以安装个低版本的试试～

