![](https://upload-images.jianshu.io/upload_images/9403248-4d9248d6fb157d02.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 前沿

Electron应用在开发以后，本地运行build只能打包相对于的环境。如在Mac下运行只能打包dmg不能兼顾其他平台。为了解决这个痛点，就有了这篇文章。

简单说一下构建和发布流程：主要是配置工具[elertron-builder](https://github.com/electron-userland/electron-builder)，配置[Travis](https://travis-ci.org/)一构建Linux和Mac应用，配置[appveyor](https://www.appveyor.com/)以构建Windows应用，当提交到GitHub代码后，CI自动拉去代码，运行 electron-builder相关命令，生成一个平台的安装包，并将安装包推送到GitHub Release中。

在使用git提交代码后，CI自动构建并发布。

# 准备条件
1. Github账户
2. Appveyor账户
3. Travis账户
4. 基于Electron-vue脚手架构建的项目（非必须）
5. 项目基于electron-builder打包（非必须）

## 配置项目
编辑本地的package.json

```
{
  "name": "electron-v2er",
  "version": "0.0.1",
  "author": "ruicky <xxx@163.com>",
  "homepage":"https://github.com/ruicky/electron-v2ex",
  "description": "An electron-vue project",
  "license": "MIT",
  "main": "./dist/electron/main.js",
  "scripts": {
    "build": "node .electron-vue/build.js && electron-builder --publish always"
    ..
  }

  ...

   "mac": {
      "icon": "build/icons/v2ex.icns",
      "category": "public.app-category.utilities"
    },
    "win": {
      "icon": "build/icons/v2ex.ico",
      "target": "nsis"
    },
    "linux": {
      "icon": "build/icons",
      "category": "Utility",
      "target": [
        "deb",
        "AppImage"
      ]
    }

    ...

```
说明：
- 其中的name（项目名称）version（项目版本）author（作者信息）description（x项目描述）license（开源协议）都需要填写，否则在编译Linux版本的时候回报错。填写或修改成自己的参数即可。可参考[Metadata]（https://www.electron.build/configuration/configuration#metadata）参数解释
- 再scripts中的build添加--publish always可参考[How to Publish](https://www.electron.build/configuration/publish#how-to-publish)里的参数解释

## 生成GitHub的GH_TOKEN
electron-builder需要GH_TOKEN（GitHub Personal access token）才有权限上传文件到GitHub Release中。可在[Personal access tokens](https://github.com/settings/tokens)页面进行生成，由于只会显示一次，注意保存好。再创建的时候只需要勾选repo->public_repo即可。

![github_tokeb.png](https://upload-images.jianshu.io/upload_images/9403248-183756982726d1f7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 配置CI

### AppVeyor
在本地项目根目录中添加文件appveyor.yml，具体可以参考一下示例配置，几乎不用修改。

```
version: 0.1.{build}

branches:
  only:
    - master

image: Visual Studio 2017
platform:
  - x64

cache:
  - node_modules
  - '%APPDATA%\npm-cache'
  - '%USERPROFILE%\.electron'
  - '%USERPROFILE%\AppData\Local\Yarn\cache'

init:
  - git config --global core.autocrlf input

install:
  - ps: Install-Product node 8 x64
  - git reset --hard HEAD
  - yarn
  - node --version

build_script:
  #- yarn test
  - yarn build

test: off
```
1. 创建项目
   - 然后打开[Appveyor](https://ci.appveyor.com/projects/new)项目页，点击左边的**NEW PROJECT**按钮，然后选择你要自动化的仓库。

2. 设置
  - 回到首页选择创建好的项目
  - 点击**Setting**Tab
  - 在**Environment**填写GH_TOKEN的值，点击页面下面的“保存”
![appveyor.png](https://upload-images.jianshu.io/upload_images/9403248-0e60ebb16fac1a56.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  - 在 Deployment 中配置部署的结果页，选择 GitHub Releases 并填写之前生成好的 GH_TOKEN，点击页面最下面的“保存”
![appveyor1.png](https://upload-images.jianshu.io/upload_images/9403248-651f498db99a8efb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Tavis

在项目的根目录创建文件 .travis.yml 然后参考下面的配置写入，大部分不用修改。

```
# Commented sections below can be used to run tests on the CI server
# https://simulatedgreg.gitbooks.io/electron-vue/content/en/testing.html#on-the-subject-of-ci-testing
osx_image: xcode8.3
sudo: required
dist: trusty
language: c
matrix:
  include:
  - os: osx
  - os: linux
    env: CC=clang CXX=clang++ npm_config_clang=1
    compiler: clang
cache:
  directories:
  - node_modules
  - "$HOME/.electron"
  - "$HOME/.cache"
addons:
  apt:
    packages:
    - libgnome-keyring-dev
    - icnsutils
    #- xvfb
before_install:
- mkdir -p /tmp/git-lfs && curl -L https://github.com/github/git-lfs/releases/download/v1.2.1/git-lfs-$([
  "$TRAVIS_OS_NAME" == "linux" ] && echo "linux" || echo "darwin")-amd64-1.2.1.tar.gz
  | tar -xz -C /tmp/git-lfs --strip-components 1 && /tmp/git-lfs/git-lfs pull
- if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then sudo apt-get install --no-install-recommends -y icnsutils graphicsmagick xz-utils; fi
install:
#- export DISPLAY=':99.0'
#- Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
- nvm install 9
- curl -o- -L https://yarnpkg.com/install.sh | bash
- source ~/.bashrc
- npm install -g xvfb-maybe
- yarn
script:
#- xvfb-maybe node_modules/.bin/karma start test/unit/karma.conf.js
#- yarn run pack && xvfb-maybe node_modules/.bin/mocha test/e2e
- yarn run build
branches:
  only:
  - master
```


1. 进入 travis官网， 点击 GitHub 登录 可自动同步项目到 travis
2. 选择要 配置的项目
3. 选择项目右边的 setting

![travis1.png](https://upload-images.jianshu.io/upload_images/9403248-38dd60af3d2aa917.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

4. 填写 GB_TOEN的值
![travis2.png](https://upload-images.jianshu.io/upload_images/9403248-42fdc3fd09aa6ac6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 总结

按照上述的配置，就能够自动化的部署了。在配置的过程中由于是 electron-vue 脚手架生成的项目，在 package.json 中有些节点没有，导致在 build linux 环境的时候报错。所以建议，按照上面的说明都配置上。


