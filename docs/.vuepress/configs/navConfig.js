module.exports =  [
    { 
        text: "首页", 
        link: "/" 
    },
    { 
        text: "最新文章", 
        link: "/latestarticle/" 
    },
    {
        text: 'react生态',
        items: [
            { text: "react", link: '/react/react/' },
        ] 
    },
    {
        text: "工具", 
        items: [
            { text: "常用", link: '/tools/common/'},
            { text: "linux", link: '/tools/linux/'}
        ]
    },
    {
        text: '浏览器相关',
        link: '/browser/'
    },
    {
        text: '打包编译',
        items: [
            {   text: "webpack", link: '/compile/webpack/'    }
        ] 
    },
    {
        text: '可视化', 
        link: '/visualization/'
    },
    {
        text: '基础知识',
        items: [
            {   text: "style", link: '/base/style/'  },
            {   text: "typescript", link: '/base/typescript/'  }
        ] 
    },
    {
        text: 'node相关',
        items: [
            {   text: "实践笔记", link: '/node/' }
        ] 
    },
    {
        text: '设计模式',
        items: [
            {   text: "设计模式", link: '/design/'   }
        ] 
    },
    {
        text: '数据库',
        items: [
            {   text: "MySQL", link: '/database/mysql/'    },
            {   text: "ORM", link: '/database/orm/'  }
        ] 
    },
  ]