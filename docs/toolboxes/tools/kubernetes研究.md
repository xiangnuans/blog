---
title:  kubernetes研究
autoGroup-4: K8s/docker
---

## 什么是 Kubernetes？

Kubernetes是一个可移植的，可扩展的开源平台，用于管理容器化的工作负载和服务，可促进声明式配置和自动化。它拥有一个庞大且开素增长的生态系统。 Kubernetes的服务，支持和工具广泛可用。


## 容器部署时代

容器类似于VM，但是它们具有轻松的隔离属性，可以在应用程序之间共享操作系统（OS）。因此，容器被认为是轻质的。与VM相似，容齐具有自己的文件系统，CPU，内存，进程空间等。由于它们与基础架构分离，因此可以跨云和OS分发进行移植。容齐之所以受欢迎，是因为它提供了额外的好处，例如：

- 敏捷的应用程序创建和部署：与使用VM映像相比，容器映像创建的简便性和效率更高
- 持续的开发，集成和部署：通过快速简单的回滚（由于图像不可更改），提供可靠且频繁的容器映像构建和部署。
- 开发和运营的关注点分离：在构建/发布时而不是在部署时创建应用程序容器映像，从而将应用程序与基础架构分离。
- 可观察性不仅可以显示操作系统级别的信息和指标，还可以显示应用程序的运行状况和其他信号。
- 跨开发，测试和生产的环境一致性：在便携式计算机上与在云中相同地运行。
- 云和操作系统分发的可移植性：可在Ubuntu，RHEL，CoreOS，本地，Google Kubernetes Engine和其他任何地方运行。
- 以应用程序为中心的管理：提高抽象级别，从在虚拟硬件上运行OS到使用逻辑资源在OS上运行应用程序。
- 松散耦合，分布式，弹性，解放的微服务：应用程序被分解成较小的独立部分，并且可以动态部署和管理–而不是在一台大型单机上运行的单片堆栈。
- 资源隔离：可预测的应用程序性能。
- 资源利用：高效率和高密度。

## 为什么需要Kubernetes以及它能做什么

容器是捆绑和运行应用程序的好方法。在生产环境中，您需要管理运行应用程序的容器，并确保没有停机时间。例如，如果一个容器发生故障，则需要启动另一个容器。如果系统处理此行为，会不会更容易？

这就是Kubernetes的救援方法！Kubernetes为您提供了一个可弹性运行分布式系统的框架。它负责应用程序的扩展和故障转移，提供部署模式等。例如，Kubernetes可以轻松管理系统的Canary部署。

Kubernetes为您提供：

- **服务发现和负载均衡**

Kubernetes可以使用DNS名称或使用其自己的IP地址公开容器。如果到容器流量很高，Kubernetes可以负载平衡并分配网络流量，从而使部署稳定。

- **存储编排**

Kubernetes允许您自动挂载您选择的存储系统，例如本地存储，公共云提供商等。

- **存储部署和回滚**

您可以使用Kubernetes为部署的容器描述所需的状态，它可以以受控的速率将实际状态改为所需的状态。例如，您可以自动化Kubernetes来为您部署新容器，删除现有容器并将其所有资源用于新容器

- **自动垃圾箱打包**

您为Kubernetes提供了一个节点集群，可用于运行容器化任务。您告诉Kubernetes每个容器需要多少CPU和内存（RAM）。 Kubernetes可以将容器安装到您的节点上，以充分利用您的资源。

- **自我修复的**

Kubernetes会重启失败的容器，替换容器，杀死对用户定义的运行状况检查没有响应的容器，并且在准备好服务之前不会将其通告给客户端

- **秘密和配置管理**

Kubernetes允许您存储和管理敏感信息，例如密码，OAuth令牌和ssh密钥。您可以部署和更新机密和应用程序配置，而无需重建容器映像，也无需在堆栈配置中公开机密






