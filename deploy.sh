#!/usr/bin/env sh

set -e

vuepress build

cd docs/.vuepress/dist


git init
git remote add origin https://${REF}
git add .
git commit -m "Updated By Deploy With Build For Github Pages"
git push --force --quiet "https://${TOKEN}@${REF}" master:gh-pages

cd -