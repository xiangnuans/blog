# GitlabCI CD管道配置参考

使用在每个项目中调用的YAML文件配置GitLab CI/CD管道 `.gitlab-ci.yml`

该`.gitlab-ci.yml`文件定义了管道的结构和顺序，并确定：

- 使用[GitLab Runner](https://docs.gitlab.com/runner/)执行了什么。
- 遇到特定条件时要作出什么决定。例如，当一个过程成功或失败时。


