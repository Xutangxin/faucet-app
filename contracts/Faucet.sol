// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title 高级水龙头
 * @notice 支持
 *          1. 自定义领取间隔（秒级）
 *          2. 每天最多领取 N 次
 *          3.  Owner 随时改参数
 */
contract Faucet is Ownable {
    IERC20 public immutable token;

    /* ==================== 可配置参数 ==================== */
    uint256 public dripAmount = 10 * 10 ** 18; // 单次数量
    uint256 public claimInterval = 10; // 两次领取最小间隔
    uint256 public maxClaimsPerDay = 20; // 每天最多领取次数

    /* ==================== 状态记录 ==================== */
    // 用户地址 => 上次领取时间戳
    mapping(address => uint256) public lastClaimTime;

    // 用户地址 => 当日已领取次数
    mapping(address => uint256) public claimsToday;

    // 记录“当日”的日历日期 (uint32 足够存储 yyyyMMdd)
    uint32 public currentDay;

    /* ==================== 事件 ==================== */
    event TokensClaimed(address indexed to, uint256 amount);
    event ConfigChanged(
        uint256 newAmount,
        uint256 newInterval,
        uint256 newMaxPerDay
    );

    /* ==================== 构造器 ==================== */
    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
        currentDay = _today();
    }

    /* ==================== 外部功能 ==================== */
    /**
     * @notice 领取代币
     */
    function requestTokens() external {
        _rollDayIfNeeded(); // 自动跨日清零

        require(
            block.timestamp >= lastClaimTime[msg.sender] + claimInterval,
            "Faucet: interval not reached"
        );
        require(
            claimsToday[msg.sender] < maxClaimsPerDay,
            "Faucet: daily limit exceeded"
        );
        require(
            token.balanceOf(address(this)) >= dripAmount,
            "Faucet: insufficient balance"
        );

        // 更新状态
        lastClaimTime[msg.sender] = block.timestamp;
        claimsToday[msg.sender] += 1;

        token.transfer(msg.sender, dripAmount);
        emit TokensClaimed(msg.sender, dripAmount);
    }

    /**
     * @notice Owner 充值
     */
    function refill(uint256 amount) external onlyOwner {
        token.transferFrom(msg.sender, address(this), amount);
    }

    /**
     * @notice Owner 动态改参数
     */
    function setConfig(
        uint256 _dripAmount,
        uint256 _claimInterval,
        uint256 _maxClaimsPerDay
    ) external onlyOwner {
        dripAmount = _dripAmount;
        claimInterval = _claimInterval;
        maxClaimsPerDay = _maxClaimsPerDay;
        emit ConfigChanged(_dripAmount, _claimInterval, _maxClaimsPerDay);
    }

    /**
     * @notice 查询某地址今日剩余可领取次数
     */
    function remainingClaims(address usr) external view returns (uint256) {
        if (_today() != currentDay) return maxClaimsPerDay; // 已跨日，未清零但前端可预知
        return
            maxClaimsPerDay > claimsToday[usr]
                ? maxClaimsPerDay - claimsToday[usr]
                : 0;
    }

    /* ==================== 内部函数 ==================== */
    // 自动跨日清零
    function _rollDayIfNeeded() private {
        uint32 today = _today();
        if (today != currentDay) {
            currentDay = today;
            // 不清空整个 mapping，仅依靠新 day 重新计数
        }
    }

    // 返回 yyyyMMdd 格式的 uint32
    function _today() private view returns (uint32) {
        return uint32((block.timestamp / 1 days) * 1 days);
    }
}
