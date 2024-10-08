---
title: URL的最大长度是多少
autoGroup-1: HTTP协议
---

## 简短回答-事实上限制为2000个字符

虽然说明书中的HTTP协议不指定任何最大长度，实际限制是有网络浏览器和服务器软件加强的。

[翻译](https://boutell.com/newfaq/misc/urllength.html)
## Microsoft Internet Explorer（浏览器）

**Micrsoft申明：**Internet Explorer的最大长度为2083个字符，URL的路径部分不超过2048个字符。在我的测试中，尝试使用比此更长的URL会在Internet Explorer中生成明确的错误消息。

## Firfox(浏览器)

在65536个字符后，位置栏不再显示Window Firefox 1.5.x中的URL。但是，较长的网址可以使用。我在100，000个字符后停止测试。

## Safari（浏览器）

至少80，000个字符可以使用。我在80，000个字符后停止测试。

## Opera（浏览器）

至少190，000个字符可以使用，我在190，000个字符停止测试。Opera 9 for windows继续在位置栏中显示完全可以编辑，可复制和可粘贴的URL，即使是190，000个字符。

## Apache（服务器）

我早起尝试在Web浏览器中测量最大长度URL长度的过程会导致服务器URL长度限制大约为4，000个字符，之后Apache会产生“413” Entity Too Large"错误。我使用了当前最新的Red Hat Enterprise Linux 4中的Apache构建。官方Apache文档仅提到了请求中单个字段的8192字节限制

## Microsoft Internet Information Server
默认限制为16,384个字符（是的，Microsoft的Web服务器接受比Microsoft的Web浏览器更长的URL）。这是可配置的。

## Perl HTTP ::守护进程（服务器）
最多可以使用8,000个字节。那些使用Perl的HTTP :: Daemon模块构建Web应用程序服务器的人将在所有HTTP请求头的组合大小上遇到16,384字节的限制。这并没有包括POST方法的表单数据，文件上传等，但它确实包含的URL。实际上，当URL明显长于8,000个字符时，这会导致413错误。可以轻松删除此限制。在Daemon.pm中查找所有出现的16x1024，并用更大的值替换它们。当然，这确实会增加您遭受拒绝服务攻击的风险。

## 建议

极长的URL通常是一个错误。超过2，000个字符的网址在最受欢迎的网络浏览器中无效。如果您希望网站为大多数互联网用户工作，请不要使用它们。

当您希望提交包含许多字段的表单时，否则回生成一个非常长的URL，标准解决方案是使用POST方法而不是GET方法：

```
<form action="myscript.php" method="POST">
...
</form>
```

然后，表单字段作为HTTP事务正文的一部分传输，而不是作为UR的一部分传输，并且不受URL长度限制的约束。短期信息不应存储在URL中。

根据经验，如果由于返回收藏夹或书签而不需要从新生成同意页面的信息，则它不属于URL。


## 书签问题

在极少数情况下，在URL中保留大量“状态”信息可能很有用。例如，地图导航网站的用户可能希望将当前显示的地图添加到他们的“书签”或“收藏夹”列表中并稍后返回。如果您必须这样做并且您的网址长度接近2,000个字符，请尽可能紧凑地表达您的信息，尽可能多地挤出“空气”。如果您的字段名称占用太多空间，请使用固定字段顺序。挤出任何不需要加入书签的字段。并避免使用大的十进制数 - 只使用尽可能多的精度，并考虑使用字母和数字的base-64表示（我没有说这很容易）。
在极端情况下，请考虑使用gzip算法压缩漂亮但过长的URL。然后仅使用URL中合法的字符对base64中的二进制数据进行重新编码。这可以产生3-4倍的空间增益，当您在下次访问时再次解压缩URL时会花费一些CPU时间。再一次，我从未说过这很容易！

另一种方法是将状态信息存储在文件或数据库中。然后，您只能存储在URL中再次查找该信息所需的标识符。这里的缺点是你将拥有许多状态文件或数据库记录。其中一些可能与其他人运营的网站相关联。此问题的一个解决方案是删除在一定时间后未重新访问的URL的状态文件或数据库记录。


## 如果服务器的URL太长，会发生什么？

如果支持超长URL的浏览器（如Firefox）将长URL提交给不支持很长URL的Web服务器（例如Apache的标准版本），会发生什么？

答案：没什么戏剧性的。Apache响应“413 Entity Too Large”错误，请求失败。

这种响应比缩短URL更好，因为剪切URL的结果是不可预测的。这对Web应用程序意味着什么？它有所不同。因此，请求失败会更好。

在过去的糟糕时期，一些Web服务器和Web浏览器无法截断或忽略长URL，从而导致危险的“缓存区溢出”情况。这些可用于插入不属于它的可执行代码。。。导致可能被利用来做坏事的安全漏洞。

目前，主要的浏览器和服务器可以抵御这种明显的攻击-尽管经常回发现更微妙的安全漏洞（并且通常回立即修复）

虽然现代服务器本身可以很好地地域长URL，但仍然寻在编写错误的CGI程序。那些用C语言和其他第几语言便携CGI程序的人必须负责密切的煮鱼潜在的缓存区溢出。该CGIC库可以帮助这一点。
