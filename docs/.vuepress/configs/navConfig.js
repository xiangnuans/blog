module.exports = [
    {
        text: "首页",
        link: "/"
    },
    {
        text: '全栈',
        items: [
            { text: 'next.js', link: '/fullStack/next' }
        ]
    },
    {
        text: '客户端',
        items: [
            { text: "react", link: '/client/react/' },
            { text: '浏览器', link: '/client/browser/' },
            { text: "webpack", link: '/client/webpack/' },
            { text: '工程化', link: '/client/frame/' },
            { text: "typescript", link: '/client/typescript/' },
            { text: "style", link: '/client/style/' },
        ],
    },
    {
        text: '服务端',
        items: [
            { text: 'egg', link: '/client/egg/' },
            { text: 'koa', link: '/client/koa/' },
            { text: "MySQL", link: '/service/mysql/' },
            { text: "ORM", link: '/service/orm/' },
            { text: "实践笔记", link: '/service/node/' }
        ]
    },
    {
        text: '其他',
        items: [
            { text: 'git', link: '/other/git/' },
            { text: "常用工具", link: '/other/tools/' },
            { text: "linux", link: '/other/linux/' },
            { text: "设计模式", link: '/other/design/' }
        ]
    }
]