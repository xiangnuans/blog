# 如何解决 npm unmet peer dependency

我在 Mac 系统上，yarn 安装依赖包，出现以下告警

```
 UNMET PEER DEPENDENCY @webpack ....
```

npm 不再安装对等项依赖项，因此您需要手动安装对等项依赖项，只需 `npm install` 对所需的 deps 进行操作，然后尝试再次安装主要对等项。
