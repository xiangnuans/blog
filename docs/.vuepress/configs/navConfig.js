module.exports = [
    {
        text: "首页",
        link: "/"
    },
    {
        text: '全栈',
        items: [
            { text: 'next.js', link: '/fullStack/next/' },
        ]
    },
    {
        text: '客户端',
        items: [
            { text: "react", link: '/client/react/' },
            { text: '浏览器', link: '/client/browser/' },
            { text: "typescript", link: '/client/typescript/' },
            { text: "style", link: '/client/style/' },
        ],
    },
    {
        text: '服务端',
        items: [
            { text: 'nest', link: '/service/nest/' },
            { text: 'egg', link: '/service/egg/' },
            { text: 'koa', link: '/service/koa/' },
            { text: "MySQL", link: '/service/mysql/' },
            { text: "ORM", link: '/service/orm/' },
            { text: "实践笔记", link: '/service/node/' }
        ]
    },
    {
        text: '工具箱',
        items: [
            {
                text: '构建打包',
                items: [
                    {
                        text: 'Webpack',
                        link: '/toolboxes/buildTools/webpack/'
                    },
                    {
                        text: 'Vite',
                        link: '/toolboxes/buildTools/vite/'
                    },
                    {
                        text: 'Rollup',
                        link: '/toolboxes/buildTools/rollup/'
                    },
                    {
                        text: 'Parcel',
                        link: '/toolboxes/buildTools/parcel/'
                    },
                    {
                        text: 'Gulp',
                        link: '/toolboxes/buildTools/gulp/'
                    }
                ]
            },
            { text: '工具', link: "/toolboxes/tools" },
            { text: 'git', link: '/toolboxes/git/' },
            { text: "linux", link: '/toolboxes/linux/' },
            { text: "设计模式", link: '/toolboxes/design/' },
            { text: '知识网络', link: '/toolboxes/graph/' },
        ]
    },
    {
        text: 'Web3',
        items: [
            { text: 'solidity', link: '/web3/solidity' },
            { text: 'web3.js', link: '/web3/color' },
            { text: 'ether.js', link: '/web3/ether.js' },
            { text: 'viem', link: '/web3/viem' },
            { text: 'hardhat', link: '/web3/hardware' },
        ]
    },
]