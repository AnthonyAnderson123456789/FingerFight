'use client';
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import Awards from ".././Components/awards/awards";



export default function Main(){
    const router = useRouter();
    return (
        <div className={styles.main}>
            <Image className={styles.image} src="/mainMenu.jpg" alt="FingerFight" width={1000} height={1000} />
            <div className={styles.awards}>
                <Awards link="/p1Awards" />
                <Awards link="/p2Awards" />
            </div>
            <div className={styles.title}>Finger Fight</div>
            <div className={styles.players}>
                <h4>placeholder</h4>
                <h4>placeholder</h4>
            </div>
            <div className={styles.battle}>
                <button onClick={() => router.push("/battle")}>Battle</button>
            </div>
        </div>
    )



}  