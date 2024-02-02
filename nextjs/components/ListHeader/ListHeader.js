/* * */

import styles from './ListHeader.module.css';

/* * */

export default function ListHeader({ children }) {
  return children && <div className={styles.container}>{children}</div>;
}
