最近在一台新的Centos 7服务器上部署了Node服务，服务启动成功后，在Mac上访问这个网站，无法访问

解决思路：

- linux上的Node服务是否正常运行，端口是否正常监听
- 查看Linux自己的IP地址
- mac是否ping通这台Linux
- Linux是否开启了防火墙
- 外面电脑telnet这个Linux，看这个node服务的端口是否连接上

# 查看Linux自己的IP地址

```
ifconfig
```

# 外面电脑是否能ping通这台Linux

```
ping 192.168.1.1
```

# Linux上的node.js的网站是否正常运行，端口是否正常监听

```
curl localhost:8072
```

# Linux 是否开启了防火墙

```
systemctl status firewalld
```
将Linux启动时，防火墙策略改为关闭

```
systemctl disable firewalld
```

将当前系统的防火墙服务停止

```
systemctl stop firewalld
```

# 外面电脑telnet这个Linux，看这个node的端口是否连的上

```
telnet ip port
```

在进行上面调整之后，测试还是无法访问，继续在网上查找相关资料

将Linux上的127.0.0.1改为 0.0.0.0，外网就可以访问了
下一片文章会讲到
