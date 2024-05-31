module.exports = [
    {
        text: "首页",
        link: "/"
    },
    {
        text: '全栈',
        items: [
            {
                text: 'next.js',
                link: '/fullStack/next'
            }
        ]
    },
    {
        text: '客户端',
        items: [
            {
                text: 'react生态',
                items: [
                    { text: "react", link: '/react/react/' },
                ],

            },
            {
                text: '浏览器相关',
                link: '/browser/'
            },
            {
                text: '构建工具',
                items: [
                    { text: "webpack", link: '/compile/webpack/' }
                ]
            },
        ],
    },
    {
        text: '服务端',
        items: [
            {
                text: '数据库',
                items: [
                    { text: "MySQL", link: '/database/mysql/' },
                    { text: "ORM", link: '/database/orm/' }
                ]
            },
            { text: "实践笔记", link: '/node/' }
        ]
    },
    {
        text: '扩展',
        items: [
            {
                text: '基础知识',
                items: [
                    { text: "style", link: '/base/style/' },
                    { text: "typescript", link: '/base/typescript/' }
                ]
            },
            {
                text: '可视化',
                link: '/visualization/'
            },
            {
                text: "工具",
                items: [
                    { text: "常用", link: '/tools/common/' },
                    { text: "linux", link: '/tools/linux/' }
                ]
            },
            {
                text: '设计模式',
                items: [
                    { text: "设计模式", link: '/design/' }
                ]
            },
        ]
    }
]