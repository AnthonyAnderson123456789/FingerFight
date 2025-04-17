'use client';
import { useRouter } from "next/navigation";
import styles from "./awards.module.css";
export default function awards(props) {
    const router = useRouter();
  return (
    <div className={styles.main}>
      <button onClick={() => router.push(props.link)}>🏆</button>
    </div>
  );
}