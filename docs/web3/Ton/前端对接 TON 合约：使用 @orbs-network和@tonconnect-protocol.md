---
title: 前端对接 TON 合约：使用 @orbs-network/ton-access 和 @tonconnect/protocol
date: 2024-11-8
---

前端对接 TON 合约：使用 `@orbs-network/ton-access` 和 `@tonconnect/protocol`

在开发基于 TON 的 DApp 时，我们需要从链上获取用户数据、连接钱包，并进行智能合约交互。为此，TON 生态提供了两个强大的库：`@orbs-network/ton-access` 和 `@tonconnect/protocol`。本文将介绍这两个库的功能，并展示一些常见的使用场景和代码示例，帮助您快速构建基于 TON 的 DApp。

库简介

`@orbs-network/ton-access`

-	主要用于访问 TON 区块链节点。它提供了获取用户账户信息、余额查询、交易历史记录等功能。
-	特点：通过自动选择最佳节点，提升了链上数据获取的稳定性和速度。

`@tonconnect/protocol`
-	主要用于钱包连接和交易签名，提供了 TON 钱包连接、签名交易、用户授权等功能。
-	特点：让用户可以安全地连接钱包、授权 DApp，并签署交易。

## 场景 1：构建一个 TON 数据查询工具

在这个场景中，我们希望创建一个工具，让用户可以查询钱包地址的余额和交易历史。

### 适用库：`@orbs-network/ton-access`，因为我们需要频繁访问链上数据，而无需用户授权。

### 示例代码
```js
import { TonAccessClient } from '@orbs-network/ton-access';

// 初始化 TonAccessClient
const tonAccess = new TonAccessClient();

// 查询钱包地址的余额
async function getBalance(walletAddress) {
  try {
    // 通过自动选择的最佳节点查询账户余额
    const balance = await tonAccess.getBalance(walletAddress);
    console.log(`账户余额: ${balance}`);
    return balance;
  } catch (error) {
    console.error("获取余额时出错:", error);
  }
}

// 查询交易历史记录
async function getTransactionHistory(walletAddress) {
  try {
    const transactions = await tonAccess.getTransactions(walletAddress);
    console.log("交易历史:", transactions);
    return transactions;
  } catch (error) {
    console.error("获取交易历史时出错:", error);
  }
}

// 使用示例
const walletAddress = "EQC1lFSn0c..."; // 替换为真实的钱包地址
getBalance(walletAddress);
getTransactionHistory(walletAddress);
```

### 解释：
-	`TonAccessClient` 会自动选择最优节点，确保数据查询的稳定性。
-	`getBalance` 和 `getTransactionHistory` 是常见的账户信息查询方法，用户可通过提供地址查询自己账户的相关信息。

## 场景 2：构建一个 TON 钱包连接的 DApp

在 DApp 中，通常希望用户可以连接自己的钱包并完成授权签名操作。这个场景下，我们需要实现用户的钱包连接和交易签名功能。

### 适用库：`@tonconnect/protoco`l，因为需要用户授权并发送签名请求。

示例代码
```js
import TonConnect from '@tonconnect/protocol';

const tonConnect = new TonConnect();

// 初始化钱包连接
async function connectWallet() {
  try {
    // 请求用户授权
    await tonConnect.connect();
    console.log("钱包连接成功:", tonConnect.userAddress);
  } catch (error) {
    console.error("钱包连接失败:", error);
  }
}

// 发起交易请求
async function sendTransaction() {
  try {
    const transaction = {
      to: "EQD4lGQK....", // 接收方钱包地址
      value: "1000000000", // 发送金额，单位为 nanoTON
      message: "测试交易",
    };
    // 向用户的钱包发起签名请求
    const result = await tonConnect.sendTransaction(transaction);
    console.log("交易成功:", result);
  } catch (error) {
    console.error("交易失败:", error);
  }
}

// 使用示例
connectWallet();
sendTransaction();
```

### 解释：
-	`connectWallet` 方法通过 `TonConnect.connect()` 来请求用户授权并连接钱包。
-	`sendTransaction` 方法用于构建交易请求，并将其发送到连接的钱包进行签名。用户在钱包应用中确认后，交易将被提交到链上。

## 场景 3：构建一个综合 DApp，支持数据查询和合约交互

在实际 DApp 中，我们可能需要同时支持用户的数据查询和智能合约交互功能。比如，构建一个带有钱包连接功能的 TON DApp，用户可以查询自己的余额，并与链上智能合约进行交互。

### 适用库：`@orbs-network/ton-access` 和 `@tonconnect/protocol` 结合使用。

示例代码
```js
import { TonAccessClient } from '@orbs-network/ton-access';
import TonConnect from '@tonconnect/protocol';

// 初始化客户端
const tonAccess = new TonAccessClient();
const tonConnect = new TonConnect();

// 连接钱包并显示账户余额
async function connectAndShowBalance() {
  try {
    // 连接钱包
    await tonConnect.connect();
    const walletAddress = tonConnect.userAddress;
    console.log("钱包连接成功:", walletAddress);

    // 查询账户余额
    const balance = await tonAccess.getBalance(walletAddress);
    console.log(`账户余额: ${balance}`);
    return { walletAddress, balance };
  } catch (error) {
    console.error("连接或获取余额时出错:", error);
  }
}

// 发起智能合约交互请求
async function interactWithContract() {
  try {
    const contractAddress = "EQDA0f2q..."; // 合约地址
    const amount = "5000000000"; // 发送金额

    // 构造交易请求
    const transaction = {
      to: contractAddress,
      value: amount,
      message: "与合约交互",
    };

    // 通过 TON Connect 发送交易请求
    const result = await tonConnect.sendTransaction(transaction);
    console.log("合约交互成功:", result);
  } catch (error) {
    console.error("合约交互失败:", error);
  }
}

// 使用示例
connectAndShowBalance();
interactWithContract();
```
### 解释：
-	`connectAndShowBalance` 方法首先通过 `TonConnect.connect()` 请求用户连接钱包，并获取钱包地址，接着通过 `tonAccess.getBalance()` 查询账户余额。
-	`interactWithContract` 方法构建并发送一个智能合约交互请求，用户确认签名后即可完成合约调用。

## 总结

通过 `@orbs-network/ton-access` 和 `@tonconnect/protocol`，我们可以轻松地为 DApp 增加数据查询和钱包交互功能。这两个库各有所长，结合使用时能够有效提升开发效率和用户体验。希望本文的示例代码能帮助您更快上手并实现基于 TON 的 DApp 开发。