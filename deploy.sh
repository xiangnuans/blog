#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
# set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo '' > CNAME

git init
git add -A
git commit -m '部署coco723'

# 如果发布到 https://<USERNAME>.github.io
# git push -f https://github.com/coco723/coco723.github.io.git  master:gh-pages

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:coco723/<coco723>.git master:gh-pages

cd -