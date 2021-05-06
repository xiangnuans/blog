# 语法笔记一：delete和truncate的区别和联系

从效果上来看，delete from tableA，与truncate table tableA的作用是一样的，如果delete后面不添加where条件过滤，而且与drop table tableA，接着create table tableA的效果也是相同的。但是本质上，两者是完全不同的。

一、 从语言的角度来看
delete是DML类型的语句；而truncate是DDL类型的语句，执行truncate需要drop权限，而且由于它是DDL语句，是通过删除表，然后再重建实现的，所以执行的时候要比delete性能高很多，因为不需要一行一行的去删除数据。

二、 从事务的角度来说
delete 过程如果出现错误，事务是可以回滚的，但是truncate操作时是不会造成回滚的，因此更需要小心，所以才需要授予drop的权限。

三、 从执行效果来看
delete的使用范围更广，因为它可以删除符合条件的数据行，而不一定是整体；但是truncate只能删除整体。
delete会返回删除数据的行数，但是truncate只会返回0，这个没有任何意义。
在存储引擎为InnoDB的数据库服务器中，truncate无法删除一个表中的数据，如果这个表的主键作为了另一个表的外键，无论这个外键是否存在，这是由于drop表限制的；但是delete是可以实现，只要的这个主键在另一个表中的外键不存在即可。
在InnoDB中，对于AUTO_INCREMENT的列来说，当在truncate之后，改列的第一个值仍从1开始，但是delete仍然使用顺序使用删除之前的值。

