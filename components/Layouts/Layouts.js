import styles from './Layouts.module.css';

//
// ONE FULL COLUMN
export function OneFullColumn({ first }) {
  return <div className={`${styles.baseLayout} ${styles.oneFullColumn}`}>{first && <div className={styles.innerWrapper}>{first}</div>}</div>;
}

//
// TWO UNEVEN COLUMNS
export function TwoUnevenColumns({ first, second }) {
  return (
    <div className={`${styles.baseLayout} ${styles.twoUnevenColumns}`}>
      <div className={styles.innerWrapper}>{first}</div>
      <div className={styles.innerWrapper}>{second}</div>
    </div>
  );
}

//
// THREE EVEN COLUMNS
export function ThreeEvenColumns({ first, second, third }) {
  return (
    <div className={`${styles.baseLayout} ${styles.threeEvenColumns}`}>
      {first && <div className={styles.innerWrapper}>{first}</div>}
      {second && <div className={styles.innerWrapper}>{second}</div>}
      {third && <div className={styles.innerWrapper}>{third}</div>}
    </div>
  );
}

//
// SECTION
export function Section({ children }) {
  return <div className={styles.section}>{children}</div>;
}
