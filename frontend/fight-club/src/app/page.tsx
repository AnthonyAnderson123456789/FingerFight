'use client';
import Image from "next/image";
import styles from "./page.module.css";
import  NameEntry  from "./Components/nameEntry/nameEntry";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.page}>
      <div className={styles.info}>
        <div>
          <NameEntry title="Player 1" />
        </div>

        <div>
          <NameEntry title="Player 2" />
        </div>
      
       
      
      </div>
      <button onClick={() => router.push("/main")} className={styles.button} >Start</button>
      <h1 className={styles.warning}>Please remember to keep your device in portrait mode.</h1>

    </div>
  );
}
