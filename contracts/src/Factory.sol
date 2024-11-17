pragma solidity 0.8.15;

import {IStrategy} from "./Strategy.sol";
import {Market, MarketPositions} from "./Market.sol";

contract Factory {
    MarketPositions public immutable positions;
    Market[] public markets;

    constructor() {
        positions = new MarketPositions();
    }

    struct FactoryParameters {
        string name;
        string symbol;
        uint256[] outcomes;
        IStrategy strategy;
    }

    event NewMarket(Market market, string name, string symbol, uint256[] outcomes, IStrategy strategy);

    function deploy(FactoryParameters memory _params) external returns (Market market) {
        market = new Market(_params.name, _params.symbol, _params.outcomes, _params.strategy, positions);
        emit NewMarket(market, _params.name, _params.symbol, _params.outcomes, _params.strategy);
        markets.push(market);
    }

    function getMarkets() external view returns (Market[] memory) {
        return markets;
    }
}
