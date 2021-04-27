# Git规范和Changelog生成

良好的Git commit规范优势：

- 加快Code Review的流程
- 根据Git Commit的元数据生成Changelog
- 后续维护者可以知道Feature被修改的原因

## 技术方案

Git提交格式：

- 统一团队Git commit日志标准，便于后续代码review和版本发布
- 使用angular的Git commit日志作为基本规范
  - 提交类型限制为：feature、fix、docs、style、refactor、pref、test、chore、revert等。
  - 提交信息分为两部分，标题（首字母不大写，末尾不要标点）、主题内（正常描述信息即可）
- 日志提交时友好的类型选择提示
  - 使用commitize工具
- 不符合要求格式的日志拒绝提交的保障机制
  - 使用validate-commit-msg工具
  - 需要同时在客户端、gitlab server hook做
- 统一changelog文档信息生成
  - 使用conventional-changelog-cli工具

## 提交格式要求

```html
<type>(scope): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

对格式的说明如下：

- type：代表某次提交的类型，比如修复一个bug还是增加一个新的feature，所有的type类型如下：

- feat： 新增feature；

- fix：修复bug

- docs：仅仅修改了文档，比如README，CHANGELOG，CONTRIBURTE等等

- style：仅仅修改了空格，格式缩进，逗号等等，不改变代码的逻辑

- refactor：代码重构，没有价新功能或者修复bug

- pref：优化相关，比如提升性能、体验

- test：测试用例，包括单元测试、集成测试等等

- chore： 改变构建流程、或者增加依赖库、工具等

- revert：回滚到上一个版本

## 本地开发阶段增加precommit钩子

安装husky

```shell

npm install husky --save-dev

```

通过commitmsg钩子校验信息

```json
"script": {
  "commitmsg": "validate-commit-msg",
  "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
},
{
  "devDependencies": {
    "validate-commit-msg": "^2.11.1",
    "conventional-changelog": "^1.2.0",
    "husky": "^0.13.1"
  }
}
```


