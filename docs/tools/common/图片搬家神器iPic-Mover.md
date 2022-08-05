# 图片搬家神奇：iPic Mover

## 图片搬家神奇：iPic Mover

在 Markdown 中插图很麻烦；还好，iPic 解决了这个问题。

可是，已有 Markdown 文件中的图片该如何迁移呢？

不怕，现在有了 iPic Mover :)

![]()

## iPic Mover 是什么？我需要吗？

先来看看看几个场景，你有没有遇到过？

1. 批量将本地图片上传至图床，并更新链接、删除本地图片

- 很多Markdown都支持本地图片，但很少支持上传图片至图床。
- [Typora](https://www.typora.io/)除外，因为它继承了iPicUploader，在插入本地图片时，可以调用iPic上传。

2. 更换图床

- 比如，最近流行升级至https，而原来的图床很可能不支持https，这就需要更换图床。

3. WordPress迁移至Markdown时，迁移图片

- Markdown可谓风头正劲，可WordPress也是昔日王者。将WordPress迁移至Markdown时，比较痛苦的时WordPress中上传的图片资源怎么办？

4. 压缩已有图片

- 曾经年少轻狂，上传几MB的图片，眼都不眨一下。现在看看流量账单，心疼啊。可是，要把所有文章中的图片下载、压缩、在上传、更新图片链接，麻烦啊：（

- 下个版本即将支持。。。

如果遇到过上面的麻烦，恭喜，iPic Mover就是为你准备的。


# 如何使用iPic Mover

二话不说先上图：


![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-18-006y8lVagw1fajaszqardg30ia0bc4cp-1.gif)


可以看出，只要选择Markdown所在文件夹即可，iPic Mover自动帮你：

- 找到所有Markdown文件
- 找到Markdown文件中所有图片
- 上传图片
- 更新Markdown文件中的图片链接

当然，还有几个可选项

- 迁移图片赋值文件夹或文件

  如果选定，自仅在复制的Markdown文件中更新图片链接。原有的Markdown文件将不被修改。这个主要是为了测试使用。

  注意： 强烈建议在迁移前备份原始文件

- 仅上传本地图片

  默认会将所有图片迁移至新图床。如果选定，则仅上传本地图片、不上传已经在云上的图片。

- 上传后删除本地图片文件
  如果你不希望本地餐后无用的图片，可以勾选。上传是被的本地图片文件不会被删除。


  值得注意的是，iPic Mover还可以按图片大小排序，这样可以快速找出网站中比较大的图片，必要时进行替换、或压缩、以减少网站流量、加快页面打开速度。

  # iPic Mover 是如何工作的？
除了上面介绍的，核心的，iPic Mover 是通过调用 iPicUploader，将图片上传至 iPic 当前选中的图床。具体可见：
图床神器 iPic 免费开放上传服务：iPicUploader

由于需要调用 iPic 来上传图片，iPic Mover 在运行时会检测 iPic 是否安装。如果未安装，会提示在 Mac App Store 下载。

# 下载 iPic Mover
[iPic Mover](https://apps.apple.com/cn/app/id1183822957?ls=1&mt=12)
说到最后，终于来重点了

