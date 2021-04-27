# 前言

Nginx (engine x) 是一个高性能的 HTTP 和反向代理服务器，也是一个 IMAP/POP3/SMTP 服务器。。 本例演示 CentOS 7 下安装和配置 Nginx 的基本步骤。

# 环境

查看Linux环境
```
cat /etc/redhat-release 
CentOS Linux release 7.6.1810 (Core) 
```

# 步骤

## 1. 添加yum源
Nginx不在默认的yum源中，可以使用epel或者官网的yum源，本例使用官网的yum源。

```
rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm 

Retrieving http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
warning: /var/tmp/rpm-tmp.SsRR7r: Header V4 RSA/SHA1 Signature, key ID 7bd9bf62: NOKEY
Preparing...                          ################################# [100%]
Updating / installing...
   1:nginx-release-centos-7-0.el7.ngx ################################# [100%]
```

安装yum源之后，可以查看下。
```
$ yum repolist
Loaded plugins: fastestmirror
Repository nodesource is listed more than once in the configuration
Repository nodesource-source is listed more than once in the configuration
Loading mirror speeds from cached hostfile
nginx                                                    | 2.9 kB     00:00     
nginx/x86_64/primary_db                                    |  46 kB   00:02     
repo id              repo name                                            status
base/7/x86_64        CentOS-7 - Base                                      10,019
epel/x86_64          Extra Packages for Enterprise Linux 7 - x86_64       13,338
extras/7/x86_64      CentOS-7 - Extras                                       435
nginx/x86_64         nginx repo                                              152
nodesource/x86_64    Node.js Packages for Enterprise Linux 7 - x86_64        159
updates/7/x86_64     CentOS-7 - Updates                                    2,500
repolist: 26,603
```

可以发现**nginx repo**已经安装到本机了。

## 步骤二：安装
yum 安装Nginx，非常简单，一条命令
```
yum install nginx
```

## 步骤三：配置Nginx服务

设置开机启动
```
systemctl enable nginx
```

启动服务
```
systemctl start nginx
```

停止服务
```
systemctl restart nginx
```
重新加载，因为一般重新配置之后，不希望重启服务，这时可以使用重新加载。
```
systemctl reload nginx
```

## 步骤四：打开防火墙端口
默认Centos使用的防火墙firewalld是关闭http服务的（打开80端口）
```
$ sudo firewall-cmd --zone=public --permanent --add-service=http
success
$ sudo firewall-cmd --reload
success
```

打开之后，可以查看一下防火墙打开的所有服务
```
firewall-cmd --list-service
```

可以看到系统已经打开了http服务

# 反向代理

Nginx 是一个很方便的反向代理，配置反向代理可以参考[Module ngx_http_proxy_module](http://nginx.org/en/docs/http/ngx_http_proxy_module.html)。本文不做赘述

需要指出的是 CentOS 7 的 SELinux，使用反向代理需要打开网络访问权限。

```
setsebool httpd_can_network_connect 1 
```

# 绑定其他端口

Nginx 默认绑定的端口是 http 协议的默认端口，端口号为：80，如果需要绑定其他端口，需要注意 SELinux 的配置

例如：绑定 8081 端口，但是会发现无法启动，一般的报错如下
```
YYYY/MM/DD hh:mm:ss [emerg] 46123#0: bind() to 0.0.0.0:8081 failed (13: Permission denied)
```

此时需要更改 SELinux 的设置。我们使用 SELinux 的管理工具 semanage 进行操作，比较方便。

安装 semanage 使用如下命令
```
yum install policycoreutils-python
```

然后查看是否有其他协议类型使用了此端口
```
semanage port -l | grep 8081
transproxy_port_t              tcp      8081
```

返回了结果，表明已经被其他类型占用了，类型为 transproxy_port_t。

我们还要查看一下 Nginx 的在 SELinux 中的类型 http_port_t 绑定的端口
```
$ sudo semanage port -l | grep http_port_t
http_port_t                    tcp      80, 81, 443, 488, 8008, 8009, 8443, 9000
pegasus_http_port_t            tcp      5988
```

第一行 http_port_t 中没有包含 8081 这个端口。因此需要修改 8081 端口到 http_port_t 类型中。

```
$ sudo semanage port -m -p tcp -t http_port_t 8081
```

如果没有其他协议类型使用想要绑定的端口，如 8001，则我们只要新增到 SELinux 中即可。

```
$ sudo semanage port -l | grep 8001
$ sudo semanage port -a -p tcp -t http_port_t 8001
```

此时，重新启动 Nginx 即可。


[资料](https://qizhanming.com/)