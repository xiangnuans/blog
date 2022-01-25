(window.webpackJsonp=window.webpackJsonp||[]).push([[91],{478:function(t,s,a){"use strict";a.r(s);var n=a(54),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"pm2深入学习"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#pm2深入学习"}},[t._v("#")]),t._v(" pm2深入学习")]),t._v(" "),a("h2",{attrs:{id:"背景"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#背景"}},[t._v("#")]),t._v(" 背景")]),t._v(" "),a("p",[t._v("对于线上项目，如果直接通过node app来启动，如果报错了可能直接停止导致整个服务崩溃，一般监控node有几个方案。")]),t._v(" "),a("ul",[a("li",[t._v("supervisor：一般用作开发环境的使用")]),t._v(" "),a("li",[t._v("forever：管理多个站点，一般每个站点的访问量不大的情况，不需要监控")]),t._v(" "),a("li",[t._v("PM2: 网站的访问量比较大，需要完整的监控页面")])]),t._v(" "),a("h2",{attrs:{id:"pm2的主要特性"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#pm2的主要特性"}},[t._v("#")]),t._v(" PM2的主要特性")]),t._v(" "),a("ul",[a("li",[t._v("内建负载均衡（使用node cluster集群模块）")]),t._v(" "),a("li",[t._v("监听文件变化，自动重启程序")]),t._v(" "),a("li",[t._v("支持性能监控")]),t._v(" "),a("li",[t._v("程序崩溃自动重启")]),t._v(" "),a("li",[t._v("服务器重新启动时自动重新启动")]),t._v(" "),a("li",[t._v("自动话部署项目")])]),t._v(" "),a("h2",{attrs:{id:"常用命令"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#常用命令"}},[t._v("#")]),t._v(" 常用命令")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("pm2 start app.js --name application\npm2 start app.js --name start --watch // 添加进程监视\npm2 show (appname|id)\npm2 list\npm2 monit\npm2 logs\npm2 web // 监控运行这些进程的机器状态\npm2 stop (id|all)\npm2 restart (id| all)\npm2 delete (id|all) // 杀死指定/所有进程\npm2 start centos // 设置pm2开机自启（可选项：ubuntu, centos, rehat, gentoo, systemd, darwin, amazon）\npm2 save // 最后保存设置\n")])])]),a("h2",{attrs:{id:"配置pm2启动文件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#配置pm2启动文件"}},[t._v("#")]),t._v(" 配置PM2启动文件")]),t._v(" "),a("p",[t._v("pm2启动的方式可以进行很多的扩展，比如设置环境，设置错误信息打印，设置输入信息打印等等高级功能。那么命令就不能完成这些任务，所有pm2提供了配置文件的方式来启动～")]),t._v(" "),a("p",[t._v("pm2.config.js")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 名称任意，按照个人习惯来")]),t._v("\nmodule"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  apps"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      name"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'kaifazhe'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 应用名称")]),t._v("\n      script"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./build/server.js'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 启动文件地址")]),t._v("\n      cwd"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 当前工作路径")]),t._v("\n      watch"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 监控变化的目录，一旦变化，自动重启")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'src'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'build'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      ignore_watch"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 忽视这些目录的变化")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'node_modules'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'logs'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'public'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      node_args"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'--harmony'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// node的启动模式")]),t._v("\n      env"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("NODE_ENV")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'development'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 设置运行环境，此时process.env.NODE_ENV的值就是development")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("ORIGIN_ADDR")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'http://www.yoduao.com'")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      env_production"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("NODE_ENV")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'production'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      out_file"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./logs/out.log'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 普通日志路径")]),t._v("\n      error_file"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./logs/err.log'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 错误日志路径")]),t._v("\n      merge_logs"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      log_date_format"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'YYYY-MM-DD HH:mm Z'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n\n")])])]),a("blockquote",[a("p",[t._v("对于上面的 env，我们可以在内部添加很多个参数变量，这样我们所使用的 process.env.XXX 就会对应发生变化,例如上面，我们 process.env.ORIGIN_ADDR 的值就是http://www.youdao.com～")])]),t._v(" "),a("h2",{attrs:{id:"日志"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#日志"}},[t._v("#")]),t._v(" 日志")]),t._v(" "),a("ol",[a("li",[a("p",[t._v("pm2日志\n上面配置文件可以看出来，我们可以配置logs，包括普通的out和错误的err日志。其实业不需要我们做什么，我们只需要在config里面配置好就行，他就会自动往里面写日志：")])]),t._v(" "),a("li",[a("p",[t._v("日志分割")])])]),t._v(" "),a("p",[t._v("我们正常意义上的日志，以node为例，应该都是使用的log4js来进行按日期写入的，那么pm2可不可以按日期写入呢？答案时肯定的")]),t._v(" "),a("p",[t._v("pm2为我们提供了插件系统，而日期分割功能就正好用到了插件系统，！"),a("img",{attrs:{src:"https://github.com/keymetrics/pm2-logrotate",alt:"pm2-logrotate"}})]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("pm2 install pm2-logrotate // 看好了，是pm2 install而不是npm install\n复\n")])])]),a("p",[t._v("你装完之后它就自动启动，然后你还可以配置各种参数")]),t._v(" "),a("p",[t._v("然后就完成了日志按日期分割～")]),t._v(" "),a("blockquote",[a("p",[t._v("细心的小伙伴可能发现了，你上面让我安装的是pm2-logrotate，为啥你安装的是pm2-logrotate-ext，嗯，因为据说官方的pm2-logrotate存在一个bug，就是日期会正常分割，但是如果你前一天的文件没有写满比如你设置了1M但只写了500K那么第二天的日志还是会插入到原来的out.log(err.log)，所以大牛就写了这个解决了这个问题"),a("img",{attrs:{src:"https://github.com/Lujo5/pm2-logrotate-ext",alt:"pm2-logrotate-ext"}})])]),t._v(" "),a("h2",{attrs:{id:"负载均衡"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#负载均衡"}},[t._v("#")]),t._v(" 负载均衡")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("pm2 start server.js -i (number|max)\n\n")])])]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("# 开启三个进程运行项目\npm2 start app.js -i 3\n# 根据机器CPU核数，开启对应数目的进程运行项目\npm2 start app.js -i max\n")])])]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v('配置文件里对应的："instance": (number|max)\n')])])]),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v('// pm2.config.js\n"instances": 2,  // 启动两个实例\n\n')])])]),a("h2",{attrs:{id:"通过pm2配置文件来自动部署项目"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#通过pm2配置文件来自动部署项目"}},[t._v("#")]),t._v(" 通过pm2配置文件来自动部署项目")]),t._v(" "),a("p",[t._v("在项目根目录下新建一个deploy.yml文件")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("# deploy"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("yaml\napps"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v(" script"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("start"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("js       # 入口文件\n    name"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'app'")]),t._v("              # 程序名称\n    env"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("                     # 环境变量\n      "),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("COMMON_VARIABLE")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n    env_production"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("NODE_ENV")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" production\n\ndeploy"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("                     # 部署脚本\n  production"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("               # 生产环境\n    user"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" lentoo            # 服务器的用户名\n    host"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("192.168")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v(".2")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v(".166")]),t._v("     # 服务器的ip地址\n    port"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("22")]),t._v("                # ssh端口\n    ref"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" origin"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("master      # 要拉取的git分支\n    ssh_options"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" StrictHostKeyChecking"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("no # "),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("SSH")]),t._v(" 公钥检查\n    repo"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" https"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("github"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**.git # 远程仓库地址\n    path: /home              # 拉取到服务器某个目录下\n    pre-deploy: git fetch --all # 部署前执行\n    post-deploy: npm install &&  pm2 reload deploy.yaml --env production # 部署后执行\n    env:\n      NODE_ENV: production\n")])])])]),a("p",[t._v("使用pm2部署项目")]),t._v(" "),a("ul",[a("li",[t._v("首次部署")])]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("pm2 deploy deploy.yaml production setup\n")])])]),a("p",[t._v("再次部署")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("pm2 deploy deploy.yaml production update\n")])])]),a("p",[t._v("该部署流程同样适用前端项目\n如vue-cli的项目，自动部署到服务器，自动执行npm run build 命令，生成的dist目录，指定到nginx的静态文件目录下。")]),t._v(" "),a("h2",{attrs:{id:"配合pm2-web实现监控可视化"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#配合pm2-web实现监控可视化"}},[t._v("#")]),t._v(" 配合"),a("code",[t._v("pm2-web")]),t._v("实现监控可视化")]),t._v(" "),a("p",[t._v("可能很多人不喜欢控制台，喜欢把监控进行可视化更方便查看和分析。pm2-web")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("npm install -g pm2-web\n")])])]),a("p",[t._v("默认pm2-web会自动启动一个端口8080，但是我们还是喜欢可控状态的， 因此按照配置文件的方式启动。")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("$ pm2-web --config pm2-web-config.json\n")])])]),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// pm2-web-config.json")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"www"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"host"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"localhost"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"address"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"0.0.0.0"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"port"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("6688")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n")])])]),a("p",[t._v("这样你就可以在浏览器查看可视化的监控状态了～")]),t._v(" "),a("blockquote",[a("p",[t._v("pm2-web依赖node-inspector,而node-inspector对于高版本node无法安装，很多人提了issue，但是感觉开发者也处于放弃了的状态。我也不打算在本地安装低版本node，所以感兴趣的大家可以安装个低版本的试试～")])])])}),[],!1,null,null,null);s.default=e.exports}}]);