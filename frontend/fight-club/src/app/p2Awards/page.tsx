'use client';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import styles from "./p2.module.css";

// Your deployed contract info
const contractAddress = "0xF2cD66B329205dB6f929BfAA96e49585897C8377";
const abi = [{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"battleCounted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"battles","outputs":[{"internalType":"uint256","name":"player1ID","type":"uint256"},{"internalType":"uint256","name":"player2ID","type":"uint256"},{"internalType":"uint256","name":"p1Score","type":"uint256"},{"internalType":"uint256","name":"p2Score","type":"uint256"},{"internalType":"bool","name":"finished","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"battlesByPlayerID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"creator","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"p1Score","type":"uint256"},{"internalType":"uint256","name":"p2Score","type":"uint256"}],"name":"finalizeAndUpdate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"p1Score","type":"uint256"},{"internalType":"uint256","name":"p2Score","type":"uint256"}],"name":"finalizeLastBattle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"playerID","type":"uint256"}],"name":"getRecord","outputs":[{"internalType":"uint256","name":"wins","type":"uint256"},{"internalType":"uint256","name":"losses","type":"uint256"},{"internalType":"uint256","name":"ties","type":"uint256"},{"internalType":"uint256","name":"level","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastCreatedBattleByAddress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"playerCountPerAddress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"playerLevel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"players","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"player_addr","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"registerPlayer","outputs":[{"internalType":"uint256","name":"playerID","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"player1ID","type":"uint256"},{"internalType":"uint256","name":"player2ID","type":"uint256"}],"name":"requestBattle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"totalLosses","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"totalTies","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"totalWins","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

export default function P2Awards() {
  const router = useRouter();

  const [name, setName] = useState("Loading...");
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [ties, setTies] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    async function fetchStats() {
      if (!(window as any).ethereum) return;

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const player = await contract.players(1); // Player 1
        const w = await contract.totalWins(1);
        const l = await contract.totalLosses(1);
        const t = await contract.totalTies(1);
        const lvl = await contract.playerLevel(1);

        setName(player.name);
        setWins(Number(w));
        setLosses(Number(l));
        setTies(Number(t));
        setLevel(Number(lvl));
      } catch (err) {
        console.error("Error loading player stats:", err);
      }
    }

    fetchStats();
  }, []);

  let rank = "Bronze Rank";
  let image = "/bronze.png";

  if (level === 2) {
    rank = "Silver Rank";
    image = "/silver.png";
  } else if (level === 3) {
    rank = "Gold Rank";
    image = "/gold.png";
  }

  return (
    <div className={styles.main}>
      <img
        className={styles.image}
        src="/mainMenu.jpg"
        alt="FingerFight"
        width={1000}
        height={1000}
      />

      <div className={styles.awards}>
        <h1 className={styles.title}>{name}</h1>
        <img
          className={styles.trophy}
          src={image}
          alt="Trophy"
          width={500}
          height={500}
        />
        <h2>{rank}</h2>
        <div className={styles.stats}>
          <h3>Wins: {wins}</h3>
          <h3>Losses: {losses}</h3>
          <h3>Draws: {ties}</h3>
        </div>
        <button onClick={() => router.push("/main")}>❌</button>
      </div>
    </div>
  );
}
