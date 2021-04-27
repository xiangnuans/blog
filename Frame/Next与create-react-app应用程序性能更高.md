# Next VS Gatsby VS create-react-app应用程序性能更高

 Next VS Gatsby VS create-react-app是用于构建React应用程序的系统，而无需通过Webpack自己处理应用程序的捆绑。它们可以帮助您快速设置和运行React应用程序

## Next.js还是Gastby？为什么选择他们而不是create-react-app


create-react-app不能帮助您轻松生成服务端渲染的应用，它随附的所有内容（SEO，速度。。）仅由[Next.js](https://flaviocopes.com/nextjs/#introduction)和[Gatsby](https://flaviocopes.com/gatsby/)之类。


Next.js是一种可以利用React支持服务端渲染（SSR）的方式，同样，create-react-app是您可以利用React支持客户端渲染（CSR）的一种方法

沃尔玛实验室（Walmart Labs）发表了一片很棒的文章，标题为“服务端渲染相对于客户端渲染的好处”
![](https://gcc68.oss-cn-hangzhou.aliyuncs.com/2019-12-24-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202019-12-24%20%E4%B8%8A%E5%8D%8810.31.58.png)


## 什么时候Next.js比Gatsby更好？

它们都可以帮助服务器端呈现，但是有2中不同的方式。‘

使用Gatsby的最终结果是没有服务器的静态站点生成器。您生成站点，然后Netify或另一个静态托管站点上静态部署生成过程的结果。

Next.js提供了一个后端，服务端可以呈现对请求的响应，从而允许您创建动态网站，这意味着您将其部署在可以运行Node.js的平台上。


Next.js也可以生成一个静态站点，但是我不会说这是其主要用例。

如果我的目标是建立一个静态站点，那么我将很难选择，也许Gatsby拥有一个更好的插件生态系统，其中包括许多特别用于博客的插件

Gatsby很大程度上也基于GraphQL