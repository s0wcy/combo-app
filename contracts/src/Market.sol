pragma solidity 0.8.15;

import {IStrategy} from "./Strategy.sol";
import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";
import {IERC1155} from "openzeppelin-contracts/token/ERC1155/IERC1155.sol";
import {IERC1155Receiver} from "openzeppelin-contracts/token/ERC1155/IERC1155Receiver.sol";
import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import {ERC721} from "openzeppelin-contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "openzeppelin-contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {IERC721} from "openzeppelin-contracts/token/ERC721/IERC721.sol";
import {Math} from "openzeppelin-contracts/utils/math/Math.sol";
import {IConditionalTokens} from "ctf-exchange/exchange/interfaces/IConditionalTokens.sol";
import {MarketMaker} from "./MarketMaker.sol";
import {IStrategy} from "./Strategy.sol";

contract MarketPosition is IERC1155Receiver {
    Market immutable market;
    uint256 immutable tokenId;
    MarketPositions immutable positions;

    IERC1155 public constant ctf = IERC1155(0x4D97DCd97eC945f40cF65F87097ACe5EA0476045);

    constructor(Market _market, uint256 _tokenId, MarketPositions _positions) {
        market = _market;
        tokenId = _tokenId;
        positions = _positions;
    }

    struct SettleParams {
        bytes32 parentCollectionId;
        bytes32 conditionId;
        uint256[] indexSets;
    }

    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
        external
        returns (bytes4)
    {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        return true;
    }

    function _getOutcomeDetails(uint256 indexSet) internal pure returns (uint256) {
        uint256 index = 0;
        bool found = false;
        for (uint256 i = 0; i < 256; ++i) {
            if (indexSet & (1 << i) != 0) {
                if (found) {
                    revert("MarketPosition: Invalid indexSet");
                }
                index = i;
                found = true;
            }
        }
        return index;
    }

    function settle(IERC20 collateralToken, SettleParams[] calldata params) external {
        IConditionalTokens _ctf = IConditionalTokens(address(ctf));

        MarketPositions.PositionInfo memory positionInfo = positions.getPosition(tokenId);

        if (positionInfo.market != market) {
            revert("MarketPosition: Invalid market");
        }

        if (positionInfo.outcomes.length != params.length) {
            revert("MarketPosition: Invalid params length");
        }

        bool userWon = true;

        for (uint256 i = 0; i < params.length; i++) {
            SettleParams memory _params = params[i];
            if (_params.parentCollectionId != bytes32(0)) {
                revert("MarketPosition: Invalid parentCollectionId");
            }
            if (_params.indexSets.length != 1) {
                revert("MarketPosition: Invalid indexSets length");
            }
            uint256 positionId = _ctf.getPositionId(
                collateralToken,
                _ctf.getCollectionId(_params.parentCollectionId, _params.conditionId, _params.indexSets[0])
            );
            if (positionId != positionInfo.outcomes[i].outcome) {
                revert("MarketPosition: Invalid positionId");
            }
            uint256 outcomeIndex = _getOutcomeDetails(_params.indexSets[0]);
            uint256 payoutNumerator = _ctf.payoutNumerators(_params.conditionId, outcomeIndex);
            if (payoutNumerator == 0) {
                userWon = false;
            }
            _ctf.redeemPositions(collateralToken, _params.parentCollectionId, _params.conditionId, _params.indexSets);
        }

        if (userWon) {
            address positionOwner = positions.ownerOf(tokenId);
            collateralToken.transfer(positionOwner, collateralToken.balanceOf(address(this)));
        } else {
            collateralToken.approve(address(market), collateralToken.balanceOf(address(this)));
            market.gift(collateralToken.balanceOf(address(this)));
        }
        positions.burn(tokenId);
    }
}

