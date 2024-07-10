# git subtree教程

关于子仓库或者说是仓库公用，git官方推荐的工具是git  subtree。我自己也用了一段时间的git subtree，感觉比git submodule好用，到那时也有一些缺点，在可接受的范围内。
所以对于仓库的公用，在git subtree与git submodule之中选择的话，我推荐git subtree。

## git subtree是什么？为什么使用git subtree

git subtree可以实现一个仓库作为其他仓库的子仓库。
![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-25-2536175251-5a0a9edfe4f93-1.png?Expires=1572002352&OSSAccessKeyId=TMP.heUEDxdmPkmf3X1S85V32iN5wfVRmVvsRfSLxEZNXALNN8yAgFaCzAYvMDYFhefpZ13acWKooKCyfpJGVViyqveuEvpEuWNBYXnPwr2DiZAew4S3a2a6D6VHMPat9C.tmp&Signature=tecdPuvaqXESHllsih6ArZ9dd8c%3D)

使用git subtree有以下几个原因：
- 旧版本的git也支持（最老版本可以到v1.5.2）.
- git subtree与git submodule不同，它不增加任何像.gitmodule这样的新的源数据文件
- git subtree对于项目中的其他成员透明，意味着可以不知道git subtree的存在。

当然，git subtree也有它的缺点，到那时这些缺点还在可以 接受的范围内：

- 必须学习新的指令（如： git subtree）
- 子仓库的更新与推送指令相对复杂。


## git subtree的使用

git subtree的主要命令有：

```
git subtree add   --prefix=<prefix> <commit>
git subtree add   --prefix=<prefix> <repository> <ref>
git subtree pull  --prefix=<prefix> <repository> <ref>
git subtree push  --prefix=<prefix> <repository> <ref>
git subtree merge --prefix=<prefix> <commit>
git subtree split --prefix=<prefix> [OPTIONS] [<commit>]
```

## 准备

我嫩先准备一个仓库叫photoshop，一个仓库叫libpng,然后我们希望把libpng作为photoshop的子仓库。photoshop的路径为https://github.com/test/photoshp.git，仓库里的文件有：

```
photoshop
    |
    |-- photoshop.c
    |-- photoshop.h
    |-- main.c
    \-- README.md
```

libPNG的路径为https://github.com/test/libpng.git，仓库里的文件有：

```
libpng
    |
    |-- libpng.c
    |-- libpng.h
    \-- README.md
```

以下操作均位于附仓库的根目录中。

## 父仓库中新增子仓库

我们执行以下inkling把libpng添加到photoshop中：

```
git subtree add --prefix=sub/libpng https://github.com/test/libpng.git master --squash
```

(--squash参数表示不拉取历史信息，而只生成一条commit信息)
执行`git status`可以看到提示新增两条commit：

执行`git push`把修改推送到远端phtotshop仓库，现在本地仓库与远端仓库的目录结构为：

```
photoshop
    |
    |-- sub/
    |   |
    |   \--libpng/
    |       |
    |       |-- libpng.c
    |       |-- libpng.h
    |       \-- README.md
    |
    |-- photoshop.c
    |-- photoshop.h
    |-- main.c
    \-- README.md
```

注意，现在的photoshop仓库对于其他项目人员来说，可以不需要知道libpng是一个子仓库。什么意思呢？

当你`git clone`或者`git pull`的时候，你拉取的是整个photoshop（包括libpng在内，libpng就相当于 photoshop里的一个普通目录）；当你修改了libpng里的内容后执行`git push`，你讲会把修改`push`到photoshop上。

也就是说photoshop仓库下的libpng与其他文件无异。

## 从源仓库拉取更新

如果源libpng仓库更新了，photoshop里的libpng如何如何拉取更新？使用git subtree pull，例如：

```
git subtree pull --prefix=sub/libpng https://github.com/test/libpng.git master --squash
```

## 推送修改到源仓库

如果在photoshop仓库里修改了libpng，然后想把这个修改推送到源libpng仓库呢？使用`git subtree push`，例如：

```
git subtree push --prefix=sub/libpng https://github.com/test/libpng.git master
```
## 简化git subtree命令

我们已经知道了`git subtree`的命令的基本用法，但是上述几个命令还是显得有点复杂，特别是子仓库的源仓库地址，特别不方便记忆。
这里我们把子仓库的地址作为一个remote，方便记忆：

```
git remote add -f libpng https://github.com/test/libpng.git
```

然后可以这样来使用`git subtree`命令：
```
git remote add -f libpng https://github.com/test/libpng.git
```


