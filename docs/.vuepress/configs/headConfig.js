const secret = require('./secretKey')


module.exports = [
    // ['link', { rel: 'icon', href: '/icons/favicon.ico' }], // 增加一个自定义的 favicon(网页标签的图标)
    [
      // 添加百度统计代码
      'script',
      {},
      `
        var _hmt = _hmt || [];
        (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?${secret.baiduTongJiId}";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
      `,
    ],
    [
        'meta',
        {
          rel: 'keywords',
          content:
            '郭雁宏,郭雁宏的博客,前端博客,https://coco723.github.io',
        },
      ],
      ['meta', { name: 'Author', content: '郭雁宏' }],
      [
        'meta',
        { 'http-equiv': 'Content-Type', content: 'text/html', charset: 'UTF-8' },
      ],
]