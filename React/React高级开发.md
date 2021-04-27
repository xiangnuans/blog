# React和第三方库

# 1.  React中npm包：命令、包管理流程


- fetch
- 包管理工具
- 包管理流程
## 2. 主流开发包：moment

纯lib插件：不涉及任何UI

时间格式

```
import moment from 'moment'
// 放到全局，外部也可以使用
window.moment = moment
```

标准格式:
```
moment('2018-09-22', 'YYYY-MM-DD')
```