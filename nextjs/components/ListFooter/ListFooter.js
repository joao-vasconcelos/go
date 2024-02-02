/* * */

import styles from './ListFooter.module.css';

/* * */

export default function ListFooter({ children }) {
  return children && <div className={styles.container}>{children}</div>;
}
