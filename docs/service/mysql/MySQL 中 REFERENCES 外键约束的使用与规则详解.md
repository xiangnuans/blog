---
title: MySQL 中 REFERENCES 外键约束的使用与规则详解
---

在 MySQL 中，`REFERENCES` 关键字用于定义外键约束（Foreign Key Constraint），它用于在两个表之间建立关联，从而维护数据的完整性。外键约束可以确保某个表中的值必须存在于另一个表中，避免无效的引用。

### 外键约束的定义语法
外键约束通常在 `CREATE TABLE` 或 `ALTER TABLE` 语句中使用 `REFERENCES` 来定义。

#### 1. **在 `CREATE TABLE` 中定义外键**
```sql
CREATE TABLE child_table (
    id INT PRIMARY KEY,
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES parent_table(id)
);
```
- `parent_id`: 是 `child_table` 中的列，它通过外键关联到 `parent_table` 中的 `id` 列。
- `FOREIGN KEY (parent_id)`: 定义 `parent_id` 列为外键。
- `REFERENCES parent_table(id)`: 指定 `parent_id` 列引用 `parent_table` 中的 `id` 列。

#### 2. **在 `ALTER TABLE` 中添加外键**
如果你已经有一个表，可以使用 `ALTER TABLE` 语句来添加外键：
```sql
ALTER TABLE child_table
ADD CONSTRAINT fk_parent
FOREIGN KEY (parent_id) REFERENCES parent_table(id);
```
- `ADD CONSTRAINT fk_parent`: 为外键命名为 `fk_parent`，便于后续管理。
- `FOREIGN KEY (parent_id)`: 指定 `parent_id` 列为外键。
- `REFERENCES parent_table(id)`: 指定引用的表和列。

### 外键约束的规则
- **ON DELETE CASCADE**: 当父表中的记录被删除时，自动删除子表中与之关联的记录。
  ```sql
  FOREIGN KEY (parent_id) REFERENCES parent_table(id) ON DELETE CASCADE;
  ```
- **ON UPDATE CASCADE**: 当父表中的记录被更新时，子表中的外键值也会随之更新。
  ```sql
  FOREIGN KEY (parent_id) REFERENCES parent_table(id) ON UPDATE CASCADE;
  ```

### 注意事项
1. **数据类型**：外键列和引用的列必须具有相同的数据类型或兼容的类型。
2. **索引要求**：被引用的列（如 `parent_table(id)`）必须是主键或有唯一约束的列（`UNIQUE`）。
3. **外键检查**：如果外键检查被禁用，可以通过以下方式启用：
   ```sql
   SET FOREIGN_KEY_CHECKS = 1;
   ```

### 总结
- `REFERENCES` 用于定义外键约束，确保表之间的引用完整性。
- 可以在 `CREATE TABLE` 或 `ALTER TABLE` 语句中定义。
- 外键支持删除、更新时的级联操作来自动维护引用完整性。
