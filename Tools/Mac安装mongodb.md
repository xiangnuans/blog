# 一. 更新Homebrew包

```
brew update
```

# 二. 安装Mongodb

```
brew install mongodb
```

安装需要一些时间，默认安装在/usr/local/Cellar/mongodb/4.0.3_1(我的版本)目录下安装好了，还需要配置一下，否则是无法正常启动服务的

# 三. 配置mongodb

## 1. 创建一个db目录，用户mongodb写数据
```
mkdir -p /data/db
```
如果出现 **permission denied**，加上**sudo**命令：
```
sudo mkdir -p /data/db
```

## 2. 给**/data/db**文件夹赋予权限

```
sudo chown id -u /data/db
如果出现“illegal user name“的错误提示，这时我们可以查看当前的username并赋予权限：
$whoami
username
$ sudo chown username /data/db
```

## 3. 配置mongodb环境配置

- 打开.zshrc文件
  
```
vim ~/.zshrc
添加mongodb的安装目录到path中
export PATH = /usr/local/Cellar/mongodb/4.0.3_1/bin:${PATH}
是配置生效
source ~/.zshrc
```

- 修改mongodb配置文件，配置文件默认在/usr/local/etc下的mongod.conf：
```
dbpath = /data/db

```
- 启动mongod服务
```
mognod
```
![mongod启动](https://upload-images.jianshu.io/upload_images/9403248-6911e7d0be70456e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

当出现上图红框中的命令时，就表明服务启动成功了，侦听端口为27017，这是mongod的默认端口，在另外的一个窗口中使用mongo就可以打开客户端：
```
mongo
```
这时候酒客输入数据库命令进行操作了们必入show dbs，可以查看当前的数据库集合