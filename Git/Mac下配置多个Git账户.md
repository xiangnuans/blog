# 应用场景
 
 我们经常将代码托管到gitlab、github这样的网站，为了避免每次push代码都要输入用户名和 密码，通常回选择ssh协议，将公约保存到托管网站上。在实际开发中，往往要将代码托管到多个不同的网站上。比如公司的代码需要托管到gitlab，自己的开源代码托管到github上，每个托管站上都对应一个git账户。默认情况下，一台电脑的Git对应一个账户，只能网一个网站上push代码，非常不方便。这篇博客将介绍如何在一个终端中配置多个账户。同时管理多个托管网站的代码。


 # 准备工作

 首先，需要准备好对git的全局用户进行配置。在初次安装Git时，往往会使用如下命令配置全局用户名和邮箱。

 ```
 git config --global user.name  'xxxx'   //配置全局的用户名，比如Github上注册的yonghuming
 git config --global user.email  'xxxx'  // 配置全局邮箱，比如GitHub上配置的邮箱
```
 这个--global选项，是只这里配置的user.name和user.email是像杜预全局进行配置的，即不同的Git仓库默认的用户名和邮箱都是这个值。由于需要管理多个账户，所以仅仅使用这个全局全局值是不够的，需要在每个仓库中单独配置。对此，有两种处理方法：

 如果之前已经使用该命令进行配置，则先使用如下命令进行清楚

 ```
git config --global --unset user.name
git config --global --unset user.email
 ```

 如果不确定是否已经配置过，可以使用下面的命令查看

```
git config --global user.name
git config --global user.email
```

# 配置步骤：

## 1. 对每个账户生成一对密钥

首先进入保护密钥的目录：
```
cd ~/.ssh // 进入目录，该目录下保存生成的密钥
```

然后，根据账户邮箱生成密钥。例如我在GitHub上的邮箱是**1352118502@qq.com**，则命令为

```
ssh-keygen -t rsa -C "1352118502@qq.com"
```

输入完成后，会有如下提示：
```
Generating public/private rsa key pair.
Enter file in while to save the key (/Users/coco/.ssh/id_rsa):
```

这里要求对密钥进行命名，默认的文件是**id_rsa**。为了方便区分，我这里命名为**id_rsa_github**。接下来的提示都直接进行enter，直到密钥生成。通过**ls**命令，可以看到刚刚生成的密钥对**id_rsa_github**和**id_rsa_github.pub**。其中**id_rsa_github.pub**是公钥。

同样，对于GitLab上的账户，我是用另一个邮箱注册的，按照同样的步骤生成**id_rsa_github**的密钥对。接下来的步骤，除额外说明外，两个账户的操作完全相同。

## 2. 私钥添加到本地

SSH协议的原理，就是托管网站上使用的公钥，在本地使用私钥，这样本地仓库就可以和远程仓库进行通信。在上一步已经生成了密钥晚间，接下来需要私钥文件，首先是在本地使用密钥文件：

```
ssh-add ~/.ssh/id_rsa_github // 将GitHub私钥添加到本地
ssh-add ~/.ssh/id_rsa_gitlab // 将GitLab私钥添加到本地
```

为了检验本地是否添加成功，可以使用**ssh-add -l**命令查看 

## 3. 对本地密钥进行配置

由于添加了多个密钥文件，所以需要对这多个密钥进行管理。在.ssh目录下新建一个config文件：

```
touch config
```
文件的内容如下：

```
Host github
HostName github.com
User CoCoyh
IdentityFile ~/.ssh/id_rsa


Host gitlab
HostName gitlab.com
User CoCoyh
IdentityFile ~/.ssh/id_rsa_gitlab
```

# 4. 公钥添加到托管网站

以GitHub为例，先在本地复制公钥。进入**ssh**目录，使用**cat id_rsa_github.pub**查看生成的GitHub公钥，全选进行复制。

登陆GitHub，点击右上角头像选择**settings**，在打开的页面中选择SSH and GPG keys，至此，托管网站的公钥添加完成。总结来说，就是针对每个托管网站分别生成一对密钥，然后分别添加到本地和托管网站。这时候，可以测试一下是否成功，测试命令使用别名。例如，对于GitHub，本来应该使用的测试命令是:

```
ssh -T git@github.com
```
在config文件中，给GitHub网站配置的别名就是gitHub，所以直接使用别名，就是

```
ssh -T git@github
```