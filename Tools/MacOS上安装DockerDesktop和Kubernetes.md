# MacOS上安装Docker Desktop和Kubernetes


相关链接：

https://www.docker.com/products/docker-desktop
https://kitematic.com/


https://github.com/docker/kitematic/releases

## 安装Docker Desktop

首先要做的就是下载[Docker Desktop.dmg](https://download.docker.com/mac/stable/Docker.dmg)文件，将该文件保存到硬盘后，打开Finder并导航到包含下载文件夹，找到并双击Docker.dmg文件。DO乘客人窗口代开后，点击Docker图标并将其拖动到应用程序文件夹

![](https://mmbiz.qpic.cn/mmbiz_jpg/A1HKVXsfHNnYOq4vqibTWADNNFJo9mRmG7k3tFhLNibJ8Vg49IwFuvJScBN5QEFNuOUfmJ5LJdfRLrqdNnWQRfKA/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

完成Docker Desktop的安装后，你将在顶部面板上看到一个新图标。点击该图标以显示Docker Desktop菜单。

![](https://mmbiz.qpic.cn/mmbiz_jpg/A1HKVXsfHNnYOq4vqibTWADNNFJo9mRmGcF97uVicttmqfx8kfibSh80ouTFs8NvS5dr5D0IuuIdJiadOLyr0Cq5MA/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

现在你完成准备可继续安装更多组件


## 安装Kitematic

对于那些不想完全依赖命令行的人来说，有Kitematic GUI共使用。在安装Kitematic之前必须安装Git。要安装Git，需先下载[安装程序](https://git-scm.com/download/mac)。下载后找到该文件，双击安装程序，然后按照简单的指引说明进行操作。

完成安装Git后即可安装Kitematic。虽然Docker Desktop菜单中有一个用于Kitematic安装的菜单，但请不要使用它，因为它不能成功安装Kitematic。我们需要从GitHub[5]下载最新版本的Kitematic。下载完成后同样双击安装，然后完成简单的说明。

此时，请确保点击Docker Desktop图标并单击Sign-in菜单。使用Docker Hub用户凭证登陆以将Docker Desktop关联到你的镜像存储库。


## 安装kubernetes

下一个技巧，我们将安装Kubernetes对Docker Desktop的支持。为此，请点击Docker Desktop图标并选择“Preferences”。在打开的窗口中，点击Kubernetes选项卡。

![](https://mmbiz.qpic.cn/mmbiz_jpg/A1HKVXsfHNnYOq4vqibTWADNNFJo9mRmGtYZBxVMLa8ZPuU2wkZ1kLerntoyD0wBY3CgHvtV2m548I5wv1uXm6Q/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)


单击“Enable Kubernetes”复选框。你还可以选择启用Kubernetes作为Docker Stacks的默认部署工具并显示系统容器。点击“Apply”将出现一个弹出窗口，提醒你安装需要网络连接且需要一些时间。


![](https://mmbiz.qpic.cn/mmbiz_jpg/A1HKVXsfHNnYOq4vqibTWADNNFJo9mRmGt7mHphLIQfQJAs9VRdsVgEdWeC2ebX9WRFEibiarrJdnicPk42GqpNCog/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

单击“Install”后安装将开始并结束。安装完成后你应该能看到Docker Engine和Kubernetes都处于运行状态。

![](https://mmbiz.qpic.cn/mmbiz_jpg/A1HKVXsfHNnYOq4vqibTWADNNFJo9mRmGzpaLmysgfWVgrKrQ8doyQK3mwHQ2jUk8uriaTGTrMaGP3sszzmQet9Q/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

在我们继续之前，我们先来测试并确保Kubernetes正常运行。打开终端并敲入命令：

![](https://mmbiz.qpic.cn/mmbiz_jpg/A1HKVXsfHNnYOq4vqibTWADNNFJo9mRmGDEs0okiafaQrcXmbiaArMib8U2K8hZj95Y8phibxfvGb6tfjg6ibNh04uXA/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)


这是令人困惑的地方。你实际上并未使用Docker Desktop来处理容器。Docker Desktop让你可以轻松访问这些可以让你开发和部署容器的工具。例如你现在可以像使用Linux一样打开终端窗口并开始使用Docker命令。你可以拉取镜像，修改镜像，推送镜像，部署容器等。

或者你可以选择使用Kitematic。要打开Kitematic，请单击Docker Desktop图标，然后单击Kitematic。首次运行该工具时，你将需要为其提供辅助功能。在“安全和隐私”窗口中，确保单击与Kitematic关联的复选框。

![](https://mmbiz.qpic.cn/mmbiz_jpg/A1HKVXsfHNnYOq4vqibTWADNNFJo9mRmGuq84JOnt7ibshM6vMQo9aKnOLPdRjkNByCEBoNKuVUYyfZVmDuHKXNQ/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

GUI将打开，请求你的Docker Hub登陆凭据。

![](https://mmbiz.qpic.cn/mmbiz_jpg/A1HKVXsfHNnYOq4vqibTWADNNFJo9mRmGMr5Gzt0UOc2WLS3eVH4lQerMXqsDtUNqMNlCqEljq0nYf2VicQbs0YA/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)

登录后，你将看到包含存储库的选项卡，以及镜像，推荐镜像等等。

![](https://mmbiz.qpic.cn/mmbiz_jpg/A1HKVXsfHNnYOq4vqibTWADNNFJo9mRmGjSfe7exFW0hcyk7EFnFKHyCMcYsfDjI68vs5LtPp9IZjZMWA6udDZA/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1)


你现在可以从一个方便的GUI工具开始处理镜像和部署容器。下载你想要使用的镜像，按照你的需求修改并进行部署。

至于Kubernetes，它全部通过命令行处理，除非你安装例如Kubernetic的第三方工具。好消息是，既然你已经在Mac上运行了Kubernetes，那么困难的部分就会得到解决。只需安装第三方GUI工具，你就可以开始使用Kubernetes实例了。通过Kubernetic等工具，你可以轻松创建Pod，Service，Ingress，Deployment等，而无需使用终端窗口。当然如果你想认真学习Docker和Kubernetes，你也应该使用命令行且多加练习。
