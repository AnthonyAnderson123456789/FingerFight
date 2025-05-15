'use client';
import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import styles from "./battle.module.css";

// You can move this to a shared config file later
const contractAddress = "0xF2cD66B329205dB6f929BfAA96e49585897C8377";
const abi = [{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"battleCounted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"battles","outputs":[{"internalType":"uint256","name":"player1ID","type":"uint256"},{"internalType":"uint256","name":"player2ID","type":"uint256"},{"internalType":"uint256","name":"p1Score","type":"uint256"},{"internalType":"uint256","name":"p2Score","type":"uint256"},{"internalType":"bool","name":"finished","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"battlesByPlayerID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"creator","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"p1Score","type":"uint256"},{"internalType":"uint256","name":"p2Score","type":"uint256"}],"name":"finalizeAndUpdate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"p1Score","type":"uint256"},{"internalType":"uint256","name":"p2Score","type":"uint256"}],"name":"finalizeLastBattle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"playerID","type":"uint256"}],"name":"getRecord","outputs":[{"internalType":"uint256","name":"wins","type":"uint256"},{"internalType":"uint256","name":"losses","type":"uint256"},{"internalType":"uint256","name":"ties","type":"uint256"},{"internalType":"uint256","name":"level","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastCreatedBattleByAddress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"playerCountPerAddress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"playerLevel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"players","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"player_addr","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"registerPlayer","outputs":[{"internalType":"uint256","name":"playerID","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"player1ID","type":"uint256"},{"internalType":"uint256","name":"player2ID","type":"uint256"}],"name":"requestBattle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"totalLosses","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"totalTies","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"totalWins","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

export default function Battle() {
  const [countdown, setCountdown] = useState<string | number>("Ready");
  const [buttonsEnabled, setButtonsEnabled] = useState(false);
  const [winner, setWinner] = useState<null | string>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const playerOnePresses = useRef(0);
  const playerTwoPresses = useRef(0);

  useEffect(() => {
    async function connectContract() {
      if (!(window as any).ethereum) return;

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      setContract(contractInstance);
    }

    connectContract();

    let steps = ["Ready", "Set", "Go"];
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setCountdown(steps[currentStep]);
        currentStep++;
      } else {
        setCountdown(10);
        setButtonsEnabled(true);
        clearInterval(interval);
        startCountdown();
      }
    }, 1000);

    function startCountdown() {
      let number = 10;
      const countInterval = setInterval(() => {
        setCountdown((prev) => {
          if (typeof prev === "number") {
            if (prev > 0) {
              return prev - 1;
            } else {
              clearInterval(countInterval);
              setButtonsEnabled(false);

              const p1 = playerOnePresses.current;
              const p2 = playerTwoPresses.current;

              if (p1 > p2) {
                setWinner("Player 1 Wins!");
              } else if (p2 > p1) {
                setWinner("Player 2 Wins!");
              } else {
                setWinner("It's a Tie!");
              }

              return 0;
            }
          }
          return prev;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, []);

  function handlePlayerOnePress() {
    if (buttonsEnabled) {
      playerOnePresses.current += 1;
    }
  }

  function handlePlayerTwoPress() {
    if (buttonsEnabled) {
      playerTwoPresses.current += 1;
    }
  }

  async function finalizeAndReturn() {
    if (!contract) {
      alert("Contract not loaded.");
      return;
    }

    const p1 = playerOnePresses.current;
    const p2 = playerTwoPresses.current;

    try {
      const tx = await contract.finalizeAndUpdate(p1, p2);
      await tx.wait();
      window.location.href = "/main";
    } catch (err) {
      console.error("Failed to finalize battle:", err);
      alert("Could not finalize battle.");
    }
  }

  return (
    <div className={styles.main}>
      <img
        className={styles.image}
        src="/battle.jpg"
        alt="FingerFight"
        width={1000}
        height={1000}
      />
      <div className={styles.battle}>
        <button
          disabled={!buttonsEnabled}
          className={!buttonsEnabled ? styles.disabledButton : ""}
          onClick={handlePlayerOnePress}
        >
          Press Quickly!
        </button>
        <h1>{countdown}</h1>
        <button
          disabled={!buttonsEnabled}
          className={!buttonsEnabled ? styles.disabledButton : ""}
          onClick={handlePlayerTwoPress}
        >
          Press Quickly!
        </button>
      </div>

      {winner && (
        <div className={styles.overlay}>
          <h2>{winner}</h2>
          <button onClick={finalizeAndReturn}>Return</button>
        </div>
      )}
    </div>
  );
}
