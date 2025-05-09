'use client';
import { useRouter } from "next/navigation";
import styles from "./awards.module.css";

export default function Awards(props) {
  const router = useRouter();

  async function handleClick() {
    router.push(props.link);
  }

  return (
    <div className={styles.main}>
      <button onClick={handleClick}>🏆</button>
    </div>
  );
}
