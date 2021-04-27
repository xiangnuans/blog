# Docker 常用命令

## 查看版本信息

```
# 查看docker相关信息
docker info

# 查看版本信息
docker -v 或者 docker --version

# 查看Client和Server版本信息
docker version
```

## docker run命令

Docker 允许你在容器内运行应用程序，使用**docker run**命令来在容器内运行一个应用程序。

```
docker run ubuntu:15.10 /bin/echo "Hello world"
```

各个参数解析：
- docker：Docker的为紧致执行文件。
- ubuntu:15.10指定运行的镜像，Docker首先从本地主机上查找镜像是否存在，如果不存在，Docker就会从镜像仓库Docker Hub下载公共镜像。
- /bin/echo "Hello world"，然后输出结果。
```
docker run -i -t ubuntu:15.10 /bin/bash
```

各个参数解析：
- -t: 在新容器内指定一个伪终端或终端
- -i: 允许你对容器内的标准输入（STDIN）进行交互
- -d: 让容器在后台运行
- -P：将容器内部使用的网络端口映射到我们使用的主机上
- 可以通过-p参数来奢姿不一样的端口

## docker 查看命令

```
# 查看当前运行的容器
docker ps

# 查看所有容器，包括停止的
docker ps -a

# 查看最新创建的容器，只列出最后创建的
docker ps -l

# 查看网络端口
docker port [容器ID|容器名]

# 查看容器内部的标准输出
docker logs [容器ID|容器名]

# 查看容器内部运行的进程
docker top [容器ID|容器名]

# 查看 Docker 的底层信息。它会返回一个 JSON 文件记录着 Docker 容器的配置和状态信息
docker inspect [容器ID|容器名]
```

## docker stop 命令

```
docker stop [容器ID|容器名]
```

## 启动命令

```
已经停止的容器
docker start [容器ID|容器名]
正在运行的容器，
docker restart [容器ID|容器名]
```

## docker rm命令
```
# 删除容器，删除容器时，容器必须是停止状态
docker rm [容器ID|容器名]

# 删除所有的容器
docker rm $(docker ps -aq)
```

# Docker 容器使用

## Docker 客户端
直接输入**docker**命令来查看到Docker客户端的多有命令
通过命令 docker command --help 更深入的了解指定的 Docker 命令使用方法

# Docker镜像使用

当运行容器时，使用的镜像如果在本地中不存在，docker 就会自动从 docker 镜像仓库中下载，默认是从 Docker Hub 公共镜像源下载

## 列出镜像列表
```
# 列出本地主机上的镜像
~ docker images
REPOSITORY      TAG           IMAGE ID            CREATED             SIZE
ubuntu          15.10         9b9cb95443b5        2 years ago         137MB
training/webapp latest        6fae60ef3446        3 years ago         349MB
```

各个选项说明:

- REPOSITORY：表示镜像的仓库源
- TAG：镜像的标签
- IMAGE ID：镜像ID
- CREATED：镜像创建时间
- SIZE：镜像大小

同一仓库源可以有多个 TAG，代表这个仓库源的不同个版本，如ubuntu仓库源里，有15.10、14.04等多个不同的版本，我们使用 REPOSITORY:TAG 来定义不同的镜像

```
 ~ docker run -t -i ubuntu:15.10 /bin/bash
 root@6939a46db5bb:/#
```
如果不指定一个镜像的版本标签，例如只使用 ubuntu，docker 将默认使用 ubuntu:latest 镜像

## 获取一个新的镜像

当我们在本地主机上使用一个不存在的镜像时 Docker 就会自动下载这个镜像。如果我们想预先下载这个镜像，我们可以使用 docker pull 命令来下载它

## 查找镜像

```
# 搜索镜像
docker search 镜像名
```

资料
- [阿里云镜像仓库](https://yq.aliyun.com/articles/708929?spm=a2c4e.11155472.0.0.35fd752dWuzVbf)
- [https://juejin.im/post/5b62d0356fb9a04fb87767f5#heading-3](https://juejin.im/post/5b62d0356fb9a04fb87767f5#heading-3)
- [https://yeasy.gitbooks.io/docker_practice/image/pull.html](https://yeasy.gitbooks.io/docker_practice/image/pull.html)
