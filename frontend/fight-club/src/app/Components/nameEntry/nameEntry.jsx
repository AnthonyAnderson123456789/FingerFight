import styles from "./nameEntry.module.css";
export default function nameEntry(props) {
  return (
    <div className={styles.main}>
      <h5 className={styles.title}>{props.title}</h5>
      <input type="text" placeholder="Enter your name" />
      <button>Enter</button>
    </div>
  );
}
