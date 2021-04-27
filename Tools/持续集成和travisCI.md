# 持续集成和travisCI

## 持续集成的作用

优点：
- 快速发现错误
- 防止分支大幅偏离主干


核心措施是，代码集成到主干之前，必须通过自动话测试。只要有一个测试用例失败，就不能集成。

## GitHub最流行的CI

- Travis CI
- Circle CI
- Jenkins
- AppVeyor
- CodeShip
- Drone
- Semaphore CI 
- Buildkite
- Wercker
- TeamCity


## 接入Travis CI

- https://travis-ci.org/使用GitHub账号登陆
- 在https://travis-ci.org/account/respositories为项目开启
- 项目根目录下新增.travis.yml


## travis.yml内容

- install安装项目依赖
- script运行测试用例

```yml
language: node_js

sudo: false

cache:
  apt: true
  directories:
    - node_modules

node_js: stable

install:
  - npm install -D
  - cd ./test/smoke/template
  - npm install -D
  - cd ../../../

scripts:
  npm test
```

