#!/usr/bin/env sh

# 自动部署脚本
yourname="coco723"

# 构建
npm run build
# 保存历史commit记录，否则每次commit之后只有一条commit信息
git clone git@github.com:${yourname}/${yourname}.github.io.git .temp
mv .temp/.git dist
rm -rf .temp
# 导航到构建输出目录
cd dist

# 发布到自定义域名
echo '${yourname}.github.io' > CNAME

git add -A
git commit -m 'deploy'

# 推到仓库的 master 分支
git push -f git@github.com:${yourname}/${yourname}.github.io.git master