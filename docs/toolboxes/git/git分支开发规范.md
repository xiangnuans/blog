# git分支开发规范

## 分支管理

### 分支命名

**master分支**

- master为主分支，也是用于部署生产环境的恩智，确保master分支稳定性。
- master分支一般由develop以及hotfix分支合并，**任何时间都不能直接修改代码**


**develop分支**

- develop为开发分支，始终保持最新完成以及bug修复后的代码
- 一般开发新的功能是，feature分支都是基于develop分支创建的。

**feature分支**

- 开发新功能时，以develop为基础创建feature分支
- 分支命名：feature/开头的为特性分支，命名规则：feature/user—module、feature/cart—module

**release分支**

- release为预上线分支，发布提测阶段，会release分支代码为基准提测

> 当有一组feature开发完成，首先会合并到develop分支，进入提测，会创建release分支。如果测试过程中若存在bug需要修复，则直接由开发者在release分支修复并提交。当测试完成之后，合并release分支到master和develop分支，此时master为最新代码，用作上线。

**hotfix分支**

- 分支命名：hotfix/开头的为修复分支，它的命名规则与feature分支类似
- 线上出现紧急问题时，需要即使修复，以master分支为基线，创建hotfix分支，修复完成后，需要合并大master和develop分支

### 常见任务

**增加新功能**

```
(dev)$: git checkout -b feature/xxx            # 从dev建立特性分支
(feature/xxx)$: blabla                         # 开发
(feature/xxx)$: git add xxx
(feature/xxx)$: git commit -m 'commit comment'
(dev)$: git merge feature/xxx --no-ff
```

**修复紧急bug**

```
(master)$: git checkout -b hotfix/xxx         # 从master建立hotfix分支
(hotfix/xxx)$: blabla                         # 开发
(hotfix/xxx)$: git add xxx
(hotfix/xxx)$: git commit -m 'commit comment'
(master)$: git merge hotfix/xxx --no-ff       # 把hotfix分支合并到master，并上线到生产环境
(dev)$: git merge hotfix/xxx --no-ff          # 把hotfix分支合并到dev，同步代码

```

**测试环境代码**

```
(release)$: git merge dev --no-ff             # 把dev分支合并到release，然后在测试环境拉取并测试
```

生产环境上线

```
(master)$: git merge release --no-ff          # 把release测试好的代码合并到master，运维人员操作
(master)$: git tag -a v0.1 -m '部署包版本名'  #给版本命名，打Tag

```

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-26-1647e5710a461adc?Expires=1572090591&OSSAccessKeyId=TMP.heJb2G2gW3pqjg7JWL8K9JL78KoDgLrmAiPCt7Xs9ek2GwFbQh5q2Ryt35B3bN3ZSWgdhr3nVs4yhoCyixNbvWtbvXBUi36atWdjQd8e3RpnySy2QhWN5vszho8WR6.tmp&Signature=fnDXCFcuRQ3sh2fMC5SzoIjiogQ%3D)

## 日志规范

> 在一个团队协作的项目中，开发人员需要经常提交一些代码去修复bug或者实现新的feature。而项目中的文件和实现什么功能、解决什么问题都会渐渐淡忘，最后需要浪费之间去阅读代码。但是好的日志规范commit messages编写有帮助到我们，它也反映了一个开发人员是否是良好的协作者。

**编写良好的`commit messages`可以达到3个重要的目的：**

- 加快review的流程
- 帮助我们编写良好的版本发布日志
- 让之后的维护者了解代码里特定变化和feature被添加的原因

**目前，社区有多种commit messages的写法规范。来自Angular规范是目前使用最广的写法，比较合理和系统化。如下图：**

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-26-1647e5710a492823?Expires=1572093114&OSSAccessKeyId=TMP.heJb2G2gW3pqjg7JWL8K9JL78KoDgLrmAiPCt7Xs9ek2GwFbQh5q2Ryt35B3bN3ZSWgdhr3nVs4yhoCyixNbvWtbvXBUi36atWdjQd8e3RpnySy2QhWN5vszho8WR6.tmp&Signature=irr6n5AJtiSKeaa%2FxDuGVP5tIHo%3D)

## Commit messages的基本语法

当前业界应用的比较广泛的是 ![Angular Git Commit Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)

具体格式为：

```
<type>: <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>

```

- type: 本次commit的类型，诸如bugfix docs style等
- scope：本次commit波及的范围
- subject：简明扼要的阐述下本次commit的主旨，在原文中特意强调了几点1.使用祈使句，是不是很熟悉又陌生的一个词，来传送在此祈使句 2.首字母不要大写 3.结尾无需添加标点
- body：同样使用祈使句，在主题内容中我们需要把本次commit详细的描述以下，比如此次变更的动机，如需换行，则使用！
- footer：描述下与之惯量的issue或break change，相见案例

**type的类别说明：**

- feat：添加新特性
- fix：修复bug
- docs：仅仅修改了文档
- style：仅仅修改空格、格式缩进、都好等等，不改变代码逻辑
- refactor：代码重构，没有加新功能或者修复bug
- perf: 增加代码进行性能测试
- test：增加测试用例
- chore：改变构建流程、或者增加依赖库、工具等

### Commit messages格式要求

```
# 标题行：50个字符以内，描述主要变更内容
  #
  # 主体内容：更详细的说明文本，建议72个字符以内。 需要描述的信息包括:
  #
  # * 为什么这个变更是必须的? 它可能是用来修复一个bug，增加一个feature，提升性能、可靠性、稳定性等等
  # * 他如何解决这个问题? 具体描述解决问题的步骤
  # * 是否存在副作用、风险?
  #
  # 如果需要的化可以添加一个链接到issue地址或者其它文档
```



