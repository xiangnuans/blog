---
title: 服务器中启动服务的时候的IP选择
autoGroup-7: Linux
---

## 场景

在centos的服务器中，启动了一个node服务，对于IP选择，之前时127.0.0.1，结果外网无法访问，改用0.0.0.0  外网就可以访问了，要去搞清楚两者的区别

## 127.0.0.1 VS 0.0.0.0

- 127.0.0.1是回环地址
- 0.0.0.0是一个不可路由的元地址，用于指定无效，未知或不使用的目标（‘无特定地址’占位符）

在路由目的的上下问中它通常表示默认路由

在服务器的上下文中，0.0.0.0考试本地计算机上的所有IPv4地址。如果主机有两个IP地址192.168.1.1和10.1.2.1，并且服务器上运行的服务器侦听0.0.0.0，则可以在这两个Ip上访问它。

**什么是IP地址127.0.0.1？**

127.0.0.1是回环Internet协议（IP）地址，也称为localhost。该地址用于建立与最终用户使用的同一台机器或计算机的IP连接

对于使用:: 1的内涵支持IPv6寻址的计算机，定义了相同的约定。使用地址127.0.01建立连接是最常见的做法；但是看，使用127 ...*范围内的任何IP地址将以相同或相似的方式运行。会还构造使计算机或设备能够联网在机器上验证火箭里IP栈的能力。

**特别地址**

A类网络号127被分配了换回功能，即，由更高级协议发送到网络127地址的数据报文应该在主机内回送。发送到网络127地址的数据报文不应该出现在任何网络上的任何地方

**如果是全A级，那么最后三个八位的其他任意值的重点是什么？**

回环范围的目的是测试主机上的TCP/IP协议实现。由于较低层是短路的，因此发送到回环地址允许有效地测试叫高层（IP和以上），而不会在较低层出现问题。
127.0.0.1是最常用于测试目的地地址

**什么是IP地址0.0.0.0？**

0.0.0.0是有效的地址语法。因此，无论在传统的点分十进制表示法中使用IP地址，它都应该解析为有效。解析并转换为可操作的数字形式后，其值将决定接下来会发生什么

全零值确实具有特殊含义。因此它是有效的，但对于特定情况，其含义可能不合适（因此被视为无效）。它基本上是'无特定地址'的占位符。对于诸如网络连接的地址绑定之类的事情，结果可以是为连接分配适当的接口地址。如果您使用它来配置接口，则可以从接口中删除地址。这取决于使用的上下文来确定“没有特定地址”真正做什么。

在路由条目的上下文中，它通常表示默认路由。结果发生了更多的地址掩码，它选择要比较的位。掩码0.0.0.0不选择任何位，因此比较将始终成功。因此，当配置这样的路由时，总会有一些数据包要去（如果配置了有效的目的地）。

在某些情况下，仅“0”也可以起作用并具有相同的效果。但这不能保证。0.0.0.0表单是说“没有特定地址”的标准方式（在IPv6中是:: 0或只是::）。

在Internet协议版本4中，地址0.0.0.0是一个不可路由的元地址，用于指定无效，未知或不适用的目标。对于无效的数据片段赋予特殊含义的是带内信令的应用。

在服务器的上下文中，0.0.0.0表示本地计算机上的所有IPv4地址。如果主机有两个IP地址，192.168.1.1和10.1.2.1，并且主机上运行的服务器侦听0.0.0.0，则可以在这两个IP上访问它

在路由环境中，0.0.0.0通常表示默认路由，即通向Internet的“其余部分”而不是本地网络某处的路由。

用途包括：

- 主机在尚未分配地址时声明为自己的地址。例如在使用DHCP时发送初始DHCPDISCOVER数据包。
- 如果主机的IP堆栈支持，则当通过DHCP的地址请求失败时，主机为自己分配的地址。在现代操作系统中，这种用法已被替换为APIPA机制。
- 一种指定任何IPv4主机的方法。在指定默认路由时以此方式使用它。
- 一种明确指定目标不可用的方法。资料来源： [127.0.0.1 - 它的用途是什么，为什么重要？](http://www.tech-faq.com/127-0-0-1.html)
- 一种指定任何IPv4地址的方法。在配置服务器时（即绑定侦听套接字时）以此方式使用它。TCP程序员将其称为INADDR_ANY。[ bind（2）绑定到地址，而不是接口。]
  
在IPv6中，全零地址写为::

## 总结

127.0.0.1: 是个（特殊的）IP地址，往往被分配给了loopback或仅局域网可以访问的接口local-only interface

这是一个伪造的，假的，网络适配器，其只能与同主机host内通信

常用于：让一个可以支持网络的程序，仅仅响应与同主机host内的客户端

一个程序侦听127.0.0.1的话，则只能接受来自本地的访问

localhost：往往是127.0.0.1这个IP地址的主机名hostname

- Linux中是/etc/hosts设置的
- 试试ping localhost，则回输出：127.0.0.1


0.0.0.0: 本身包含很多方面的含义，但是此处指的是：
当一个服务器监听这个IP地址的话，意味着：监听所有的网络请求

（对应这IP地址为127.0.0.1的）loopback这个适配器adapter的请求，就像其他本机中的其他的网络适配器一样。


- 127.0.0.1: loopback地址，和localhost一样，
  - localhost: 是127.0.0.1的主机名

- 0.0.0.0: 是个不可被路由的元地址，用于指定无效的，未知的，不可使用的目标，相当于： 没有特定的IP地址的占位符
 - 对于路由入口来说：往往指的是默认的路由
 - 对于服务器来说：意味着本机中的所有IPv4的地址
 - 如果一个服务器有两个IP地址： 192.168.1.1和10.1.2.1，则本机中的一个服务监听0.0.0.0的话，则两个IP地址都可以访问该服务