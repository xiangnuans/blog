---
title: Solidity 函数可见性详解：public、external、internal 与 private 的使用场景与区别
date: 2024-9-14
---

在 Solidity 中，函数的可见性（visibility）决定了函数在合约内部或外部的可访问性。Solidity 提供了四种不同的可见性修饰符，它们分别是：

### 1. **`public`**
   - **定义**：`public` 函数可以被合约内部和外部的任何人或合约调用。
   - **特点**：
     - 可以通过外部合约或外部账户调用。
     - 合约内部也可以直接调用。
     - Solidity 会为每个 `public` 函数自动生成一个函数接口，供外部调用。
   - **示例**：
     ```solidity
     function examplePublic() public {
         // This function can be called from anywhere
     }
     ```

### 2. **`external`**
   - **定义**：`external` 函数只能通过合约外部的调用（例如通过交易或合约调用）。合约内部不能直接调用（除非使用 `this.functionName()`）。
   - **特点**：
     - 只能通过外部账户或其他合约调用。
     - 如果在合约内部调用需要使用 `this` 关键字（会消耗更多的 gas）。
     - 在某些情况下，`external` 函数比 `public` 函数更节省 gas，尤其是传递大数组时，因为 `external` 参数是 calldata 类型。
   - **示例**：
     ```solidity
     function exampleExternal() external {
         // Can only be called from outside the contract
     }
     ```

### 3. **`internal`**
   - **定义**：`internal` 函数只能在当前合约及其继承的合约中调用，不能被外部合约或账户调用。
   - **特点**：
     - 可以在合约内部和继承的合约中使用。
     - 无法通过外部账户或合约直接调用。
   - **示例**：
     ```solidity
     function exampleInternal() internal {
         // Can only be called from this contract or contracts that inherit from it
     }
     ```

### 4. **`private`**
   - **定义**：`private` 函数只能在当前合约内部调用，不能被任何其他合约，包括继承的合约访问。
   - **特点**：
     - 仅限于合约内部使用，继承的合约也无法访问。
     - 适用于那些不希望外部或子合约访问的函数。
   - **示例**：
     ```solidity
     function examplePrivate() private {
         // Can only be called from this contract
     }
     ```

### 总结

| 可见性     | 合约内部调用 | 继承合约调用 | 外部合约调用 | 外部账户调用 |
|------------|--------------|--------------|--------------|--------------|
| `public`   | ✔            | ✔            | ✔            | ✔            |
| `external` | ✘ (需使用 `this`) | ✘            | ✔            | ✔            |
| `internal` | ✔            | ✔            | ✘            | ✘            |
| `private`  | ✔            | ✘            | ✘            | ✘            |

选择合适的函数可见性修饰符是确保合约安全性和功能性的重要步骤。