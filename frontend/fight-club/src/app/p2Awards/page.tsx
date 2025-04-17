'use client';
import { useRouter } from "next/navigation";
import styles from "./p2.module.css";
import Image from "next/image";



export default function P2Awards(){
    const router = useRouter();
    return (
        <div className={styles.main}>
            <Image className={styles.image} src="/mainMenu.jpg" alt="FingerFight" width={1000} height={1000} />
            <div className={styles.awards}>
                <h1 className={styles.title}>Player Two</h1>
                 <Image className={styles.trophy} src="/bronze.png" alt="FingerFight" width={500} height={500}/>
                 <h2>Bronze Rank</h2>
                 <div className={styles.stats}>
                    <h3>Wins:0</h3>
                    <h3>Losses:0</h3>
                    <h3>Draws:0</h3>
                 </div>
                <button onClick={() => router.push("/main")}>❌</button>
            </div>
        </div>
    )



}