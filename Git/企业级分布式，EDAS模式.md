# 企业级分布式，EDAS模式

部署在 ECS 实例后应用仅仅处于「可用」的状态，还面临着如下问题和隐患：

迭代能力不足，无法优雅终止和快速启动应用 —— 每次重新部署都将会造成应用不可用；
健壮性不足，物理或系统出现的问题将可能导致应用不可用；
并发性不足，虽然在网站前期不会是瓶颈，但单机的模式扩容有其上限。
很容易就能想到使用容器化技术和集群模式。

这就可以应用 Docker 和 Kubernetes（以下简称 k8s），阿里云提供了容器服务 Kubernetes 版。此时应用的架构是这样：

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-04-v2-58273a1146476c535f17fe6cda09585f_hd.jpg?Expires=1572864424&OSSAccessKeyId=TMP.hfD3jMgd52o8kaW7k3hBvYKhYy7wnfVAFR54kFetBM5gPZY225moJBi7nquY14ejM8xRbktY6ESQknk7aN4TdV5WwXCpRufNnYgM2uJxUbPvTGpT1HfM5n1E6GdaYJ.tmp&Signature=FLMxFc8WV3F07fe3uak6ia%2Ft2%2BE%3D)

- 首次部署：
  - 创建 k8s 集群，将集群控制权授予 EDAS；
  - 创建镜像仓库，通过发布 git 标签触发构建镜像；
  - 创建 EDAS 应用，关联镜像，部署应用：；
  - 添加负载均衡，允许公网访问 EDAS 应用。
- 往后迭代：
  - 通过发布 git 标签触发构建镜像；
  - 访问 EDAS 应用，访问新版本镜像进行重新部署。

参考：

- [什么是 Docker？](https://link.zhihu.com/?target=https%3A//www.redhat.com/zh/topics/containers/what-is-docker)
- [什么是 Kubernetes？](https://www.redhat.com/zh/topics/containers/what-is-kubernetes)
- [什么是阿里云容器服务 Kubernetes 版？](https://help.aliyun.com/document_detail/86737.html)


以下是通过 EDAS 部署 NodeBB 的指引教程。

2.1 创建 Kubernetes 集群
首先我们需要一个 k8s 集群用于部署我们的应用。访问[创建 Kubernetes 集群：](https://cs.console.aliyun.com/#/k8s/cluster/create/dedicated)

- 地域选择“华东 1”；
- 可用区选择“可用区 G”；
- 专有网络选择和上一步“ECS 部署”的一致（因为接下来将需要连接 MongoDB）。

***参考：***

- [如何创建 Kubernetes 集群？](https://help.aliyun.com/document_detail/86488.html)：
- [如何创建 Kubernetes 托管版集群？](https://help.aliyun.com/document_detail/95108.html) > 相比于默认的 Kubernetes 集群，托管版本会主动替您运维一套高可用的 Master 组件，免去了默认版本集群中三个 Master ECS 节点，从而节约所需的资金成本及维护时的人力成本。-- [《使用 Terraform 创建托管版 Kubernetes》](https://yq.aliyun.com/articles/681954)
- [如何创建多可用区 Kubernetes 集群？](https://help.aliyun.com/document_detail/86493.html) > 为了保证业务应用的高可用，有些客户会要求关键应用部署到多个机房，一个机房一旦出问题，其他机房正常工作，从而让应用保持不间断连续运行。阿里云支持多 Region（地域），每个 Region 下又有不同的可用区。可用区是指在同一地域内，电力和网络互相独立的物理区域。多可用区能够实现跨区域的容灾能力。同时也会带来额外的网络延时。


2.2 创建 Docker 镜像
紧接着，我们需要构建出应用的 Docker 镜像。访问容器镜像服务控制台：

创建镜像仓库：

- 代码仓库选择上一步“ECS 部署”中的仓库；
- 勾选“代码变更时自动构建镜像”。

***构建镜像：***

在代码仓库的根目录下创建配置文件 config.json：

```
{
  "url": "http://xxx.taobao.com",
  "secret": "xxx",
  "database": "mongo",
  "mongo": {
    "uri": "mongodb://xxxx"
  },
  "port": "4567"
}
```

Dockerfile 中使用配置文件启动 NodeBB：

```
 FROM node:8.15.0
 RUN mkdir -p /usr/src/app WORKDIR /usr/src/app
 ARG NODE_ENV ENV NODE_ENV $NODE_ENV COPY install/package.json /usr/src/app/package.json RUN npm install && npm cache clean --force COPY . /usr/src/app
 ENV NODE_ENV=production \     daemon=false \     silent=false
 RUN ./nobebb build CMD ./nodebb start
 EXPOSE 4567
```

通过发布标签触发镜像构建：release-v$version

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-04-v2-f8f392c39943cbe68e990db36cf1d81e_r.jpg?Expires=1572864410&OSSAccessKeyId=TMP.hfD3jMgd52o8kaW7k3hBvYKhYy7wnfVAFR54kFetBM5gPZY225moJBi7nquY14ejM8xRbktY6ESQknk7aN4TdV5WwXCpRufNnYgM2uJxUbPvTGpT1HfM5n1E6GdaYJ.tmp&Signature=yKCoAJ%2BkXODs%2BCulvho27miwCvg%3D)


2.3 创建 EDAS 应用

然后我们创建一个 EDAS 应用，并使用刚创建的镜像部署该应用。访问 EDAS 控制台：

- 访问“EDAS - 资源管理 - 集群”：导入刚创建的 K8S 集群；
- 访问“EDAS - 应用管理 - 应用列表”：创建新应用：
  - 集群类型：选择“容器服务K8S集群” - 选择刚导入的 K8S 集群；
  - 镜像：选择上一步构建的镜像和版本。
- 配置应用：
  - 添加负载均衡（公网）：

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-11-04-v2-7fc62ebd5f6664668dca59f953782699_hd.jpg?Expires=1572864354&OSSAccessKeyId=TMP.hfD3jMgd52o8kaW7k3hBvYKhYy7wnfVAFR54kFetBM5gPZY225moJBi7nquY14ejM8xRbktY6ESQknk7aN4TdV5WwXCpRufNnYgM2uJxUbPvTGpT1HfM5n1E6GdaYJ.tmp&Signature=EN1UgT10%2FMoN7CU%2BrzVyjAxOnmI%3D)

- 通过负载均衡IP验证应用部署是否成功。

2.4 配置负载均衡

最后，我们在负载均衡层强制启用HTTPS，并将域名解析道负载均衡的公网IP。

访问[负载均衡控制台](https://slb.console.aliyun.com/slb/overview)操作：

- 创建证书：
  - 访问“负载均衡-实例-证书管理”
  - 点击创建证书
  - 选择“上传第三方签发证书”
  - 上传“ECS部署”章节中下载的证书

- 负载均衡配置
  - 通过IP找到对应的负载均衡实例
  - 添加HTTPS监听（参考[《如何添加HTTPS监听》](https://help.aliyun.com/document_detail/86438.html)）
    - 协议选择HTTPS
    - 监听端口输入“443”
    - 高级配置中，开启会话保持
    - SSL证书选择上一步创建的证书
    - 后端服务器选择“虚拟服务器组”
  - 删除原TCP 80的监听；
  - 添加HTTP监听
    - 协议选择“HTTP”
    - 监听端口输入“80”
    - 高级配置开启“监听转发”
    - 目的监听选择“HTTPS 443”
  - 通过HTTPS访问IP验证负载均衡配置成功；
  - 域名映射：通过IDNS将[xxx.taobao.com](https://store.taobao.com/shop/noshop.htm)A到负载均衡公网IP



