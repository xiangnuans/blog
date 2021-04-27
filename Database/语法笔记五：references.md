# 语法笔记五：references


## 问题
Let's say I want to create two tables `person` and `hobby` and I want the hobby table id to reference the id of person?

```
person table
- id
- name


hobby
- id
- person_id
- hobby_name
```

## 实现

```
CREATE TABLE hobby (
  id INT NOT NULL AUTO_INCREMENT,
  person_id INT NOT NULL,
  hobby_name VARCHAR(255),
  PRIMARY KEY(id),
  FOREIGN KEY(person_id) REFERENCES person(id)
)
```
