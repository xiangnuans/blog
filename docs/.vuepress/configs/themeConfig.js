const nav = require('./navConfig');
// const sidebar = require('./sidebar')；


module.exports = {
    repoLabel: "GitHub",
    docsDir: 'docs',
    repo:  "coco723/blog",
    editLinks: true, // 通过配置editLinks来设置是否出现编辑链接
    editLinkText: '发现有错误?前往GitHub指正', // 指明编辑功能的文字内容
    smoothScroll: true, // 点击左侧侧边栏,页面滚动效果,smoothScroll 选项来启用页面滚动效果,true为启动,false禁用
    displayAllHeaders: false, // 默认情况下，侧边栏只会显示由当前活动页面的标题（headers）组成的链接, 设置为 true 来显示所有页面的标题链接
    lastUpdated: "上次更新",
    nav,
    sidebar: 'auto',  // 侧边栏配置,自动生成仅包含当前页面的标题链接的侧边栏
}