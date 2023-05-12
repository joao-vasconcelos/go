import styles from './Badge.module.css';

export default function Badge({ children }) {
  return <div className={styles.container}>{children}</div>;
}
