---
title: SQL 中 HAVING 与 WHERE 的区别与使用详解
---

在 SQL 查询中，`HAVING` 和 `WHERE` 都用于过滤数据，但它们的应用场景和作用对象不同。以下是两者的区别与联系：

### 1. **作用范围**
   - **WHERE**: 用于过滤**原始数据**，在 SQL 语句中，`WHERE` 子句在**分组之前**就执行。它针对的是**表中的行**，通常用来筛选满足条件的行。
     - 例如：
       ```sql
       SELECT * FROM employees
       WHERE salary > 5000;
       ```
       上述查询会先筛选出工资大于 5000 的员工，然后再进行接下来的操作。

   - **HAVING**: 用于过滤**聚合结果**，它在**分组之后**执行。通常用于和 `GROUP BY` 一起，来筛选分组后的结果。`HAVING` 针对的是**聚合函数**的结果。
     - 例如：
       ```sql
       SELECT department, AVG(salary)
       FROM employees
       GROUP BY department
       HAVING AVG(salary) > 5000;
       ```
       上述查询会先按部门进行分组，然后对每个部门计算平均工资，最后筛选出平均工资大于 5000 的部门。

### 2. **执行顺序**
   - **WHERE**: 在 `GROUP BY` 和 `HAVING` 之前执行，首先对数据进行过滤。
   - **HAVING**: 在 `GROUP BY` 之后执行，通常用来对**聚合后的结果**进行筛选。

### 3. **适用对象**
   - **WHERE**: 用于过滤单个行的数据，不能用于聚合函数（如 `SUM()`、`COUNT()` 等）。
   - **HAVING**: 专门用于过滤基于聚合函数计算的结果，可以与聚合函数一起使用。

### 4. **典型使用场景**
   - **WHERE**: 用于在原始数据集中筛选符合条件的行。
     - 例子：找出工资大于 5000 的员工。
   - **HAVING**: 用于在分组之后，根据聚合函数的结果进一步过滤。
     - 例子：找出平均工资大于 5000 的部门。

### 示例
以下查询演示了 `WHERE` 和 `HAVING` 的区别：

```sql
SELECT department, COUNT(*), AVG(salary)
FROM employees
WHERE salary > 3000
GROUP BY department
HAVING AVG(salary) > 5000;
```

- **WHERE salary > 3000**: 先筛选出工资大于 3000 的员工。
- **GROUP BY department**: 对筛选后的员工按部门分组。
- **HAVING AVG(salary) > 5000**: 最后过滤出平均工资大于 5000 的部门。

### 总结
- **WHERE** 用于筛选原始数据，不能作用于聚合结果。
- **HAVING** 用于过滤分组后的聚合结果，通常与 `GROUP BY` 一起使用。

