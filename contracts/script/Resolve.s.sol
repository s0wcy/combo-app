// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import {Script} from "forge-std/Script.sol";
import {Factory} from "../src/Factory.sol";
import {IStrategy} from "../src/Strategy.sol";
import {Market} from "../src/Market.sol";
import {console} from "forge-std/console.sol";
import "./Deploy.s.sol";
import {IERC1155} from "openzeppelin-contracts/token/ERC1155/IERC1155.sol";
import {IConditionalTokens} from "ctf-exchange/exchange/interfaces/IConditionalTokens.sol";

// trump-declassifies-jfk-files-in-first-100-days
bytes32 constant TRUMP_DECLASSIFIES_JFK_FILES_IN_FIRST_100_DAYS =
    0x05154a1e749c3b38cefd9ca1954fc61e7799e476327a105980f408ff0b09808e;

// trump-ends-ukraine-war-before-inauguration
bytes32 constant TRUMP_ENDS_UKRAINE_WAR_BEFORE_INAUGURATION =
    0x60b61a9648a8cac1ace2492291ddbe5c76cc0990297ad0da6be8f349aa177991;

// trump-signs-national-abortion-ban-in-first-100-days
bytes32 constant TRUMP_SIGNS_NATIONAL_ABORTION_BAN_IN_FIRST_100_DAYS =
    0x21d5ad273f3970c3a4c1505786ad4fbffc74ca8c9574d76114a9b2850efae88e;

// trump-ends-gaza-war-in-100-days
bytes32 constant TRUMP_ENDS_GAZA_WAR_IN_100_DAYS = 0x57929d714f2a056dca35b892a6abf6f4d7367131fb084e68b885e0fb2a81fd7d;

// trump-deportation-executive-action-in-first-100-days
bytes32 constant TRUMP_DEPORTATION_EXECUTIVE_ACTION_IN_FIRST_100_DAYS =
    0x4fb0005619f6f35360b4c0362293b217a5d5cf05f5e1bd57e699879a6d475efa;

// trump-ends-department-of-education-in-first-100-days
bytes32 constant TRUMP_ENDS_DEPARTMENT_OF_EDUCATION_IN_FIRST_100_DAYS =
    0x1ca86efce52b4743b55c597ea5ef4cc90af396cbe9048136704e90a4e6a7d58e;

// trump-deportation-executive-action-on-day-1
bytes32 constant TRUMP_DEPORTATION_EXECUTIVE_ACTION_ON_DAY_1 =
    0xe5c701ee3bd370bbb62eff61776392cd5b718982360e6ac54ebc7cfd86f0ef02;

// trump-ends-taxes-on-tips-in-first-100-days
bytes32 constant TRUMP_ENDS_TAXES_ON_TIPS_IN_FIRST_100_DAYS =
    0x7d8b504e9c0a5e52e33d4d507845fa59797207c7db41111bd32942c23f16e59c;

// trump-declassifies-ufo-files-in-first-100-days
bytes32 constant TRUMP_DECLASSIFIES_UFO_FILES_IN_FIRST_100_DAYS =
    0x5464d17ecc22556c08d1bdf7dfec57a950aec7f585ececc360328613417aeacf;

// ethereum-all-time-high-in-2024
bytes32 constant CRYPTO_ETHEREUM_ALL_TIME_HIGH_IN_2024 =
    0xa166b92160e863aef03826c67002886e5359393ba5c44bb3a0cca69b27dcb347;

// will-bitcoin-hit-100k-in-november
bytes32 constant CRYPTO_WILL_BITCOIN_HIT_100K_IN_NOVEMBER =
    0xed372a8d6583a8bcaf2c5812fb72276246a4d514afc7cc4dd5dc29678f8f6aee;

// bitcoin-above-90000-on-november-22
bytes32 constant CRYPTO_BITCOIN_ABOVE_90000_ON_NOVEMBER_22 =
    0x8d9b65c945640a8e65d6ddd265aff163e8752cf3a3f02a402f89ec43bc7eb8e4;