contract MarketPositions is ERC721Enumerable {
    uint256 public counter;
    IERC1155 public constant ctf = IERC1155(0x4D97DCd97eC945f40cF65F87097ACe5EA0476045);

    constructor() ERC721("Combo", "CMBO") {}

    struct PositionOutcomeInfo {
        uint256 outcome;
        uint256 principalAmount;
    }

    struct PositionInfo {
        PositionOutcomeInfo[] outcomes;
        Market market;
        MarketPosition position;
    }

    mapping(uint256 => PositionInfo) public positions;

    function getPosition(uint256 tokenId) external view returns (PositionInfo memory) {
        return positions[tokenId];
    }

    event Combo(address indexed account, Market indexed market, uint256 comboId, MarketPositions.PositionInfo info);

    function mint(address account, PositionOutcomeInfo[] calldata outcomes, uint256[] calldata amounts)
        external
        returns (uint256, PositionInfo memory)
    {
        Market market = Market(msg.sender);
        uint256 currentCounter = ++counter;
        _mint(account, currentCounter);

        uint256[] memory ids = new uint256[](outcomes.length);

        PositionInfo storage info = positions[currentCounter];

        info.position = new MarketPosition(market, currentCounter, this);

        for (uint256 i = 0; i < outcomes.length; i++) {
            info.outcomes.push(outcomes[i]);
            ids[i] = outcomes[i].outcome;
        }

        ctf.safeBatchTransferFrom(address(market), address(info.position), ids, amounts, "");

        info.market = market;

        PositionInfo memory _info = info;

        emit Combo(account, market, currentCounter, _info);

        return (currentCounter, _info);
    }

    function burn(uint256 tokenId) external {
        PositionInfo storage info = positions[tokenId];
        if (address(info.position) != msg.sender) {
            revert("MarketPositions: caller is not the owner");
        }
        _burn(tokenId);
        delete positions[tokenId];
    }
}

