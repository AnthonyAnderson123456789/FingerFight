// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;


 import "Battle.sol";

contract Battlebob {
    struct Player{
        string name;
        address player_addr;
    }
    mapping (address => bool) public player_registered;
    mapping (address => Battle[]) public allBattles;

    Player[] public players;

    function registerPlayer (string memory _name) public {
        require(!player_registered[msg.sender], "You are already registered");
        players.push(Player(_name, msg.sender));
        player_registered[msg.sender] = true;
    }


    function requestBattle(uint playerID) public {
        require (playerID < players.length);
        require (players[playerID].player_addr != msg.sender);
        address otherPlayer = players[playerID].player_addr;

        Battle newBattle = new Battle(msg.sender, otherPlayer);
        allBattles[otherPlayer].push(newBattle);
        allBattles[msg.sender].push(newBattle);
    }

    function getRecord() public view returns (uint, uint){
        Battle[] memory battles = allBattles[msg.sender];
        uint wins = 0;
        uint losses = 0;

        for(uint i = 0 ;i < battles.length; i++){
            if(battles[i].p1Score() > battles[i].p2Score()){
                if(battles[i].player1() == msg.sender){
                    wins++;
                } else {
                    losses++;
                }
            }else{
                if(battles[i].player2() == msg.sender){
                    wins++;
                } else {
                    losses++;
                }
            }
        }
        return (wins,losses);
    }


}