// will-trump-create-a-national-bitcoin-reserve-in-his-first-100-days
bytes32 constant CRYPTO_WILL_TRUMP_CREATE_A_NATIONAL_BITCOIN_RESERVE_IN_HIS_FIRST_100_DAYS =
    0x651fb041dcfe3837d15824bafda9f166cbef1106f857d4e4a34092efd1a479d3;

// will-microsoft-shareholders-vote-for-bitcoin-investment
bytes32 constant CRYPTO_WILL_MICROSOFT_SHAREHOLDERS_VOTE_FOR_BITCOIN_INVESTMENT =
    0xf95d619cfcf2d1d24f26d074856071ba59ee9768371b0761999ca0336c4897af;

// ethereum-above-3000-on-november-22
bytes32 constant CRYPTO_ETHEREUM_ABOVE_3000_ON_NOVEMBER_22 =
    0x6118abeeb4167f42cdd0022f82d0eeaa9457a9f73e0cb5a6c738ab889993fa5f;

// solana-above-200-on-november-22
bytes32 constant CRYPTO_SOLANA_ABOVE_200_ON_NOVEMBER_22 =
    0x1aa1c89f4298c3fdcd9d628f9c03bf85f809e1dcff98db74995a56a4e94d387a;

bytes32 constant NBA_11_17_NBA_PHX_MIN_2024_11_17__SUNS_Q =
    0xcb1a41fc690d1e2f939ade8450020e85bb7a851fefb70e5905e32f0765de22ce;

// nba-mia-ind-2024-11-17
bytes32 constant NBA_11_17_NBA_MIA_IND_2024_11_17__HEAT_Q =
    0xbdf96833f92699c63664a8ce4c349d0fe0931f209b9ce392ec84a5a3b13d9aa8;

// nba-atl-por-2024-11-17
bytes32 constant NBA_11_17_NBA_ATL_POR_2024_11_17__HAWKS_Q =
    0xbc61b52f6dd912fc68ab147126c6b19b95f23076280e5a996697cf713161fb80;

// nba-det-was-2024-11-17
bytes32 constant NBA_11_17_NBA_DET_WAS_2024_11_17__PISTONS_Q =
    0x35c6532a1285406deaba5daad06539d1225ef46bb5f7a57398333fcb1594bc4d;

// nba-den-mem-2024-11-17
bytes32 constant NBA_11_17_NBA_DEN_MEM_2024_11_17__NUGGETS_Q =
    0x229ebe8475665893a250911d0d87073e9affc097184bc1ee15475d15dc735ba8;

// nba-cha-cle-2024-11-17
bytes32 constant NBA_11_17_NBA_CHA_CLE_2024_11_17__HORNETS_Q =
    0x47287123752e844b0ccdce7e45c1d373666fe52a17da8fe65ef2fc5d8fca76b7;

// nba-dal-okc-2024-11-17
bytes32 constant NBA_11_17_NBA_DAL_OKC_2024_11_17__MAVERICKS_Q =
    0x73293053a57fee0b714fe3e4a3381aef508e2c6a2925d253b0cf39f7eb49df56;

// nba-hou-chi-2024-11-17
bytes32 constant NBA_11_17_NBA_HOU_CHI_2024_11_17__ROCKETS_Q =
    0x5eb2b41277cfd550df42c9b55934334397a49584dbfce19feaecb220e24d3afc;

// nba-bkn-nyk-2024-11-17
bytes32 constant NBA_11_17_NBA_BKN_NYK_2024_11_17__NETS_Q =
    0xc0876d74d0f40043d76c8ec2d46ae00d5f1545011db8d1bf681dcba2fc0c5464;

// nba-uta-lac-2024-11-17
bytes32 constant NBA_11_17_NBA_UTA_LAC_2024_11_17__JAZZ_Q =
    0x9dbfd7791ac7e64f793f5a3eed3488f4e42b8c752ef1c5ae9d247523a2769810;

// nfl-min-ten-2024-11-17
bytes32 constant NFL_11_17_NFL_MIN_TEN_2024_11_17__VIKINGS_Q =
    0xbd147520b1060aac10401416ae966823686692589ff1eb6a6d5c367e5fd207e9;

// nfl-gb-chi-2024-11-17
bytes32 constant NFL_11_17_NFL_GB_CHI_2024_11_17__PACKERS_Q =
    0xca57b9a1e488346211697d5916a007782f3c19989d860cd2f2758cbf0db2bfc5;

