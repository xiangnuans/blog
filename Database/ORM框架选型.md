# ORM框架选型(笔记)


选型标准：实现O/R mapping，基于promise，支持原生SQL语句，支持连接池，支持事物，支持ES6/ES7

| name | star | createtime |
|---|---|---|
| sequelize | 19934 | 2010-07-18 |
| node-orm2 | 3001 | 2012-11-25 |
| typeorm | 15230 | 2016-02-21 |
| bookshelf | 5664 | 2013-03-10 |
| waterline | 5099 | 2012-11-25 |
| knex | 10539 | 2012-12-23 |
| node-orm2 | 3001 | 2013-08-03 |

备注：以上数据截止2019.9.25
node-mysql与knex非ORM框架

## sequeize

[https://github.com/sequelize/sequelize](https://github.com/sequelize/sequelize)

文档齐全，star最多。

支持数据库PostgreSQL、mysql、sqlite和sqlserver

特性：模型定义 模型同步、删除1：1 1:m  n:m关联

穿透模型promise
hooks/callbacks/lifecycle
支持原生SQL连接池 事务 迁移CLI

## node-orm2

[https://github.com/dresende/node-orm2](https://github.com/dresende/node-orm2)

支持数据库： mysql & mariadb
postgresql
amazon
sqlite
mongodb(beta版)

特性： 创建模型、同步删除、批量新增】获取、查询、删除、统计、集合创建模型关联 定制有效性验证 模型实例缓存 通过插件支持分页、事务、mysql全文搜索、迁移。支持原生SQL语句。连接池，可通过pool参数设置。promise通过q-rom库实现。

项目近期更新少，与sequelize竞争完全处于劣势，放弃。

## bookshelf

[https://github.com/tgriesser/bookshelf]
(https://github.com/tgriesser/bookshelf)

bookshelf是基于knex的ORM框架

支持数据库： mysql & mariadb & postgresql & sqlite3 和 Oracle

特性：事务 连接池 流式查询 promise和callback API

原生SQL语句

## waterline

[https://github.com/balderdashy/waterline](https://github.com/balderdashy/waterline)
waterline是从Salis框架衍生出来的ORM框架

支持数据库： mysql、mongo、PostgreSQL、redis等

文档包含在sail文档中

[http://sailsjs.com/documentation/reference/waterline-orm](http://sailsjs.com/documentation/reference/waterline-orm) 文档不完善，放弃。

## typeorm

基于Decorator的ORM框架，对TypeScript支持比较好，同时支持在JavaScript中通过手动声明使用，以及JSON方式的Entity配置声明


- 官网：https://github.com/typeorm/typeorm/
- 数据库： 支持关系行数据库，beta支持MongoDB
- 编程风格：

基本上是Hibernate的js版本
支持Promise/async/await
支持基于链式构造的Query Builder查询
支持CLI工具

热度： 周频更新， NPM周下载2.8w


## 最终对比

从以上分析，我们最终从sequelize和bookshelfl两者之间作出选择。项目数据对比
[https://nodejs.libhunt.com/compare-sequelize-vs-bookshelf](https://nodejs.libhunt.com/compare-sequelize-vs-bookshelf)

依赖于sequelize的项目：

[https://www.npmjs.com/browse/depended/sequelize](https://www.npmjs.com/browse/depended/sequelize)

依赖于bookshelf的项目：

[https://www.npmjs.com/browse/depended/bookshelf](https://www.npmjs.com/browse/depended/bookshelf)

1W star 以上项目依赖：
ghost项目使用bookshelf
react-starter-kit项目使用sequelize

两者文档都很全面。sequelize的star数量和版本更新频率高于bookshelf，所以推荐使用Sequelize

