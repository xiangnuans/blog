# 使用Github Actions进行版本发布

> Github Actions: Github提供的Workflow工具，基于Events提供了一个容器运行环境。

## 发布流程

主仓库发布

GitHub Config
.gitHub/main.workflow
```
## workflow
workflow "Push" {
  on = "push"
  resolves = ["workman release"]
}

workflow "Pull Request" {
  on = "pull_request"
  resolves = ["workman check"]
}

## actions
action "npm install" {
  uses = "docker://thonatos/github-actions-nodejs"
  args = "npm install"
}

action "npm ci" {
  uses = "docker://thonatos/github-actions-nodejs"
  needs = ["npm install"]
  env = {
    YUQUE_GROUP = "eggjs-dev"
    YUQUE_ENDPOINT = "https://www.yuque.com/api/v2/"
  }
  secrets = [
    "YUQUE_TOKEN"
  ]
  args = "npm run ci"
}

action "npm build" {
  uses = "docker://thonatos/github-actions-nodejs"
  needs = ["npm ci"]
  args = "npm run build"
}

## target
action "workman check" {
  uses = "thonatos/github-actions-workman@1.6.0-Marketplace"
  needs = ["npm ci"]
  args = "workman check"
  secrets = [
    "GITHUB_TOKEN",
    "NPM_TOKEN"
  ]
}

action "workman release" {
  uses = "thonatos/github-actions-workman@1.6.0-Marketplace"
  needs = ["npm build"]
  args = "workman release --releaseBranch master"
  secrets = [
    "GITHUB_TOKEN",
    "NPM_TOKEN"
  ]
}
```

