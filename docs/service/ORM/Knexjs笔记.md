# Knexjs笔记

knex方法分类：

操作table的方法，属于Schema Builder，对应create、drop、alter等
操作column的方法，属于Schema Builder，如设置键的类型，设置主键，外键等
执行SQL请求的方法，属于Query Builder，对应select、insert、update、delete等

其他方法

knex安装

```
#以Mysql为例
sudo npm install knex --save
sudo npm install mysql --save
```

knex初始化

```js
const knex = require('knex')({
  client: 'mysql', //指明数据库类型，还可以是mysql，sqlite3等等
  connection: { //指明连接参数
    host : '127.0.0.1',
    user : 'liuyueyi',
    password : 'password',
    database : 'example'
  },
  debug: true, //指明是否开启debug模式，默认为true表示开启
  pool: { //指明数据库连接池的大小，默认为{min: 2, max: 10}
    min: 0,
    max: 7,
  },
  acquireConnectionTimeout: 10000, //指明连接计时器大小，默认为60000ms
  migrations: {
    tableName: 'migrations' //数据库迁移，可选
  }
});
```

首先让我们在项目中和全局都安装knex。因为我们用的是mysql，所以mysql的模块也要安装。

```
npm install knex --save
npm install knex -g
npm install mysql --save
```

装好之后，别忘了检查一下。

```
knex --version
Knex CLI version: 0.19.5
Knex Local version: None
```

初次使用的时候，可以用命令行创建一个配置文件。创建再项目的根目录中。

```
->knex init
Created .knexfile.js
```

这个是创建knexfile.js里的默认内容。

```js
// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
```

我们之前写了一个config.js，里面就包含了数据库的设置。这个时候就需要我们合并一下了，合并之后就是下面这个样子了。

这当中使用了lodash这个库，这个库就是一个工具库。其中有很多的函数可以直接用，很方便。

```js
var config = require('./config');
var _ = require('lodash');

var baseConfig = {
  migrations: {
    directory: './db/migrations'
  }
}

module.exports = {
  development: _.extend(config.development.database, baseConfig),
  staging    : _.extend(config.staging.database, baseConfig),
  production : _.extend(config.production.database, baseConfig)
};
```

我们第一次做的更新就是创建users表，用于存储用户的信息。我们在knex的配置文件中设定了migrations的目录，所以直接生成在那个目录当中。

```
-> knex migrate:make add-user
Using environment: development
Created Migration: /Users/project/demo/db/migrations/20191011122323_add_user.js
```

刚生成完，里面是什么都没有的。生成表的代码我们就写再这个地方，里面定义了更新和回滚的操作，分别放在up和down中。我们顺便在up中给users表插入了一条数据。

这里面用到了Promise，如果你不了解的话可以参考以下：

- http://caniuse.com/#search=promise

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

- https://www.promisejs.org/

- http://caniuse.com/#search=promise

```js
exports.up = function(knex, Promise) {
  return Promise.all([
    // 创建表
    knex.schema.createTableIfNotExists('users', function (table) {
      table.increments('id').primary().notNullable();
      table.string('name').notNullable();
      table.string('password').notNullable();
      table.string('email').notNullable();
      table.string('uuid').notNullable();
      table.string('status').notNullable().defaultTo('active');
      table.dateTime('created_at').notNullable();
      table.dateTime('updated_at').nullable();
    }),
    // 插入数据
    knex.table('users').insert({
      name: 'limichange',
      email: 'limichange@hotmail.com',
      password: 'asdfasdf',
      uuid: '1',
      created_at: new Date()
    })
  ]);
};
exports.down = function(knex, Promise) {
  return Promise.all([
    // 删除表
    knex.schema.dropTable('users')
  ]);
};
```

接下来用命令行工具来更新数据库：

```
➜ knex migrate:latest
Using environment: development
Batch 1 run: 1 migrations
/Users/limi/website/db/migrations/20160719121550_add-user.js
```

只要执行撤销的操作，就可以让数据库回滚

```
➜ knex migrate:rollback
Using environment: development
Batch 1 rolled back: 1 migrations
/Users/limi/website/db/migrations/20160719121550_add-user.js
```

