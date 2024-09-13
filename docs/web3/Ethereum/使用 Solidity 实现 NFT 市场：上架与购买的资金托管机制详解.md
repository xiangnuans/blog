---
title: 使用 Solidity 实现 NFT 市场：上架与购买的资金托管机制详解
date: 2024-9-13
autoGroup-1: 钱包
---

以太坊智能合约可以用于实现去中心化的 **NFT 市场合约**，允许用户将 NFT 上架到市场，并由其他用户购买。这个过程需要依赖智能合约来托管交易资金，并确保所有步骤自动化和无信任化操作。

我们可以将 **上架 NFT** 和 **购买 NFT** 视为一个资金托管过程：卖家将 NFT 上架，买家支付资金，而智能合约在买家付款后完成 NFT 的转移并将资金发送给卖家。

### 关键步骤：

1. **卖家上架 NFT**：卖家将自己的 NFT 上架到市场，设定价格。NFT 由市场合约托管，直到有买家购买。
   
2. **买家购买 NFT**：买家支付指定的金额，资金通过智能合约托管。合约会确保资金到达后，将 NFT 从市场转移到买家账户，并将资金发送给卖家。

3. **资金与 NFT 转移**：智能合约负责在买家支付后，安全地转移 NFT 给买家，同时将资金转移给卖家。

### Solidity 合约示例：NFT 上架和购买

我们可以使用 `ERC721` 标准来处理 NFT，并结合托管和市场逻辑。以下是一个简单的实现，包括 NFT 上架和购买功能：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721Holder, Ownable {
    struct Listing {
        address seller;
        uint256 price;
        address nftContract;
        uint256 tokenId;
    }

    // 列出所有上架的 NFT
    Listing[] public listings;

    // 添加一个上架事件
    event NFTListed(address indexed seller, address indexed nftContract, uint256 indexed tokenId, uint256 price);
    event NFTPurchased(address indexed buyer, address indexed nftContract, uint256 indexed tokenId, uint256 price);

    // 卖家上架 NFT
    function listNFT(address nftContract, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be greater than zero");
        
        // 将 NFT 从卖家转移到市场合约中进行托管
        IERC721(nftContract).safeTransferFrom(msg.sender, address(this), tokenId);
        
        // 记录上架信息
        listings.push(Listing({
            seller: msg.sender,
            price: price,
            nftContract: nftContract,
            tokenId: tokenId
        }));

        // 触发上架事件
        emit NFTListed(msg.sender, nftContract, tokenId, price);
    }

    // 买家购买 NFT
    function purchaseNFT(uint256 listingIndex) external payable {
        Listing memory listing = listings[listingIndex];

        // 确保买家支付了正确的价格
        require(msg.value >= listing.price, "Insufficient payment");
        
        // 删除已购买的 listing
        removeListing(listingIndex);

        // 将资金转给卖家
        payable(listing.seller).transfer(listing.price);

        // 将 NFT 转移给买家
        IERC721(listing.nftContract).safeTransferFrom(address(this), msg.sender, listing.tokenId);

        // 触发购买事件
        emit NFTPurchased(msg.sender, listing.nftContract, listing.tokenId, listing.price);
    }

    // 删除上架的 NFT（当 NFT 被购买后）
    function removeListing(uint256 index) internal {
        require(index < listings.length, "Index out of bounds");
        
        listings[index] = listings[listings.length - 1];
        listings.pop();
    }

    // 获取市场上所有上架的 NFT 列表
    function getListings() external view returns (Listing[] memory) {
        return listings;
    }
}
```

### 功能解析

#### 1. **NFT 上架**
- 卖家调用 `listNFT` 函数，将他们的 NFT 上架到市场：
  - NFT 被发送到市场合约，由合约进行托管，直到买家购买。
  - 合约会记录卖家的地址、NFT 的价格和 NFT 的详细信息（如合约地址和 token ID）。
  
  示例：
  ```solidity
  function listNFT(address nftContract, uint256 tokenId, uint256 price) external {
      require(price > 0, "Price must be greater than zero");
      IERC721(nftContract).safeTransferFrom(msg.sender, address(this), tokenId);
      listings.push(Listing({
          seller: msg.sender,
          price: price,
          nftContract: nftContract,
          tokenId: tokenId
      }));
      emit NFTListed(msg.sender, nftContract, tokenId, price);
  }
  ```

  - 这里使用了 `IERC721.safeTransferFrom` 将 NFT 从卖家账户转移到市场合约地址，这一步是典型的托管流程，确保在交易完成之前，卖家无法再对 NFT 进行操作。

#### 2. **购买 NFT**
- 买家通过 `purchaseNFT` 函数购买 NFT：
  - 买家支付指定的金额给市场合约。
  - 市场合约检查支付金额是否满足要求。
  - 合约将资金发送给卖家，并将 NFT 从合约转移给买家。
  
  示例：
  ```solidity
  function purchaseNFT(uint256 listingIndex) external payable {
      Listing memory listing = listings[listingIndex];
      require(msg.value >= listing.price, "Insufficient payment");

      removeListing(listingIndex);

      payable(listing.seller).transfer(listing.price);
      IERC721(listing.nftContract).safeTransferFrom(address(this), msg.sender, listing.tokenId);

      emit NFTPurchased(msg.sender, listing.nftContract, listing.tokenId, listing.price);
  }
  ```

  - 这里使用了 `payable` 关键字接收买家的支付。通过 `transfer` 函数将资金发送给卖家，并调用 `IERC721.safeTransferFrom` 将 NFT 转移给买家。
  
#### 3. **删除已售出的 NFT**
- 当 NFT 被购买时，合约会通过 `removeListing` 函数从列表中删除该 NFT 的上架信息。删除操作将使用数组最后一个元素替换被移除的元素，确保删除操作高效执行。

#### 4. **查询所有上架的 NFT**
- 通过 `getListings` 函数，外部用户可以查看当前市场中所有上架的 NFT 信息。

### 资金托管的角色

在这个实现中，市场合约扮演了托管的角色：
- 当卖家上架 NFT 时，市场合约会接收并托管 NFT，确保卖家在购买完成之前无法再操作该 NFT。
- 买家支付资金后，合约会将资金托管，直到 NFT 被成功转移给买家，再将资金转给卖家。

### 改进和扩展

1. **手续费机制**：市场合约可以收取一部分手续费作为平台盈利的一部分，可以在 `purchaseNFT` 函数中扣除部分费用：
   ```solidity
   uint public platformFee = 100; // 1% 平台手续费
   
   function purchaseNFT(uint256 listingIndex) external payable {
       Listing memory listing = listings[listingIndex];
       require(msg.value >= listing.price, "Insufficient payment");

       removeListing(listingIndex);

       uint fee = listing.price * platformFee / 10000;
       payable(owner()).transfer(fee); // 平台费
       payable(listing.seller).transfer(listing.price - fee);

       IERC721(listing.nftContract).safeTransferFrom(address(this), msg.sender, listing.tokenId);

       emit NFTPurchased(msg.sender, listing.nftContract, listing.tokenId, listing.price);
   }
   ```

2. **时间锁**：可以在合约中增加时间锁机制，规定 NFT 必须上架一段时间后才能被取消或购买。

3. **分期支付和部分支付**：可以扩展合约允许买家进行分期或部分支付，等到支付完成后再转移 NFT。

### 总结

通过使用 Solidity 和 ERC721 标准，可以轻松实现一个简单的 NFT 市场合约，实现 NFT 的上架和购买功能。智能合约充当托管角色，确保买卖双方的资产和资金在去中心化的环境中得到保障。