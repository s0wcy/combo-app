pragma solidity 0.8.15;

import {Market} from "./Market.sol";

interface IStrategy {
    struct OutcomeInput {
        uint256 outcome;
        uint256 principalAmount;
    }

    struct OutcomeOutput {
        uint256 outcome;
        uint256 principalAmount;
        uint256 lpPrincipalAmount;
    }

    function premium(OutcomeInput[] calldata outcomes, Market market)
        external
        view
        returns (bool, OutcomeOutput[] memory);
    function minimumComboSize() external view returns (uint256);
}

contract StrategyExample is IStrategy {
    function premium(OutcomeInput[] calldata outcomes, Market)
        external
        pure
        override
        returns (bool, OutcomeOutput[] memory)
    {
        OutcomeOutput[] memory premiums = new OutcomeOutput[](outcomes.length);
        for (uint256 i = 0; i < outcomes.length; i++) {
            premiums[i].outcome = outcomes[i].outcome;
            premiums[i].principalAmount = outcomes[i].principalAmount;
            premiums[i].lpPrincipalAmount = outcomes[i].principalAmount;
        }
        return (true, premiums);
    }

    function minimumComboSize() external pure override returns (uint256) {
        return 2;
    }
}
