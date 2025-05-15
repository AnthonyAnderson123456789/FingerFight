'use client';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import styles from "./page.module.css";
import NameEntry from "./Components/nameEntry/nameEntry";
import { useRouter } from "next/navigation";

const contractAddress = "0xF2cD66B329205dB6f929BfAA96e49585897C8377";
const abi = [{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"battleCounted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"battles","outputs":[{"internalType":"uint256","name":"player1ID","type":"uint256"},{"internalType":"uint256","name":"player2ID","type":"uint256"},{"internalType":"uint256","name":"p1Score","type":"uint256"},{"internalType":"uint256","name":"p2Score","type":"uint256"},{"internalType":"bool","name":"finished","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"battlesByPlayerID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"creator","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"p1Score","type":"uint256"},{"internalType":"uint256","name":"p2Score","type":"uint256"}],"name":"finalizeAndUpdate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"p1Score","type":"uint256"},{"internalType":"uint256","name":"p2Score","type":"uint256"}],"name":"finalizeLastBattle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"playerID","type":"uint256"}],"name":"getRecord","outputs":[{"internalType":"uint256","name":"wins","type":"uint256"},{"internalType":"uint256","name":"losses","type":"uint256"},{"internalType":"uint256","name":"ties","type":"uint256"},{"internalType":"uint256","name":"level","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastCreatedBattleByAddress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"playerCountPerAddress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"playerLevel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"players","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"player_addr","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"registerPlayer","outputs":[{"internalType":"uint256","name":"playerID","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"player1ID","type":"uint256"},{"internalType":"uint256","name":"player2ID","type":"uint256"}],"name":"requestBattle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"totalLosses","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"totalTies","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"totalWins","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

export default function Home() {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const router = useRouter();

  async function connectWallet() {
    if (!(window as any).ethereum) {
      alert("Please install MetaMask or another Web3 wallet.");
      return;
    }

    const provider = new ethers.BrowserProvider((window as any).ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const contractInstance = new ethers.Contract(contractAddress, abi, signer);
    setContract(contractInstance);
    setAccount(address);
    console.log("Wallet connected:", address);
  }

  return (
    <div className={styles.page}>
      {!account ? (
        <div className={styles.info}>
          <h1 className={styles.warning}>Please connect your wallet to continue</h1>
          <button className={styles.button} onClick={connectWallet}>Connect Wallet</button>
        </div>
      ) : (
        <>
          <div className={styles.info}>
            <div>
            <NameEntry title="Player 1" contract={contract} />
            </div>
            <div>
            <NameEntry title="Player 2" contract={contract} />
            </div>
          </div>
          <button onClick={() => router.push("/main")} className={styles.button}>Start</button>
          <h1 className={styles.warning}>Please remember to keep your device in portrait mode.</h1>
        </>
      )}
    </div>
  );
}
