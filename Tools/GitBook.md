# 概述
GitBook是使用Github/Git和Markdown构建漂亮书籍的命令行工具。
GitBook 可以将宁的内容作为网站（可定制和可扩展）或电子书（PDF，ePub和Mobi）输出。
[GitBook.com](https://www.gitbook.com/)是使用GitBook格式创建和托管图书的在线平台。它提供托管，协作功能和易于使用的编辑器

# 一、GitBook 安装

## 本地安装（以Mac系统为例）

通过**NPM**安装，
```
npm install gitbook-cli -g
```

gitbook-cil 是GitBook的一个命令行工具。它将自动安装所需版本的GitBook来构建一本书。

安装历史版本命令

```
gitbook fetch beta

```
列举可以下载的版本

```
gitbook ls-remote
```

## GitBook服务搭建

初始化

```
gitbook init
```

构建
```
gitbook build
```
执行命令会在项目的目录下生成一个_book目录，里面的内容为静态站点的资源文件：

Debugging
您可以使用选项**--log=debug** 和 **--debug**来获取更好的错误信息（使用堆栈跟踪器）。例如：
```
gitbook build ./ --log=debug --debug
```

启动服务
```
gitbook serve
```

使用下面命令会运行一个web服务，预览书籍

# 二、GitBook命令

这里主要介绍一下常用的几个命令

生成指定gitbook的版本，本地没有会先下载
```
gitbook build --gitbook=2.0.0
```

列出本地所有gitbook版本

```
gitbook ls
```

列出远程所有gitbook版本

```
gitbook ls-remote
```

安装对应的gitbook版本
```
gitbook fetch 标签/版本号
```

更新到最新的版本
```
gitbook update
```

卸载对应的版本
```
gitbook uninstall 2.0.1
```

指定log的级别
```
gitbook build --log=degbug
```

输出错误信息
```
gitbook build --debug
```

# 三、GitBook 目录结构

## GitBook 项目结构
GitBook使用简单的目录结构。在SUMMERY.md文件，中列出的所有Markdown文件将被转换为HTML。多语言书籍结构略有不同。

一个基本的GitBook电子书结构通常如下：

```
.
├── book.json
├── README.md
├── SUMMARY.md
├── chapter-1/
|   ├── README.md
|   └── something.md
└── chapter-2/
    ├── README.md
    └── something.md
```
文件说明：
| 文件名 | 描述 |
|---|---|
| book.json | 配置数据（optional） |
| README.md | 电子书的前沿或简介（required） |
| SUMMERY.md | 电子书目录（optional） |
| GLOSSARY.md | 词汇/注释语列表（optional） |

## 静态文件和图片

静态文件是在SUMMARY.md中未列出的文件。除非被忽略，否则所有静态文件都将复制到输出路径。

## 忽略文件或文件夹

GitBook将读取.gitignore, .bookignore和.ignore文件，一获取要过滤的文件和文件夹。这些文件夹中的格式遵循.gitignore的规则：

```
# This is a comment

# Ignore the file test.md
test.md

# Ignore everything in the directory "bin"
bin/*
```

## 项目与子目录集成

对于软件项目，您可以使用子目录（如 **/docs**）来存储项目文档的图书。您可以配置根选项来指示GitBook可以找到该图书文件的文件夹：

```
.
├── book.json
└── docs/
    ├── README.md
    └── SUMMARY.md
```

在 **book.json**中配置以下内容：
```
{
  "root": "./docs"
}
```

## 页面

MarkDown 语法

默认情况下，GitBook的大多数文件都使用Markdown语法

## Glossary

允许您指定要显示为注释的术语及其各自的定义。根据这些术语，Gitbook将自动构建索引并突出显示这些术语。

# 四、GitBook 配置

## 常规设置

| 变量 | 描述 |
|---|---|
| root | 包含所有图书文件的根文件夹的路径，除了 book.json |
| structure | 指定自述文件，摘要，词汇表等的路径，参考 Structure paragraph. |
| title | 您的书名，默认值是从 README 中提取出来的。在 GitBook.com 上，这个字段是预填的。 |
| description | 书籍的描述，默认值是从 README 中提取出来的。在 GitBook.com 上，这个字段是预填的。 |
| author | 作者名。在GitBook.com上，这个字段是预填的 |
| isbn | 国际标准书号 ISBN |
| direction | 文本阅读顺序。可以是 rtl （从右向左）或 ltr （从左向右），默认值依赖于 language 的值。 |
| gitbook | 应该使用的GitBook版本。使用 SemVer 规范，并接受类似于 “> = 3.0.0” 的条件。 |

- links
在左侧导航栏添加链接信息
```
"links" : {
    "sidebar" : {
        "Home" : "https://github.com/dunwu/gitbook-notes"
    }
}
```

- styles
自定义页面样式，默认情况下各generator对应的CSS文件
```
"styles": {
    "website": "styles/website.css",
    "ebook": "styles/ebook.css",
    "pdf": "styles/pdf.css",
    "mobi": "styles/mobi.css",
    "epub": "styles/epub.css"
}
```

## plugins
插件及其配置在**book.json**中制定。有关详细信息。

自3.0.0版本开始，GitBook可以使用主题。有关详细信息，请参阅[the theming section](https://docs.gitbook.com/v2-changes)

| 变量 | 描述 |
|---|---|
| plugins | 要加载的插件列表 |
| pluginsConfig | 插件的配置 |
添加插件之后运行**gitbook install**来安装新的插件

## 去除自带插件

GitBook默认自带5个插件
- highlight
- search
- sharing
- font-settings
- liverload

```
"plugins": {
  "-search"
}
```
## structure

除了**root**属性之外，您可以指定Readme，Summary，Glossary和Language的名称（而不是使用默认名称，如README.md）。这些文件必须在项目的根目录下（或**root**根目录，如果你在book.json中配置了root属性）。不接受的路径，如**dir/MY_README.md**

| 变量 | 描述 |
|---|---|
| structure.readme | Readme文件名（默认值是README.md） |
| structure.summary | Summary文件名(默认值是SUMMARY.md) |
| structure.glossary | Glossary文件名（默认值是GLOSSARY.md） |
| structure.language | LANGUAGE文件名(默认值是LANGUAGE.md) |

## PDF 
可以使用**book.json**中的一组选项来定制PDF输出：
| 变量 | 描述 |
|---|---|
| pdf.pageNumbers | 将页码添加到每个页面的底部（默认为true） |
| pdf.fontSize | 基本字体大小（默认是12） |
| pdf.fontFamiliy | 基本字体样式（默认是Arial） |
| pdf.pageSize | 页面尺寸，选项有（'a0', 'a1', 'a2', 'a3','a4', 'a5', 'a6', 'b0', 'b1', 'b2', 'b3', 'b4', '5', 'b6', 'legal', 'letter'）默认值是a4 |
| pdf.margin.top | 上边界（默认值是56） |
| pdf.margin.bottom | 下边界（默认值是56） |
| pdf.margin.right | 右边界（默认值是62） |
| pdf.margin.left | 左边界（默认值是62） |

# 五、生成电子书
GitBook可以生成一个网站，但也可以输出内容过作为电子书（ePub，Mobi,PDF）
```
# Generate a PDF file
$ gitbook pdf ./ ./mybook.pdf

# Generate an ePub file
$ gitbook epub ./ ./mybook.epub

# Generate a Mobi file
$ gitbook mobi ./ ./mybook.mobi
```

安装ebook-convert
ebook-convert 可以用来生成电子书（epub, mobi, pdf）

## OSX
下载 Calibre application。将 calibre.app 移动到应用程序文件夹后，创建一个符号链接到**eBook-convert**工具：
```
sudo ln -s ~/Applications/calibre.app/Contents/MacOS/ebook-convert /usr/bin
```
你可以使用$PATH中的任何目录替换 **/usr/bin**


## 封面

封面用于所有电子书格式，你可以自己提供一个，也可以使用**autocover plugin**将指定一个较小版本的封面。封面应为JPEG文件。

好的封面应该遵守以下准则：
- cover.jpg的尺寸为1800*2360像素，cover_small.jpg 为200*262
- 没有边界
- 清晰可见的书名
- 任何重要的文字应该在小版本中可见
  
# GitBook 部署

## 托管到 gitbook.com
[GitBook.com](https://www.gitbook.com)是使用GitBook格式创建和托管图书的在线平台。它提供托管，协作功能和抑郁使用的编辑器。

创建组织
![](../public/images/gitbook1.png)

设置组织
![](../public/images/gitbook2.png)

在组织中新建space
![](../public/images/gitbook3.png)
注：免费的GitBook一个组织下只能新建一个space

点击新建好的space->INTEGRATIONS
![](../public/images/gitbook4.png)

这里我用的GitHub(在GitHub上选择已经新建好的仓库关联)
![](../public/images/gitbook5.png)

只要你指定的GitHub仓库中的文档内容符合GitBook规范，GitBook就会自动根据你的梅西更新区构建生成电子书网站。默认访问地址是
```
https://新建的组织名.gitbook.io/space名/
```
例如：我刚刚新建的组织名为test-coco，space名为test，则访问的路径是
https://test-coco.gitbook.io/test/

## 托管到GitHub Pages
也许你以前也了解GitHub的一个功能：GitHub Pages。它允许用户在GitHub仓库托管你的个人、组织或项目的静态页面（自动识别html、css、javascript）。

- 建立xxx.github.io仓库
要使用这个特性，首先，你必须建立一个严格遵循以下命名要求的仓库：**GitHub用户名.github.io举例，我的GitHub账号CoCoyh，则这个仓库应该叫CoCoyh.github.io。通常，这个仓库被用来作为个人或组织的博客。

- 建立gh-pages分支
  
完成第一步后，在任意一个GitHub仓库中建立一个名为**gh-pages** 的分支。只要gh-pages中的内容符合一个静态站点要求，就可以在如下地址中进行访问：“https://Github用户名.github.io/GitHub 仓库”。例如我的一个GitHub仓库名为notes，则访问路径是"https://CoCoyh.github.io/notes"

- 自动发布到gh-pages
  
如果每次都手动git push 到远程分支，略有点麻烦。

如果你了解Nodejs，那么简单的发布方式就是使用gh-pages 插件
现在本地安装插件
```
npm i -D gh-pages
```
然后，在package.json文件中添加脚本命令：
如下：-d 命令参数 后面是要发布的静态站点内容目录

```
"scripts": {
  "deploy": "gh-pages -d build"
},
```

- 命令
  
```
git add .
git commit -am "Update"
git push git@github.com:CoCoyh/notes.git gh-pages --force"
```









