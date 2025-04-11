// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

contract Battle{
    address public player1;
    address public player2;
    bool public gameFinished = false;
    uint public p1Score;
    uint public p2Score;
    constructor(address _player1, address _player2){
        player1 = _player1;
        player2 = _player2;
    }
    
    function finale(uint _p1Score, uint _p2Score)public {
        require(!gameFinished);
        p1Score = _p1Score;
        p2Score = _p2Score;
        gameFinished=true;
    }
}