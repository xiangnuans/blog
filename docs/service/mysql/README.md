---
title: MySQL 中 DELETE 和 TRUNCATE 的区别与联系详解
---


`DELETE` 和 `TRUNCATE` 是 MySQL 中用于删除表中数据的两种操作，但它们有不同的使用场景和效果。下面是它们的区别和联系：

### 1. **删除数据的方式**
   - **DELETE**: 
     - `DELETE` 是一条 DML（数据操作语言）语句，逐行删除表中的数据。
     - 可以使用 `WHERE` 子句来指定删除特定行。例如：`DELETE FROM table_name WHERE condition;`。
     - 每删除一行都会记录到数据库日志中，因此可以回滚（通过事务操作）。
     - 删除数据后，表的结构和索引不会改变，自动增长的 `AUTO_INCREMENT` 字段不会重置。
   - **TRUNCATE**:
     - `TRUNCATE` 是一条 DDL（数据定义语言）语句，删除表中的所有数据。
     - 删除操作不能指定 `WHERE`，它会清空整个表。
     - 不会逐行删除，而是通过快速的方式来直接清空表。
     - 因为是 DDL 操作，它的执行速度通常比 `DELETE` 快很多。
     - 清空表后，会重置 `AUTO_INCREMENT` 计数器。
     - `TRUNCATE` 操作不能回滚，因为它不是逐行记录日志。

### 2. **性能**
   - **DELETE**：由于每次删除操作都会记录日志和处理触发器，因此如果要删除大量数据，性能可能会很慢。
   - **TRUNCATE**：执行效率非常高，尤其是对大数据表，因为它不记录每行的删除日志，而是通过重建表的方式来清空数据。

### 3. **事务支持**
   - **DELETE**：支持事务，可以在事务中回滚。例如：
     ```sql
     BEGIN;
     DELETE FROM table_name WHERE condition;
     ROLLBACK; -- 可以回滚
     ```
   - **TRUNCATE**：不支持事务，一旦执行无法回滚。

### 4. **触发器和外键**
   - **DELETE**：会触发 `DELETE` 触发器。
   - **TRUNCATE**：不会触发任何触发器，也不允许清空有外键约束的表。

### 5. **适用场景**
   - **DELETE**：适合需要有选择地删除某些数据，或者在需要事务支持的场景下使用。
   - **TRUNCATE**：适合快速清空表数据的场景，尤其是在不需要触发触发器、没有外键约束、并且不需要回滚的情况下。

### 总结：
- **DELETE** 是逐行删除，可以使用 `WHERE` 过滤条件，支持事务和触发器，但性能较慢。
- **TRUNCATE** 是快速清空表的操作，不支持 `WHERE`、事务和触发器，但性能非常快，会重置 `AUTO_INCREMENT`。