// nfl-la-ne-2024-11-17
bytes32 constant NFL_11_17_NFL_LA_NE_2024_11_17__RAMS_Q =
    0xfc383a71713b31124e7f4a61726a131f751effbc5889f122b112881834615677;

// nfl-cle-no-2024-11-17
bytes32 constant NFL_11_17_NFL_CLE_NO_2024_11_17__BROWNS_Q =
    0x0db4bfbe0aeb5a5a1feb42ca4286200ee590169687dafe9c282986485b2e455d;

// nfl-bal-pit-2024-11-17
bytes32 constant NFL_11_17_NFL_BAL_PIT_2024_11_17__RAVENS_Q =
    0x51533491162edf058f11d847ca0783c67124555b2e3b54b15e157ce0b6f24986;

// nfl-jax-det-2024-11-17
bytes32 constant NFL_11_17_NFL_JAX_DET_2024_11_17__JAGUARS_Q =
    0x804e29f6041fbe1868b8e55b0f416fd3b16abfbaf4159e2024ea1951b92ce8a6;

// nfl-ind-nyj-2024-11-17
bytes32 constant NFL_11_17_NFL_IND_NYJ_2024_11_17__COLTS_Q =
    0x96e2fa1065e9f0081ae1efb702dd3f1ba0b9d788c9c6ca22250822059dc5387d;

// nfl-lv-mia-2024-11-17
bytes32 constant NFL_11_17_NFL_LV_MIA_2024_11_17__RAIDERS_Q =
    0xf3978ea60026f677db4364d1f5ba247a953e023c396f2b73e9453c20766d9117;

// nfl-atl-den-2024-11-17
bytes32 constant NFL_11_17_NFL_ATL_DEN_2024_11_17__FALCONS_Q =
    0xa6d32b310258e67acf3cb3a8d3c75b3bfe94cd829e8b7ee84751f8204448d688;

// nfl-sea-sf-2024-11-17
bytes32 constant NFL_11_17_NFL_SEA_SF_2024_11_17__SEAHAWKS_Q =
    0x731dfb0fadf6be857696d81cf7546a19a531d60f85716955d8a4dd8cd9e6b4c2;

// nfl-kc-buf-2024-11-17
bytes32 constant NFL_11_17_NFL_KC_BUF_2024_11_17__CHIEFS_Q =
    0x19b6996b3dcfa4c7be2957aa499a4c1630625c0059730b0e3fb98efe4f7443d2;

// nfl-cin-lac-2024-11-17
bytes32 constant NFL_11_17_NFL_CIN_LAC_2024_11_17__BENGALS_Q =
    0x497ed67a57d363deb9b175bac5d346238e5ec5ff8127e22e6246f2512c09301b;

