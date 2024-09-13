(window.webpackJsonp=window.webpackJsonp||[]).push([[154],{573:function(s,e,a){"use strict";a.r(e);var t=a(2),n=Object(t.a)({},(function(){var s=this,e=s._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[e("p",[s._v("最近在一台新的Centos 7服务器上部署了Node服务，服务启动成功后，在Mac上访问这个网站，无法访问")]),s._v(" "),e("p",[s._v("解决思路：")]),s._v(" "),e("ul",[e("li",[s._v("linux上的Node服务是否正常运行，端口是否正常监听")]),s._v(" "),e("li",[s._v("查看Linux自己的IP地址")]),s._v(" "),e("li",[s._v("mac是否ping通这台Linux")]),s._v(" "),e("li",[s._v("Linux是否开启了防火墙")]),s._v(" "),e("li",[s._v("外面电脑telnet这个Linux，看这个node服务的端口是否连接上")])]),s._v(" "),e("h2",{attrs:{id:"查看linux自己的ip地址"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#查看linux自己的ip地址"}},[s._v("#")]),s._v(" 查看Linux自己的IP地址")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("ifconfig\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("h2",{attrs:{id:"外面电脑是否能ping通这台linux"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#外面电脑是否能ping通这台linux"}},[s._v("#")]),s._v(" 外面电脑是否能ping通这台Linux")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("ping 192.168.1.1\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("h2",{attrs:{id:"linux上的node-js的网站是否正常运行-端口是否正常监听"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#linux上的node-js的网站是否正常运行-端口是否正常监听"}},[s._v("#")]),s._v(" Linux上的node.js的网站是否正常运行，端口是否正常监听")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("curl localhost:8072\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("h2",{attrs:{id:"linux-是否开启了防火墙"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#linux-是否开启了防火墙"}},[s._v("#")]),s._v(" Linux 是否开启了防火墙")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("systemctl status firewalld\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("p",[s._v("将Linux启动时，防火墙策略改为关闭")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("systemctl disable firewalld\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("p",[s._v("将当前系统的防火墙服务停止")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("systemctl stop firewalld\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("h2",{attrs:{id:"外面电脑telnet这个linux-看这个node的端口是否连的上"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#外面电脑telnet这个linux-看这个node的端口是否连的上"}},[s._v("#")]),s._v(" 外面电脑telnet这个Linux，看这个node的端口是否连的上")]),s._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("telnet ip port\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("p",[s._v("在进行上面调整之后，测试还是无法访问，继续在网上查找相关资料")]),s._v(" "),e("p",[s._v("将Linux上的127.0.0.1改为 0.0.0.0，外网就可以访问了\n下一片文章会讲到")])])}),[],!1,null,null,null);e.default=n.exports}}]);