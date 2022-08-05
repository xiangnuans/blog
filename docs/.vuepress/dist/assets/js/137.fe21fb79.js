(window.webpackJsonp=window.webpackJsonp||[]).push([[137],{536:function(s,a,n){"use strict";n.r(a);var t=n(2),e=Object(t.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"mac下安装nginx"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mac下安装nginx"}},[s._v("#")]),s._v(" Mac下安装nginx")]),s._v(" "),a("h2",{attrs:{id:"必备工具"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#必备工具"}},[s._v("#")]),s._v(" 必备工具")]),s._v(" "),a("p",[s._v("homebrew"),a("a",{attrs:{href:"https://brew.sh/index_zh-cn.html",target:"_blank",rel:"noopener noreferrer"}},[s._v("https://brew.sh/index_zh-cn.html"),a("OutboundLink")],1),s._v("（安装方法自行搜索）")]),s._v(" "),a("p",[s._v("安装完毕后代开命令行")]),s._v(" "),a("h2",{attrs:{id:"步骤一-先更新homebrew"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#步骤一-先更新homebrew"}},[s._v("#")]),s._v(" 步骤一：先更新homebrew")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("brew update\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("如果上面操作长时间没有任何动静，请更换镜像，参考清华镜像")]),s._v(" "),a("p",[a("a",{attrs:{href:"https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/",target:"_blank",rel:"noopener noreferrer"}},[s._v("https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/"),a("OutboundLink")],1)]),s._v(" "),a("h2",{attrs:{id:"步骤二-查看nginx信息"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#步骤二-查看nginx信息"}},[s._v("#")]),s._v(" 步骤二： 查看nginx信息")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("brew search nginx\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("h2",{attrs:{id:"步骤三-安装nginx"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#步骤三-安装nginx"}},[s._v("#")]),s._v(" 步骤三： 安装nginx")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("brew install nginx\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("安装完毕\n主页的文件在/usr/local/var/www 文件夹下\n对应的配置文件地址在/usr/local/etc/nginx/nginx.conf")]),s._v(" "),a("h2",{attrs:{id:"步骤四-运行nginx"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#步骤四-运行nginx"}},[s._v("#")]),s._v(" 步骤四：运行nginx")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("nginx\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("nginx默认使用8080端口 如果发现端口被占用了，可以杀掉使用使用改端口的进程，也可以修改/usr/local/etc/nginx/nginx.conf 下的")]),s._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[s._v("http "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    server "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        listen       "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8181")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        server_name  localhost"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n        #charset koi8"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("r"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("...")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br")])]),a("h2",{attrs:{id:"重新启动nginx"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#重新启动nginx"}},[s._v("#")]),s._v(" 重新启动nginx")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("nginx -s reload\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("成功看到欢迎页面～！（对应的html是/usr/local/var/www/index.html）")]),s._v(" "),a("p",[a("img",{staticClass:"lazy",attrs:{alt:"","data-src":"https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-23-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-11-23%20%E4%B8%8A%E5%8D%8811.40.27.png",loading:"lazy"}})])])}),[],!1,null,null,null);a.default=e.exports}}]);