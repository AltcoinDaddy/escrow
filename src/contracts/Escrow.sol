// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Escrow {
    struct Deal {
        address buyer;
        address seller;
        uint256 amount;
        uint256 deadline;
        bool isCompleted;
        bool isRefunded;
    }

    mapping(uint256 => Deal) public deals;
    uint256 public dealCount;

    event DealCreated(
        uint256 indexed dealId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 deadline
    );
    event DealCompleted(uint256 indexed dealId);
    event DealRefunded(uint256 indexed dealId);

    function createDeal(address _seller, uint256 _deadline) external payable {
        require(_seller != address(0), "Invalid seller address");
        require(msg.value > 0, "Amount must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        deals[dealCount] = Deal({
            buyer: msg.sender,
            seller: _seller,
            amount: msg.value,
            deadline: _deadline,
            isCompleted: false,
            isRefunded: false
        });

        emit DealCreated(dealCount, msg.sender, _seller, msg.value, _deadline);
        dealCount++;
    }

    function completeDeal(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(msg.sender == deal.buyer, "Only buyer can complete the deal");
        require(!deal.isCompleted, "Deal already completed");
        require(!deal.isRefunded, "Deal already refunded");

        deal.isCompleted = true;
        payable(deal.seller).transfer(deal.amount);
        
        emit DealCompleted(_dealId);
    }

    function refundDeal(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(msg.sender == deal.buyer, "Only buyer can refund");
        require(!deal.isCompleted, "Deal already completed");
        require(!deal.isRefunded, "Deal already refunded");
        require(block.timestamp >= deal.deadline, "Deadline not reached");

        deal.isRefunded = true;
        payable(deal.buyer).transfer(deal.amount);
        
        emit DealRefunded(_dealId);
    }

    function getDeal(uint256 _dealId) external view returns (Deal memory) {
        return deals[_dealId];
    }
} 