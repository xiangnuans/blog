# 使用TravisCI构建Gitbook

## 为什么要使用Travis CI构建Gitbook？


为你的项目接入Travis CI后，可以实现你的项目完全在线自动部署，无论你在任何地方，只要能够接入到互联网，访问到GitHub，就可以更新你的电子书，同时使其自动发不到GitHub上。

特别是你的电子书需要和一些非技术类同学协作时，借助Gitbook，他可以只通过浏览器对电子书进行修改，无需在自己的电脑上偶主Gitbook环境


## 配置你步骤

创建.travis.yml文件

Travis的构建基于`.travis.yml`文件进行的，因此，为了让Travis CI能够正常构建，我们先来创建`.travis.yml`。


访问你的GitHub项目主页，点击其中的**Create new File**


在弹出的界面中填入文件名 `.travis.yml`

```yml
language: node_js

node_js:
  - "8"

cache:
  directories:
    - $HOME/.npm

before_install:
  - export TZ='Asia/Shanghai'

install:
  - npm install gitbook-cli -g
  - gitbook install

script:
  - gitbook build . ./build

branches:
  only:
    - master

deploy:
  provider: pages
  skip_cleanup: true
  github_token: $GITHUB_TOKEN
  local_dir: build
  on:
    branch: master
```

添加完成后，选择**commit new file 即可。

## 配置Travis CI

如果你想要借助Travis CI来构建，除了创建配置文件以外，还需要使用你的GitHub账号登陆Travis CI，进行一些简单的配置


访问[Travis CI](https://travis-ci.com/)官网，使用Github登陆

登陆后，点击右上角用户头像，在谭书的下拉窗口中选择**Settings。**

在下方的`Repository`列表中找到你的项目

点击项目后的**Settings**，进入到项目的界面

在项目界面中找到**More Options**，选择其中的**Settings**


进入到项目的设置界面。

在下方的**Environment Variables**中添加一个新的名为`$GITHUB_TOKEN`的环境变量，将你自己的[Personal Access Token](https://github.com/settings/tokens)填入其中，用于后续的GitHub Pages自动上传


添加完成后，再次点击**More Options**，选择其中的**Trigger Build**。

在弹出的界面中直接点击按钮开始构建

随后，你就可以等待Travis CI 的自动构建了

稍等片刻，当你发现Travis CI的构建变成绿色后，就说明已经构建完成了


此时，回到Github，点击界面中的Branc，就可以看到所有的分支了






