## 一、travis部署配置
使用travis部署服务到GitHub服务器上，脚本

```yml
language: node_js
node_js:
  - 12.18.2
cache:
  directories:
    - node_modules
  yarn: true
before_install:
  - export TZ='Asia/Shanghai' # 设置时区
install:
  - yarn install
script:
  - yarn docs:build

deploy:
  provider: pages
  skip-cleanup: true
  local_dir: docs/.vuepress/dist
  github-token: $TOKEN
  target-branch: gh-pages
  verbose: true
  keep-history: true
  name: xiangnuans

branches:
  only:
    - master

env:
  global:
    - REF=github.com/xiangnuans/xiangnuans.git # 设置 github 地址
```

## 二、GitHub action部署配置

```yml


```