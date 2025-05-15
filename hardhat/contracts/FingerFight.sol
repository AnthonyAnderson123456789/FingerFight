// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract FingerFight {
    string public creator = "Anthony Jakub Anderson";


    struct Player {
        string name;
        address player_addr;
    }

    struct Battle {
        uint player1ID;
        uint player2ID;
        uint p1Score;
        uint p2Score;
        bool finished;
    }

    Player[] public players;
    Battle[] public battles;

    mapping(address => uint) public playerCountPerAddress;

    mapping(uint => uint[]) public battlesByPlayerID; // playerID => battle indices
    mapping(uint => uint) public totalWins;
    mapping(uint => uint) public totalLosses;
    mapping(uint => uint) public totalTies;
    mapping(uint => uint) public playerLevel;
    mapping(uint => mapping(uint => bool)) public battleCounted; // playerID => battleIndex => counted
    mapping(address => uint) public lastCreatedBattleByAddress;

    // --- Player Registration ---

    function registerPlayer(string memory _name) public returns (uint playerID) {
        require(playerCountPerAddress[msg.sender] < 2, "You can only create 2 players");

        players.push(Player(_name, msg.sender));
        playerID = players.length - 1;
        playerLevel[playerID] = 1;
        playerCountPerAddress[msg.sender]++;
        return playerID;
    }

    // --- Create New Battle ---

    function requestBattle(uint player1ID, uint player2ID) public {
        require(player1ID < players.length && player2ID < players.length, "Invalid player IDs");
        require(player1ID != player2ID, "Cannot battle self");

        require(
            players[player1ID].player_addr == msg.sender || players[player2ID].player_addr == msg.sender,
            "You do not own either player"
        );

        battles.push(Battle(player1ID, player2ID, 0, 0, false));
        uint battleIndex = battles.length - 1;

        battlesByPlayerID[player1ID].push(battleIndex);
        battlesByPlayerID[player2ID].push(battleIndex);

        lastCreatedBattleByAddress[msg.sender] = battleIndex;
    }

    // --- Finalize the Last Battle You Created ---

    function finalizeLastBattle(uint p1Score, uint p2Score) public {
        uint battleIndex = lastCreatedBattleByAddress[msg.sender];
        require(battleIndex < battles.length, "Invalid battle index");

        Battle storage battle = battles[battleIndex];
        require(!battle.finished, "Battle already finished");

        require(
            players[battle.player1ID].player_addr == msg.sender || players[battle.player2ID].player_addr == msg.sender,
            "You do not own this battle"
        );

        battle.p1Score = p1Score;
        battle.p2Score = p2Score;
        battle.finished = true;
    }

    // --- Get Player Stats (auto-updates records) ---

    function getRecord(uint playerID) public returns (uint wins, uint losses, uint ties, uint level) {
        require(playerID < players.length, "Invalid player ID");

        uint[] memory playerBattles = battlesByPlayerID[playerID];

        for (uint i = 0; i < playerBattles.length; i++) {
            uint battleIndex = playerBattles[i];
            if (battleCounted[playerID][battleIndex]) continue;

            Battle memory battle = battles[battleIndex];
            if (!battle.finished) continue;

            uint playerScore;
            uint opponentScore;

            if (battle.player1ID == playerID) {
                playerScore = battle.p1Score;
                opponentScore = battle.p2Score;
            } else {
                playerScore = battle.p2Score;
                opponentScore = battle.p1Score;
            }

            if (playerScore == opponentScore) {
                totalTies[playerID]++;
            } else if (playerScore > opponentScore) {
                totalWins[playerID]++;
            } else {
                totalLosses[playerID]++;
            }

            battleCounted[playerID][battleIndex] = true;
        }

        // Update level
        uint winCount = totalWins[playerID];
        if (winCount >= 10) {
            playerLevel[playerID] = 3;
        } else if (winCount >= 5) {
            playerLevel[playerID] = 2;
        } else {
            playerLevel[playerID] = 1;
        }

        return (
            totalWins[playerID],
            totalLosses[playerID],
            totalTies[playerID],
            playerLevel[playerID]
        );
    }

    function finalizeAndUpdate(uint p1Score, uint p2Score) public {
        finalizeLastBattle(p1Score, p2Score);
        getRecord(0);
        getRecord(1);
    }
}