contract Market is ERC20, IERC1155Receiver {
    IERC20 public constant principal = IERC20(0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174);
    IERC1155 public constant ctf = IERC1155(0x4D97DCd97eC945f40cF65F87097ACe5EA0476045);

    MarketMaker public constant marketMaker = MarketMaker(0x4D97DCd97eC945f40cF65F87097ACe5EA0476045);

    uint256[] public outcomes;
    mapping(uint256 => uint256) public outcomeIndex;
    IStrategy public immutable strategy;
    MarketPositions public immutable positions;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256[] memory _outcomes,
        IStrategy _strategy,
        MarketPositions _positions
    ) ERC20(_name, _symbol) {
        strategy = _strategy;
        outcomes = _outcomes;
        positions = _positions;
        ctf.setApprovalForAll(address(positions), true);
        for (uint256 i = 0; i < _outcomes.length; i++) {
            outcomeIndex[_outcomes[i]] = i + 1;
        }
    }

    event Deposit(address indexed account, uint256 principalAmount, uint256 mintedAmount);

    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
        external
        returns (bytes4)
    {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        return true;
    }

    function getOutcomes() external view returns (uint256[] memory) {
        return outcomes;
    }

    function deposit(uint256 principalAmount) external {
        uint256 amountToMint = _amountToMint(principalAmount);
        principal.transferFrom(msg.sender, address(this), principalAmount);
        _mint(msg.sender, amountToMint);
        emit Deposit(msg.sender, principalAmount, amountToMint);
    }

    event Gift(address indexed account, uint256 principalAmount);

    function gift(uint256 amount) external {
        principal.transferFrom(msg.sender, address(this), amount);
        emit Gift(msg.sender, amount);
    }

    event Withdraw(address indexed account, uint256 amount, uint256 principalAmount);

    function withdraw(uint256 amount) external {
        uint256 principalAmount = _amountToRedeem(amount);
        _burn(msg.sender, amount);
        principal.transfer(msg.sender, principalAmount);
        emit Withdraw(msg.sender, amount, principalAmount);
    }

    function _amountToMint(uint256 principalAmount) internal view returns (uint256) {
        uint256 currentTotalSupply = totalSupply();
        uint256 currentPrincipalSupply = principal.balanceOf(address(this));
        return currentTotalSupply == 0
            ? principalAmount
            : Math.mulDiv(principalAmount, currentTotalSupply, currentPrincipalSupply, Math.Rounding.Down);
    }

    struct PurchaseParams {
        bytes32 parentCollectionId;
        bytes32 conditionId;
        uint256[] indexSets;
        uint256 pricePerUnit;
    }

    // 0b0001
    // 0b0010

    struct InternalPredictionMintParameter {
        uint256 outcome;
        bytes32 parentCollectionId;
        bytes32 conditionId;
        uint256[] indexSets;
        uint256 pricePerUnit;
        uint256 principalAmount;
        uint256 lpPrincipalAmount;
    }

    function combo(
        MarketPositions.PositionOutcomeInfo[] calldata selectedOutcomes,
        PurchaseParams[] calldata purchaseParams,
        MarketMaker mm
    ) external returns (uint256, MarketPositions.PositionInfo memory) {
        IStrategy.OutcomeInput[] memory strategyOutcomes = new IStrategy.OutcomeInput[](selectedOutcomes.length);
        uint256[] memory mintedAmounts;
        {
            InternalPredictionMintParameter[] memory internalPredictionMintParameters =
                new InternalPredictionMintParameter[](selectedOutcomes.length);
            for (uint256 i = 0; i < selectedOutcomes.length; i++) {
                uint256 principalAmount = selectedOutcomes[i].principalAmount;
                principal.transferFrom(msg.sender, address(this), principalAmount);

                if (outcomeIndex[selectedOutcomes[i].outcome] == 0) {
                    revert("Market: Invalid outcome");
                }
                // here we would add something to check outcomes are sorted but it would add more
                // work for the frontend and we're in a hackathon
                strategyOutcomes[i] = IStrategy.OutcomeInput(selectedOutcomes[i].outcome, principalAmount);
                internalPredictionMintParameters[i] = InternalPredictionMintParameter(
                    selectedOutcomes[i].outcome,
                    purchaseParams[i].parentCollectionId,
                    purchaseParams[i].conditionId,
                    purchaseParams[i].indexSets,
                    purchaseParams[i].pricePerUnit,
                    principalAmount,
                    0
                );
            }

            (bool ok, IStrategy.OutcomeOutput[] memory strategyPricings) = strategy.premium(strategyOutcomes, this);
            if (!ok) {
                revert("Market: Strategy refused combo");
            }

            for (uint256 i = 0; i < selectedOutcomes.length; i++) {
                internalPredictionMintParameters[i].lpPrincipalAmount = strategyPricings[i].lpPrincipalAmount;
            }

            mintedAmounts = _mintPredictionsUsingMarketMaker(internalPredictionMintParameters, mm);
        }

        (uint256 positionId, MarketPositions.PositionInfo memory positionInfo) =
            positions.mint(msg.sender, selectedOutcomes, mintedAmounts);

        return (positionId, positionInfo);
    }

    function _mintPredictionsUsingMarketMaker(
        InternalPredictionMintParameter[] memory internalPredictionMintParameters,
        MarketMaker mm
    ) internal returns (uint256[] memory) {
        uint256[] memory results = new uint256[](internalPredictionMintParameters.length);
        for (uint256 i = 0; i < internalPredictionMintParameters.length; i++) {
            uint256 amountToPay = (
                internalPredictionMintParameters[i].lpPrincipalAmount
                    + internalPredictionMintParameters[i].principalAmount
            );
            uint256 unitsToMint = amountToPay / internalPredictionMintParameters[i].pricePerUnit;
            uint256 amountToPull = unitsToMint * (1e6 - internalPredictionMintParameters[i].pricePerUnit);
            mm.pull(amountToPull);

            uint256 totalAmountToPay = amountToPay + amountToPull;

            principal.approve(address(ctf), totalAmountToPay);

            uint256 currentBalance = ctf.balanceOf(address(this), internalPredictionMintParameters[i].outcome);

            IConditionalTokens _ctf = IConditionalTokens(address(ctf));
            _ctf.splitPosition(
                principal,
                internalPredictionMintParameters[i].parentCollectionId,
                internalPredictionMintParameters[i].conditionId,
                internalPredictionMintParameters[i].indexSets,
                totalAmountToPay
            );

            require(
                ctf.balanceOf(address(this), internalPredictionMintParameters[i].outcome) - currentBalance
                    == totalAmountToPay,
                "Market: Incorrect mint amount"
            );

            results[i] = totalAmountToPay;
        }
        return results;
    }

    function _amountToRedeem(uint256 amount) internal view returns (uint256) {
        uint256 currentTotalSupply = totalSupply();
        uint256 currentPrincipalSupply = principal.balanceOf(address(this));
        return Math.mulDiv(amount, currentPrincipalSupply, currentTotalSupply, Math.Rounding.Down);
    }
}
