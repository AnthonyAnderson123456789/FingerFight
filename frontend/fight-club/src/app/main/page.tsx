'use client';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Awards from "../Components/awards/awards";


const contractAddress = "0xF2cD66B329205dB6f929BfAA96e49585897C8377";
const abi = [{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"battleCounted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"battles","outputs":[{"internalType":"uint256","name":"player1ID","type":"uint256"},{"internalType":"uint256","name":"player2ID","type":"uint256"},{"internalType":"uint256","name":"p1Score","type":"uint256"},{"internalType":"uint256","name":"p2Score","type":"uint256"},{"internalType":"bool","name":"finished","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"battlesByPlayerID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"creator","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"p1Score","type":"uint256"},{"internalType":"uint256","name":"p2Score","type":"uint256"}],"name":"finalizeAndUpdate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"p1Score","type":"uint256"},{"internalType":"uint256","name":"p2Score","type":"uint256"}],"name":"finalizeLastBattle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"playerID","type":"uint256"}],"name":"getRecord","outputs":[{"internalType":"uint256","name":"wins","type":"uint256"},{"internalType":"uint256","name":"losses","type":"uint256"},{"internalType":"uint256","name":"ties","type":"uint256"},{"internalType":"uint256","name":"level","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastCreatedBattleByAddress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"playerCountPerAddress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"playerLevel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"players","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"player_addr","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"registerPlayer","outputs":[{"internalType":"uint256","name":"playerID","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"player1ID","type":"uint256"},{"internalType":"uint256","name":"player2ID","type":"uint256"}],"name":"requestBattle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"totalLosses","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"totalTies","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"totalWins","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

export default function Main() {
  const router = useRouter();
  const [playerOneName, setPlayerOneName] = useState("Loading...");
  const [playerTwoName, setPlayerTwoName] = useState("Loading...");
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    async function initContract() {
      if (!(window as any).ethereum) return;

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);

      setContract(contractInstance);

      try {
        const player1 = await contractInstance.players(0);
        const player2 = await contractInstance.players(1);
        setPlayerOneName(player1.name);
        setPlayerTwoName(player2.name);
      } catch (err) {
        console.error("Error loading player names:", err);
        setPlayerOneName("Player 1");
        setPlayerTwoName("Player 2");
      }
    }

    initContract();
  }, []);

  async function handleBattle() {
    if (!contract) {
      alert("Contract not loaded yet");
      return;
    }

    try {
      const tx = await contract.requestBattle(0, 1);
      await tx.wait();
      router.push("/battle");
    } catch (err) {
      console.error("Battle creation failed:", err);
      alert("Could not start battle.");
    }
  }

  return (
    <div className={styles.main}>
      <img className={styles.image} src="/mainMenu.jpg" alt="FingerFight" width={1000} height={1000} />

      <div className={styles.awards}>
        <Awards link="/p1Awards" contract={contract} />
        <Awards link="/p2Awards" contract={contract} />
      </div>

      <div className={styles.title}>Finger Fight</div>

      <div className={styles.players}>
        <h4>{playerOneName}</h4>
        <h4>{playerTwoName}</h4>
      </div>

      <div className={styles.battle}>
        <button onClick={handleBattle}>Battle</button>
      </div>
    </div>
  );
}
