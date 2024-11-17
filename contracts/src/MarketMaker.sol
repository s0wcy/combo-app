pragma solidity 0.8.15;

import {IERC1155} from "openzeppelin-contracts/token/ERC1155/IERC1155.sol";
import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";

import {IConditionalTokens} from "ctf-exchange/exchange/interfaces/IConditionalTokens.sol";

// A nice MM ready to fill you at the price you wish no matter the cost
// we did this because the matchOrders method cannot be called by anyone so we cannot purchase prediction tokens from our system ................
contract MarketMaker {
    IERC1155 public constant ctf = IERC1155(0x4D97DCd97eC945f40cF65F87097ACe5EA0476045);

    IERC20 public USDC = IERC20(0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174);

    function pull(uint256 amount) external {
        USDC.transfer(msg.sender, amount);
    }
}
