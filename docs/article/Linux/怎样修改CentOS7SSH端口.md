# 场景

一般centos默认的ssh登陆端口是22，很容易受到攻击登陆，为了安全型考虑，最好修改一下

# 修改sshd_config端口

```
vi /etc/ssh/sshd_config
```

取消#PORT 22的注释，在下一行添加你需要修改的新端口Port 2048。（这里不删除22端口是为了防止修改后新端口无法访问，造成无法用 ssh 连接服务器）。

```
Port 22
Port 2048
```

修改保存sshd_config文件后重启sshd服务

```
systemctl restart ssh
```

退出ssh会话后，再用新的端口连接：

```
$ ssh -p 2048 root@example.com
ssh: conntect to host 0.0.0.0 port 2048: Connection refused
```

好吧，native了...对于CentOS 7这一套修改端口的方法已经不能生效了。


# 打开[SELinux](https://en.wikipedia.org/wiki/Security-Enhanced_Linux)端口

SELinux全程Security Enhanced Linux(安全强化Linux)，是MAC（Mandatory Access Control，强制访问控制系统）的一个实现，目的在于明确的知名某个进程可以访问那些资源（文件、网络端口等）

对于ssh，SELinux默认只允许22端口，我们可以用SELinux管理配置工具semanage，来修改ssh可访问的端口

**安装semanage工具**
```
$ yum provides semanage
$ yum -y install policycoreutils-python
```

**为ssh打开2048端口**

```
# 为 ssh 添加新的允许端口
$ semanage port -a -t ssh_port_t -p tcp 2048
# 查看当前 SELinux 允许的端口
$ semanage port -l | grep ssh
ssh_port_t                     tcp      2048, 22  
```

**错误处理**

当SELINUX配置为禁用状态时，使用semanage回报错提示无法读取policy文件：

```
SELinux:  Could not downgrade policy file /etc/selinux/targeted/policy/policy.30, searching for an older version.  
SELinux:  Could not open policy file <= /etc/selinux/targeted/policy/policy.30:  No such file or directory  
/sbin/load_policy:  Can't load policy:  No such file or directory
libsemanage.semanage_reload_policy: load_policy returned error code 2. (No such file or directory).  
FileNotFoundError: [Errno 2] No such file or directory  

```

修改/etc/selinux/config

```
$ vi /etc/selinux/config
SELINUX=permissive  
# 重启服务器
$ init 6
# 重启后查看 SELinux 状态
$ sestatus
# if it shows disable, you can run
$ load_policy -qi
```

**检查配置**

```
$ semanage port -a -t ssh_port_t -p tcp 2048
$ semanage port -l | grep ssh
ssh_port_t                     tcp      2048, 22  
# 重启 ssh 服务
systemctl restart sshd  
```

注：semanage不能禁用ssh的22端口

```
$ semanage port -d -t ssh_port_t -p tcp 22
ValueError: 在策略中定义了端口 tcp/22，无法删除。
```

# 配置防火墙firewalld

## 启用防火墙 && 产看防火墙状态：

```
$ systemctl enable firewalld
$ systemctl start firewalld
$ systemctl status firewalld
● firewalld.service - firewalld - dynamic firewall daemon
   Loaded: loaded (/usr/lib/systemd/system/firewalld.service; enabled; vendor preset: enabled)
   Active: active (running) since 二 2016-12-20 02:12:59 CST; 1 day 13h ago
 Main PID: 10379 (firewalld)
   CGroup: /system.slice/firewalld.service
           └─10379 /usr/bin/python -Es /usr/sbin/firewalld --nofork --nopid
$ firewall-cmd --state
running 
```

## 查看防火墙当前默认和激活zone：

```
$ firewall-cmd --get-default-zone
public  
$ firewall-cmd --get-active-zones
public  
  interfaces: eth0 eth1
```

若没有激活区域的话，要执行下面的命令

## 激活public区域，增加网卡接口

```
$ firewall-cmd --set-default-zone=public
$ firewall-cmd --zone=public --add-interface=eth0
success  
$ firewall-cmd --zone=public --add-interface=eth1
success  
```

## 为public zone永久开放2048/TCP端口

```
# 以防新端口不生效，先把 22 端口暴露
$ firewall-cmd --permanent --zone=public --add-port=22/tcp
$ firewall-cmd --permanent --zone=public --add-port=2048/tcp
success  
# 重载防火墙
$ firewall-cmd --reload
# 查看暴露端口规则
$ firewall-cmd --permanent --list-port
443/tcp 80/tcp 22/tcp 2048/tcp  
$ firewall-cmd --zone=public --list-all
public (default, active)  
  interfaces: eth0 eth1
  sources:
  services: dhcpv6-client ssh
  ports: 443/tcp 80/tcp 22/tcp 2048/tcp
  masquerade: no
  forward-ports:
  icmp-blocks:
  rich rules:
```

退出ssh后，尝试连接新端口

```
$ ssh -p 2048 root@example.com
```

成功登陆的话，就可以做收尾工作了。

# 禁用22端口

## 删除ssh允许端口

```
$ vi /etc/ssh/sshd_config
#Port 22
Port 2048  
$ systemctl restart sshd
# 用 ss 命令检查 ssh 监听的端口，没有 22 证明修改成功
$ ss -tnlp | grep ssh
LISTEN     0      128                       *:2048                    *:*      users:(("sshd",18233,3))  
```

## 防火墙移除22端口

```
$ firewall-cmd --permanent --zone=public --remove-port=22/tcp
success  
$ firewall-cmd --reload
$ firewall-cmd --permanent --list-port
443/tcp 80/tcp 2048/tcp 
```

ssh取消监听22端口，就已经配置好了，防火墙只不过是在ssh外多一层访问控制。如果要做的更好还可以将22端口的访问流量专项访问者本地：

```
$ firewall-cmd --permanen --zone=public --add-forward-port=port=22:proto=tcp:toport=22:toaddr=127.0.0.1
# 配置后重载防火墙，用 ssh -p 22 root@example.com 就会访问到自己本地的 22 端口。
```
若要删除forward配置，可以：

```
$ firewall-cmd --permanen --zone=public --remove-forward-port=port=22:proto=tcp:toport=22:toaddr=127.0.0.1
```

检验修改ssh端口是否成功：

```
$ ssh -p 22 root@example.com
# 无响应，因为转到了本地的 22 端口
# 若防火墙未 forward 连接，则会回显 "ssh: connect to host {ip} port 22: Connection refused"
$ ssh -p 2048 root@example.com
# 成功 success
```