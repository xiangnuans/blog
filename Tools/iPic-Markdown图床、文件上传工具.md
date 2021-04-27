# iPic-Markdown图床、文件上传工具

https://apps.apple.com/cn/app/id1101244278?mt=12

有了图床神器 iPic，不论屏幕截图、还是复制图片，都可以自动上传、保存 Markdown 格式的链接，直接粘贴插入，够懒人吧？

使用 Hexo | Heroku 或 WordPress 写博客、在公众号发文章、在知乎讨论、在豆瓣灌水、在论坛发帖、跨境做外贸电商 …

iPic 带给你从未有过的插图体验。

当然，除了图片，你可以 上传普通文件，上传方式与图片完全相同。

# 上传方式

图床工具 iPic 支持多种图片上传方式。下面我们来简单看下各个上传方式、以及分别适合在什么场景下使用。

## 1. 拖拽图片上传

拖动是比较好玩的一种上传方式。只要将图片拖到菜单栏的 iPic 图标上，松手后就可以自动上传。

![image1](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-18-006tKfTcgy1fewqw208xmg30j60aske8.gif)

可以注意到，上传时菜单栏图标也会显示上传的进度。很简洁、却很实用，不再盲目等待。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-18-006tKfTcgy1fewqweqbdrg3078014mxs.gif)

## 2. 使用服务上传图片
在 Finder 中使用 服务 上传也是很高效的方式。只要在图片上右击、然后选择服务中的 使用 iPic 上传 即可。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-18-006tKfTcgy1fewqvt4svyg30j60asay7.gif)


除了使用菜单，更高效的方式是使用快捷键。只要选中图片，然后按下 Command + U 快捷键，即可自动上传。

如果你觉得默认快捷键 Command + U 不方便，也可以在 系统偏好设置 > 键盘 > 快捷键
> 服务 中修改 使用 iPic 上传 对应的快捷键。同样，如果你的 Mac 中安装了很多程序、菜单中有很多你不需要的服务，也可以在这里进行关闭。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-18-ogb9y.png)

使用服务上传还有其他便利之处：

- 可以一次性上传多张图片
- 即使 iPic 并未运行，系统也会启动 iPic、并自动上传
注意：由于 macOS 系统更新机制的缘故，新安装 iPic 后上传服务可能未出现、或未翻译，可以等几分钟、甚至几小时后再试，iPic 上传服务就会正常显示；也可以在 终端 手动更新服务菜单：

`/System/Library/CoreServices/pbs -update`

## 3. 复制图片后上传
iPic 会自动监测剪切板的变化，当复制图片后，该图片会出现在 iPic 菜单中 待上传 区域。如果需要上传，点击菜单中该图片即可。手动上传比较适合临时上传少量图片。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-18-006tKfTcgy1fewqvevds5g30j60as7rz.gif)

除了手动点击菜单，还可以使用快捷键 Command + Shift + U 上传。当然，可以在偏好设置中修改此快捷键。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-18-3wcje.jpg)

## 4. 上传其他 App 中的图片
上述示例中主要介绍了图片文件的上传。另外，iPic 还支持支持其他程序中图片的上传。例如：

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-18-006tKfTcgy1fewra4cku6g30j60as7wh.gif)

其中，对于图片格式，常见的 jpg、png、gif 等格式都是支持。

## 上传图片相关设置

### 上传前压缩图片
可以在 iPic 的 偏好设置 中开启「上传前压缩图片」选项，目前支持压缩的图片格式：jpg、png、gif

采用有损压缩，压缩后肉眼几乎无法看出区别，却可明显降低图片尺寸。使用压缩后的图片，既可以节省图片的存储空间，还可以加快图片加载速度、节省流量。

### 上传后不播放声音
iPic 上传后会使用系统通知来提示。如果不喜欢该通知的声音，可进入 系统偏好设置 > 通知，在左侧列表选择 iPic，然后在右侧取消「播放通知的声音」。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-18-0a0rg.png)

## 图床
图床也即你选择存放图片的云服务。可以在 iPic 的 偏好设置 中添加你的图床：

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-18-897l8.png)

添加后，可以在 iPic 的菜单中选择当前使用的图床：

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-18-9cs4o.png)

目前 iPic 支持下列图床：微博图床（即默认图床）、七牛云 、又拍云、阿里云 OSS 、腾讯云 COS 、Imgur 、Flickr 、Amazon S3

## iPic 菜单

### Markdown 链接

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-18-klqxf.png)

这里有个很贴心的功能：切换普通链接、Markdown 格式链接时，如果粘贴板中有上一格式的内容，会转换后重新保存到粘贴板中。

### 图片上传记录
iPic 会保存最近上传的 15 张图片，其中最后上传的 3 张图片会出现在一级菜单中，其他的则在 更多已上传图片 中。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-18-trluz.png)

点击已上传图片，则会复制该图片的链接。

当然，可以在 更多 菜单中清空图片上传记录。

# iPic Mover
iPic Mover 可以一键将已有 Markdown 文件中所有图片迁移至新图床。批量上传图片、图床搬家，从未如此简单。

![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-10-18-006y8lVagw1fajaszqardg30ia0bc4cp.gif)