contract Resolve is Script {
    IERC1155 public constant ctf = IERC1155(0x4D97DCd97eC945f40cF65F87097ACe5EA0476045);

    function getRandomBinaryResult() internal view returns (uint256[] memory result) {
        uint256[] memory results = new uint256[](2);
        if (uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 2 == 0) {
            results[0] = 1;
            results[1] = 0;
        } else {
            results[0] = 0;
            results[1] = 1;
        }
    }

    function getRandomWinner(uint256 n) internal view returns (uint256 winner) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % n;
    }

    function getResultFromWinner(uint256 winner, uint256 n) internal view returns (uint256[] memory result) {
        uint256[] memory results = new uint256[](2);

        if (n == winner) {
            results[0] = 0;
            results[1] = 1;
        } else {
            results[0] = 1;
            results[1] = 0;
        }

        return results;
    }

    function run() external {
        IConditionalTokens token = IConditionalTokens(address(ctf));
        vm.startBroadcast();

        // TRUMP RESOLUTIONS
        token.reportPayouts(bytes32(TRUMP_DECLASSIFIES_JFK_FILES_IN_FIRST_100_DAYS), getRandomBinaryResult());
        token.reportPayouts(bytes32(TRUMP_ENDS_UKRAINE_WAR_BEFORE_INAUGURATION), getRandomBinaryResult());
        token.reportPayouts(bytes32(TRUMP_SIGNS_NATIONAL_ABORTION_BAN_IN_FIRST_100_DAYS), getRandomBinaryResult());
        token.reportPayouts(bytes32(TRUMP_ENDS_GAZA_WAR_IN_100_DAYS), getRandomBinaryResult());
        token.reportPayouts(bytes32(TRUMP_DEPORTATION_EXECUTIVE_ACTION_IN_FIRST_100_DAYS), getRandomBinaryResult());
        token.reportPayouts(bytes32(TRUMP_ENDS_DEPARTMENT_OF_EDUCATION_IN_FIRST_100_DAYS), getRandomBinaryResult());
        token.reportPayouts(bytes32(TRUMP_DEPORTATION_EXECUTIVE_ACTION_ON_DAY_1), getRandomBinaryResult());
        token.reportPayouts(bytes32(TRUMP_ENDS_TAXES_ON_TIPS_IN_FIRST_100_DAYS), getRandomBinaryResult());
        token.reportPayouts(bytes32(TRUMP_DECLASSIFIES_UFO_FILES_IN_FIRST_100_DAYS), getRandomBinaryResult());

        // CRYPTO RESOLUTIONS
        token.reportPayouts(bytes32(CRYPTO_ETHEREUM_ALL_TIME_HIGH_IN_2024), getRandomBinaryResult());
        token.reportPayouts(bytes32(CRYPTO_WILL_BITCOIN_HIT_100K_IN_NOVEMBER), getRandomBinaryResult());
        token.reportPayouts(bytes32(CRYPTO_BITCOIN_ABOVE_90000_ON_NOVEMBER_22), getRandomBinaryResult());
        token.reportPayouts(
            bytes32(CRYPTO_WILL_TRUMP_CREATE_A_NATIONAL_BITCOIN_RESERVE_IN_HIS_FIRST_100_DAYS), getRandomBinaryResult()
        );
        token.reportPayouts(
            bytes32(CRYPTO_WILL_MICROSOFT_SHAREHOLDERS_VOTE_FOR_BITCOIN_INVESTMENT), getRandomBinaryResult()
        );
        token.reportPayouts(bytes32(CRYPTO_ETHEREUM_ABOVE_3000_ON_NOVEMBER_22), getRandomBinaryResult());
        token.reportPayouts(bytes32(CRYPTO_SOLANA_ABOVE_200_ON_NOVEMBER_22), getRandomBinaryResult());

        // NBA RESOLUTIONS
        uint256 winner = getRandomWinner(10);
        token.reportPayouts(bytes32(NBA_11_17_NBA_PHX_MIN_2024_11_17__SUNS_Q), getResultFromWinner(winner, 0));
        token.reportPayouts(bytes32(NBA_11_17_NBA_MIA_IND_2024_11_17__HEAT_Q), getResultFromWinner(winner, 1));
        token.reportPayouts(bytes32(NBA_11_17_NBA_ATL_POR_2024_11_17__HAWKS_Q), getResultFromWinner(winner, 2));
        token.reportPayouts(bytes32(NBA_11_17_NBA_DET_WAS_2024_11_17__PISTONS_Q), getResultFromWinner(winner, 3));
        token.reportPayouts(bytes32(NBA_11_17_NBA_DEN_MEM_2024_11_17__NUGGETS_Q), getResultFromWinner(winner, 4));
        token.reportPayouts(bytes32(NBA_11_17_NBA_CHA_CLE_2024_11_17__HORNETS_Q), getResultFromWinner(winner, 5));
        token.reportPayouts(bytes32(NBA_11_17_NBA_DAL_OKC_2024_11_17__MAVERICKS_Q), getResultFromWinner(winner, 6));
        token.reportPayouts(bytes32(NBA_11_17_NBA_HOU_CHI_2024_11_17__ROCKETS_Q), getResultFromWinner(winner, 7));
        token.reportPayouts(bytes32(NBA_11_17_NBA_BKN_NYK_2024_11_17__NETS_Q), getResultFromWinner(winner, 8));
        token.reportPayouts(bytes32(NBA_11_17_NBA_UTA_LAC_2024_11_17__JAZZ_Q), getResultFromWinner(winner, 9));

        // NFL RESOLUTIONS
        winner = getRandomWinner(24);
        token.reportPayouts(bytes32(NFL_11_17_NFL_MIN_TEN_2024_11_17__VIKINGS_Q), getResultFromWinner(winner, 0));
        token.reportPayouts(bytes32(NFL_11_17_NFL_GB_CHI_2024_11_17__PACKERS_Q), getResultFromWinner(winner, 1));
        token.reportPayouts(bytes32(NFL_11_17_NFL_LA_NE_2024_11_17__RAMS_Q), getResultFromWinner(winner, 2));
        token.reportPayouts(bytes32(NFL_11_17_NFL_CLE_NO_2024_11_17__BROWNS_Q), getResultFromWinner(winner, 3));
        token.reportPayouts(bytes32(NFL_11_17_NFL_BAL_PIT_2024_11_17__RAVENS_Q), getResultFromWinner(winner, 4));
        token.reportPayouts(bytes32(NFL_11_17_NFL_JAX_DET_2024_11_17__JAGUARS_Q), getResultFromWinner(winner, 5));
        token.reportPayouts(bytes32(NFL_11_17_NFL_IND_NYJ_2024_11_17__COLTS_Q), getResultFromWinner(winner, 6));
        token.reportPayouts(bytes32(NFL_11_17_NFL_LV_MIA_2024_11_17__RAIDERS_Q), getResultFromWinner(winner, 7));
        token.reportPayouts(bytes32(NFL_11_17_NFL_ATL_DEN_2024_11_17__FALCONS_Q), getResultFromWinner(winner, 8));
        token.reportPayouts(bytes32(NFL_11_17_NFL_SEA_SF_2024_11_17__SEAHAWKS_Q), getResultFromWinner(winner, 9));
        token.reportPayouts(bytes32(NFL_11_17_NFL_KC_BUF_2024_11_17__CHIEFS_Q), getResultFromWinner(winner, 10));
        token.reportPayouts(bytes32(NFL_11_17_NFL_CIN_LAC_2024_11_17__BENGALS_Q), getResultFromWinner(winner, 11));
        token.reportPayouts(bytes32(NFL_11_17_NFL_MIN_TEN_2024_11_17__VIKINGS_Q), getResultFromWinner(winner, 12));
        token.reportPayouts(bytes32(NFL_11_17_NFL_GB_CHI_2024_11_17__PACKERS_Q), getResultFromWinner(winner, 13));
        token.reportPayouts(bytes32(NFL_11_17_NFL_LA_NE_2024_11_17__RAMS_Q), getResultFromWinner(winner, 14));
        token.reportPayouts(bytes32(NFL_11_17_NFL_CLE_NO_2024_11_17__BROWNS_Q), getResultFromWinner(winner, 15));
        token.reportPayouts(bytes32(NFL_11_17_NFL_BAL_PIT_2024_11_17__RAVENS_Q), getResultFromWinner(winner, 16));
        token.reportPayouts(bytes32(NFL_11_17_NFL_JAX_DET_2024_11_17__JAGUARS_Q), getResultFromWinner(winner, 17));
        token.reportPayouts(bytes32(NFL_11_17_NFL_IND_NYJ_2024_11_17__COLTS_Q), getResultFromWinner(winner, 18));
        token.reportPayouts(bytes32(NFL_11_17_NFL_LV_MIA_2024_11_17__RAIDERS_Q), getResultFromWinner(winner, 19));
        token.reportPayouts(bytes32(NFL_11_17_NFL_ATL_DEN_2024_11_17__FALCONS_Q), getResultFromWinner(winner, 20));
        token.reportPayouts(bytes32(NFL_11_17_NFL_SEA_SF_2024_11_17__SEAHAWKS_Q), getResultFromWinner(winner, 21));
        token.reportPayouts(bytes32(NFL_11_17_NFL_KC_BUF_2024_11_17__CHIEFS_Q), getResultFromWinner(winner, 22));
        token.reportPayouts(bytes32(NFL_11_17_NFL_CIN_LAC_2024_11_17__BENGALS_Q), getResultFromWinner(winner, 23));

        vm.stopBroadcast();
    }
}
