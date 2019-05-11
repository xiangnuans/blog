---
title: MQTT 服务质量qos
date: 2019-04-15 16:48:51
tags: 消息协议
---

# QoS

QoS（Quality of Service）指代消息传输的服务质量。它包括 QoS0（最多分发一次）、QoS1（至少达到一次）和 QoS2（仅分发一次）三种级别。

# cleanSession

cleanSession 标志是 MQTT 协议中对一个客户端建立 TCP 连接后是否关心之前状态的定义。具体语义如下：

cleanSession=true：客户端再次上线时，将不再关心之前所有的订阅关系以及离线消息。
cleanSession=false：客户端再次上线时，还需要处理之前的离线消息，而之前的订阅关系也会持续生效。
注意：

MQTT 要求每个客户端每次连接时的 cleanSession 标志必须固定，不允许动态变化，否则会导致离线消息的判断有误。
MQTT 目前对外 QoS2 消息不支持非 cleanSession ，如果客户端以 QoS2 方式订阅消息，即使设置 cleanSession=false 也不会生效。
P2P 消息的 cleanSession 判断以发送方客户端的配置为准。
QoS 和 cleanSession 的不同组合产生的结果如下表所示：

表 1. QoS 和 cleanSession 的组合关系
QoS 级别	cleanSession=true	cleanSession=false
QoS0	无离线消息，在线消息只尝试推一次	无离线消息，在线消息只尝试推一次
QoS1	无离线消息，在线消息保证可达	有离线消息，所有消息保证可达
QoS2	无离线消息，在线消息保证只推一次

# 参考资料
https://help.aliyun.com/document_detail/42420.html?spm=a2c4g.11186623.6.543.17537cb4WC0P43