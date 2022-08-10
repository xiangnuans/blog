const secret = require('./secretKey')


module.exports = [
  // ['link', { rel: 'icon', href: '/icons/favicon.ico' }], // 增加一个自定义的 favicon(网页标签的图标)
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
    ['link', { rel: 'manifest', href: '/js/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
    [
      'meta', // 移动端禁止用户缩放
      {
        name: 'viewport',
        content:
          'width=device-width,width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
      },
    ],
    [
      'meta',
      {
        async: 'async',
        'http-equiv': 'Content-Security-Policy', // 自动将http的不安全请求升级为https
        content: 'upgrade-insecure-requests', // HTTPS 是 HTTP over Secure Socket Layer，以安全为目标的 HTTP 通道，所以在 HTTPS 承载的页面上不允许出现 http 请求，一旦出现就是提示或报错
      },
    ],
    // [
    //   'meta',
    //   {
    //     name: 'baidu_union_verify',
    //     content: 'code-C87tLEnqNR',
    //   },
    // ],
    [
      'meta', // 添加谷歌站点搜素
      {
        async: 'async',
        name: 'google-site-verification',
        content: 'FP4Faz4ea2CqBTr-Y_6MmMRhtZtL_e5_JKVcCFbuecc',
      },
    ],
    [
      'meta', 
      { 
        name: 'baidu-site-verification', 
        content: 'code-C87tLEnqNR' 
      }
    ],
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
]