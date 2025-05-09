// nameEntry.jsx (or .js)
import styles from "./nameEntry.module.css";
import { useState } from "react";

export default function NameEntry(props) {
  const [name, setName] = useState("");
  const [registered, setRegistered] = useState(false);

  async function handleRegister() {
    if (!props.contract) {
      alert("Contract not available.");
      return;
    }

    try {
      const tx = await props.contract.registerPlayer(name);
      await tx.wait();
      setRegistered(true);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  }

  return (
    <div className={styles.main}>
      <h5 className={styles.title}>{props.title}</h5>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleRegister}>Enter</button>

      {registered && (
        <div className={styles.overlay}>
          <span>User <br /> Connected</span>
        </div>
      )}
    </div>
  );
}
