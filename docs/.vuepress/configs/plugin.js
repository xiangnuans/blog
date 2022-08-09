const secret = require("./secretKey")

module.exports = [
    '@vuepress/back-to-top', // 返回到到顶部插件
    '@vuepress/nprogress', // 进度条插件
    'reading-progress', // 阅读进度插件
    'img-lazy', // 图片的懒加载
    'vuepress-plugin-baidu-autopush', // 注入百度url-auto-push脚本，以优化您的百度SEO网站
    'vuepress-plugin-smooth-scroll', // 你的 VuePress 站点中使用平滑滚动
    'vuepress-plugin-table-of-contents', // 为你的 VuePress 站点增加目录组件,支持在md和vue中写<TOC />,生成目录树
    'element-ui', // 添加element-ui组件
    'flowchart', // 流程图表
    'demo-code', // 在线写demo
    // 'vuepress-plugin-element-tabs', // tab切换
    [
        '@vuepress/active-header-links',
        {
          // 页面滚动时自动激活侧边栏链接的插件配置
          sidebarLinkSelector: '.sidebar-link',
          headerAnchorSelector: '.header-anchor',
        },
    ],
    [
        '@vuepress/medium-zoom',
        {
        selector: '.medium-zoom', // 指定含有medium-zoom的类缩放,后面这个类名可自定义,markdown中的img的class类保持一致就可以了的,没有指明的图片类将不支持缩放
        delay: 1000, // 延迟1秒
        options: {
            margin: 24,
            scrollOffset: 0,
        },
        },
    ],
    [
        '@vuepress/pwa', // 以@开头的都是官方维护的插件, pwa配置
        {
          serviceWorker: true, // 如果设置为 true，VuePress 将自动生成并注册一个 Service Worker，用于缓存页面的内容以供离线使用（仅会在生产环境中启用）
          updatePopup: {
            '/zh/': {
              message: '发现有新的内容更新,马上更新',
              buttonText: '刷新',
            },
          },
        },
    ],
    [
        'vuepress-plugin-auto-sidebar',
        {
          titleMode: 'titlecase', // 标题模式
          collapsable: {
            open: true
          }, // 设置为true,开启折叠
          // sidebarDepth: 0, // 标题的深度
          collapseList: [
            // 折叠的路由列表
            // "/frontend/css/"
          ],
          uncollapseList: [
            // 不折叠的路由列表
          ],
        },
    ],
    [
        // 添加谷歌分析
        '@vuepress/google-analytics',
        {
          ga: secret.googleGa, // UA-00000000-0
        },
    ],
    [
        {
          // 右边固定栏
          name: 'page-plugin',
          globalUIComponents: [
            'global-AttionFixed',
            'global-ToBottom',
            'global-RightBar',
            'global-Cat',
            'global-Copy',
            // 'global-AdvertiSpace',
          ],
        },
    ],
    [
        // 使VuePress站点支持简洁链接,而不是/xx.html
        'vuepress-plugin-clean-urls',
        {
          normalSuffix: '/',
          indexSuffix: '/',
          notFoundPath: '/404.html',
        },
    ],
    // [
    //     'meting',
    //     {
    //       metingApi: 'https://api.injahow.cn/meting/',
    //       // metingApi: 'https://meting.sigure.xyz/api/music',
    //       meting: {
    //         //auto: 'https://music.163.com/#/playlist?id=784399723'
    //         // 网易
    //         server: 'netease',
    //         // 读取歌单
    //         type: 'playlist',
    //         mid: '784399723'
    //         // mid: '1300310,31654455,4022088,29717271,2061739,3934523,28263314,29577767,28949412,34749433,32102855,41630476,5042951,31010566,41630480,2061724,34690640,3935176,32526653,28283167',
    //       },
    //       // 不配置该项的话不会出现全局播放器
    //       aplayer: {
    //         // 是否开启吸底模式
    //         fixed: true,
    //         // 是否开启迷你模式
    //         mini: true,
    //         // 自动播放
    //         autoplay: false,
    //         // 设置播放器的初始循环模式
    //         loop: 'All',
    //         // 歌曲栏折叠
    //         listFolded: true,
    //         // 设置播放器默认主题颜色
    //         theme: '#42b983',
    //         // 播放顺序为随机
    //         order: 'list',
    //         // 初始音量
    //         volume: 0.1,
    //         // 关闭歌词显示
    //         lrcType: 0,
    //       },
    //       mobile: {
    //         // 手机端去掉cover图
    //         cover: false,
    //       },
    //     },
    //   ],
]