# Mac上安装Elasticsearch，基本操作

## 简介

Elasticsearch是一个高度可扩展的开源的分布式RESTFul全文搜索和分析引擎。它允许用户快速的（近实时的）存储、搜索和分析海量数据。他通常用作底层引擎技术，，为具有复杂搜索功能和要求的应用程序提供支持

一下是ES可用于的一些场景：
1. 电商网站提供搜索功能：可使用ES来存储产品的目录和库存，并为他们提供搜索和自动填充建议
2. 搜集日志和交易数据，并进行分析：可食用Logstash来搜集、聚合和解析数据，然后让Logstash将次数据提供给ES。然后可在ES中搜索和聚合开发者感兴趣的信息。
3. 需要快速调查、分析、可视化查询大量数据的特定问题：可以使用ES存储数据，然后使用Kibana构建自定义仪表板，来可视化展示数据。还可以使用ES的聚合功能针对这些数据复杂的商业分析。

## 安装
在Mac上可以使用brew快速安装Elasticsearch

### 安装Elasticsearch

```
brew install elasticsearch
```

安装完成后可使用`elasticsearch --version`查看ES版本信息

然后执行启动命令

```
elasticsearch
```
启动成功后，ES的默认端口是9200，可在浏览器中看到ES的基本信息

### 安装Kibana

Kibana是ES的一个配套工具，让用户在网页中可以直接与ES进行交互。

安装命令：

```
brew install kibana
```

安装完成后直接执行kibana命令启动
Kibana的默认端口是5601
