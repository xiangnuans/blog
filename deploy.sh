#!/usr/bin/env sh

# 自动部署脚本
yourname="coco723"

# 构建
npm run build

# 导航到构建输出目录
cd docs/.vuepress/dist

# 发布到自定义域名
echo '${yourname}.github.io' > CNAME

git init
git remote add origin https://${REF}
git add .
git commit -m "Updated By Deploy With Build For Github Pages"

# 推到仓库的 master 分支
git push -f --quiet "https://${TOKEN}@${REF}" master:gh-pages