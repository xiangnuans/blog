# Webpack中实现静态资源内联

## 什么是静态资源内联（inline source）

就是将一个资源以内联的方嵌入进另一个资源里面

JS、HTML、CSS、图片和字体
```css
// index.css
.search {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJ0lEQVQ4T6XSsUoEMRAG4H/ClZaLmbSW1pZ6+gAnFrK+gZXoK6jvIILgE6gIcnYWgmJno6AgYp1Z2EcIGQnsHbuaQ9abMkO+TGaGMGfQnPfxC3DOrajqPoB1AArgnohOvffPucc6ADMfAjgCUMYYH9MFY8wagEsAxyKScp2YAtbaERGNRST7LWZWVd2squq2LbSBMyK6E5GrXKnW2i1jzMh7v5sFmPkzhDCs69rngKIo3GAweBKRpVnAVwhh9Q/gRUQWs4Bz7jzGeFNV1ThXATOXAA5EJDV1Gr2aSETb3vvrLJAOmTmNKY2yVNUHVSVjzBDABYA3ADsi8j4TSIlmkfYAbABYUNUPACdE9NpAHaTXKjPz8k+kF9B8s4P0BibIpBf/AtpN/AYx54AR58WxmQAAAABJRU5ErkJggg==) no-repeat;
}

```

## 资源内联的意义

- 工程维护

我们去打包多页面应用的时候会借助`html-webpack-plugin`，每个页面会有一个HTML模板与之对应。每个HTML都会包含很多相似的内容，比如meta信息、或SSR时需要用的有些占位符等等。试想一下，如果将下面这段meta代码分别复制一份放到每个HTML模版里面将会对代码维护造成的影响。

这个时候推荐的做法是维护一份meta.html，将上面的这个代码内容放置进去。每个HTML模板将meta.html片段内联进去



- 页面加载新能

资源内联的第二点意义在于可以减少HTTP的请求数，当然如果你的网站有使用HTTP2这点的意义可能不会那么大。将各种小图片、小字体（比如：小于5k）在生产环境base64到代码里面可以极大的减少页面的请求数量，从而提神页面的加载事件

- 页面加载体验


浏览器器解析HTML源码是从上到下戒子，因此我们会把CSS放大头部，JS放置到底部。以SSR场景为例，如果不将打包的CSS内联HTML里面，HTML出来的时候页面的结构已经有了，但是还需要发送一次请求去请求CSS，这个时候就会出现页面闪烁，网络情况差的时候更明显

## 资源内联的类型

- HTML
- JS
- CSS
- 图片、字体

如果你曾经使用过[FIS](http://fis.baidu.com/fis3/docs/beginning/intro.html)或者看过FIS的文档，你会发现FIS对于资源内联的支持非常棒


### HTML内联

借助`raw-loader`实现的内联语法：

```html

// 内联HTML
${ require('raw-loader!./meta.html')}

// 内联JS，如果有ES6语法则需要babel-loader转换
<script>${require('raw-loader!babel-loader!../node_modules/lib-flexible/flexible.js')}</script>
```

### CSS内联

通常情况下，为了更好的加载体验，我们桂江打包好的CSS内联到HTML头部，这样HTML加载完成CSS就可以直接渲染出来，避免页面闪动的情况，

CSS内联的核心思路是：将页面打包过程产生的所有CSS提取成一个独立的文件，然后将这个CSS文件内联进HTML的head里面。这里需要借助`mini-css-extract-plugin`和`html-inline-css-webpack-plugin`来实现CSS的内联功能


```js
// webpack.config.js

const path = require('path');

module.exports = {
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    mode: 'production',
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new HtmlWebpackPlugin(),
        new HTMLInlineCSSWebpackPlugin()
    ]
};


```

### 图片、字体内联


基础版：

图片和字体的内联可以借助`url-loader`，比如你可以通过修改webpack配置让小于10k的图片或者字体在构建阶段自动base64.

```js
// webpack.config.js

const path = require('path');

module.exports = {
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    mode: 'production',
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new HtmlWebpackPlugin(),
        new HTMLInlineCSSWebpackPlugin()
    ]
};


```

增强版：

不过url-loader做资源哪辆的缺陷就是不能个性化的设置某张图片自动编码，针对这个问题，我们可以借鉴下FIS的语法糖，实现？_inline的语法糖，引用某个图片的时候看到这个后缀则自动的将这张图片进行base64编码。这个功能实现其俩也很简单，可以参考`inline-file-loader`，核心代码：

```js
export default function loader(content) {
  const options = loaderUtils.getOptions(this) || {};

  validateOptions(schema, options, {
    name: 'File Loader',
    baseDataPath: 'options',
  });

  const hasInlineFlag = /\?__inline$/.test(this.resource);

  if (hasInlineFlag) {
    const file = this.resourcePath;
    // Get MIME type
    const mimetype = options.mimetype || mime.getType(file);

    if (typeof content === 'string') {
      content = Buffer.from(content);
    }

    return `module.exports = ${JSON.stringify(
      `data:${mimetype || ''};base64,${content.toString('base64')}`
    )}`;
  }

```

有了图片的内联功能，我们可以将前面的搜索icon图标内联的额写法修改：

```css
// index.css
.search {
  background: url(./search-icon.png?__inline) no-repeat;
}

```
