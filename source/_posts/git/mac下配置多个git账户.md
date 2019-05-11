---
title: mac下配置多个git账户
date: 2019-04-07 19:47:27
tags:
---
【转载】：https://segmentfault.com/a/1190000016269686
应用场景
我们经常将代码托管到github、gitlab这样的网站上。为了避免每次push代码时都要输入用户名和密码，通常会选择使用ssh协议，将公钥保存到托管网站上。在实际开发中，往往要将代码托管到多个不同的网站上。比如，公司的代码需要托管到coding上，自己的开源代码托管到GitHub上，私有代码托管到gitlab上等等，每个托管网站都对应一个git账户。默认情况下，一台电脑的Git只对应一个账户，只能往一个网站push代码，非常不便。这篇博客将介绍如何在一个Git终端中配置多个账户，同时管理多个托管网站的代码。

准备工作
首先，需要准备好对Git的全局用户进行配置。在初次安装Git时，往往会使用如下的命令配置全局用户名和邮箱：

git config --global user.name "xxx" // 配置全局用户名，如Github上注册的用户名
git config --global user.email "yyy@mail.com" // 配置全局邮箱，如Github上配置的邮箱
这个--global选项，是指这里配置的user.name和user.email是相对于全局进行配置的，即不同的Git仓库默认的用户名和邮箱都是这个值。由于需要管理多个账户，所以仅仅使用这个全局值是不够的，需要在每个仓库中单独配置。对此，有两种处理方法：

如果之前已经使用该命令进行配置，则先使用如下命令清除

git config --global --unset user.name
git config --global --unset user.email
如果不确定是否已经配置过，可以使用下面的命令查看

git config --global user.name
git config --global user.email
配置步骤
1. 对每个账户生成一对密钥
首先进入保存秘钥的目录：

cd ~/.ssh // 进入目录，该目录下保存生成的秘钥
然后，根据账户邮箱生成秘钥。例如我在GitHub上的邮箱是liugui@hust.edu.cn，则命令为：

ssh-keygen -t rsa -C "liugui@hust.edu.cn"
输入完成后，会有如下提示：

Generating public/private rsa key pair.
Enter file in which to save the key (/Users/liugui/.ssh/id_rsa):
这里要求对秘钥进行命名，默认的文件名是id_rsa。为了方便区分，我这里命名为id_rsa_github。接下来的提示都直接进行回车，直到秘钥生成。通过ls命令，可以看到刚刚生成的密钥对id_rsa_github和id_rsa_github.pub。其中id_rsa_github.pub是公钥。

同样，对于GitLab上的账户，我是用另一个邮箱注册的，按照同样的步骤生成id_rsa_gitlab的秘钥对。接下来的步骤，除额外说明外，两个账户的操作完全相同。

2. 私钥添加到本地
SSH协议的原理，就是在托管网站上使用公钥，在本地使用私钥，这样本地仓库就可以和远程仓库进行通信。在上一步已经生成了秘钥文件，接下来需要使用秘钥文件，首先是在本地使用秘钥文件：

ssh-add ~/.ssh/id_rsa_github // 将GitHub私钥添加到本地
ssh-add ~/.ssh/id_rsa_gitlab // 将GitLab私钥添加到本地
为了检验本地是否添加成功，可以使用ssh-add -l命令进行查看

3. 对本地秘钥进行配置
由于添加了多个密钥文件，所以需要对这多个密钥进行管理。在.ssh目录下新建一个config文件：

touch config
文件中的内容如下：

Host github // 网站的别名，随意取
HostName github.com // 托管网站的域名
User liugui // 托管网站上的用户名
IdentityFile ~/.ssh/id_rsa_github // 使用的密钥文件

// GitLab的配置相同
Host gitlab
HostName gitlab.com
User liugui
IdentityFile ~/.ssh/id_rsa_gitlab
4. 公钥添加到托管网站
以GitHub为例，先在本地复制公钥。进入.ssh目录，使用vim id_rsa_github.pub查看生成的GitHub公钥，全选进行复制。

登录GitHub，点击右上角头像选择settings，在打开的页面中选择SSH and GPG keys，

图片描述

在打开的页面的Key输入框中粘贴刚刚复制的公钥，title的名字自己随便去，然后点击下方的Add SSH key按钮：
图片描述

至此，托管网站的公钥添加完成。总结来说，就是针对每个托管网站分别生成一对密钥，然后分别添加到本地和托管网站。

这时候，可以测试一下配置是否成功，测试命令使用别名。例如，对于GitHub，本来应该使用的测试命令是：

ssh -T git@github.com
在config文件中，给GitHub网站配置的别名就是github，所以直接使用别名，就是

ssh -T git@github
如何使用
使用有两种情况，一种情况是从远端拉取代码到本地，一种是本地已有仓库需要与远程仓库关联。

1.如果是从远端拉取代码
选择SSH协议的复制命令，如对于GitLab上代码库test，其复制命令为

git clone git@gitlab.com:liugui/test.git
由于使用了别名gitlab，所以实际使用的复制命令应当为：

git clone git@gitlab:liugui/test.git
这种方法较为简单，修改后的代码无需额外配置，可以直接push

2. 如果是本地已有的仓库
这种情况适用于本地新建的仓库需要与远端进行关联，或者之前已经使用sourceTree等图形界面软件拷贝的仓库。进入本地仓库文件夹，需要单独配置该仓库的用户名和邮箱

git config user.name "liugui"
git config user.email "liugui@hust.edu.cn"
然后，进入本地仓库的git目录，打开config文件

cd .git // 该目录是隐藏的，ls命令不可见，但是可以直接进入，如果是新建的文件夹需要先执行git init
vim config
在config文件中，修改（config文件中已有remote "origin"信息）或者添加（config文件中不包含remote "origin"信息）分支信息：

[remote "origin"]
        url = git@gitlab:GuiLiu/test.git
        fetch = +refs/heads/*:refs/remotes/origin/*
主要是URL部分，原生的信息一般是git@gitlab.com:GuiLiu/test.git，需要将gitlab.com使用别名gitlab代替。

可以看到，仓库中的关键是要配置好用户名和邮箱，以及使用别名。使用别名的目的是为了通过别名，将本地仓库与密钥目录.ssh文件夹下的密钥进行管理，这样就完成了本地仓库使用的私钥与托管网站使用的公钥的配对，而用户名和邮箱是该仓库使用SSH协议时需要用到的信息

补充一下Coding
在关联coding上托管的代码时，遇到了一点麻烦，主要是因为别名的修改不正确，以及20端口禁用的问题导致的，所以单独记录下，.ssh目录下的config文件中的密钥信息应该为：

Host coding
HostName git-ssh.coding.net // 这个域名使用coding官网获取的，不能写coding.net
User liugui
IdentityFile ~/.ssh/id_rsa_coding
Port 443 // 20端口可能被禁用，需要使用443端口