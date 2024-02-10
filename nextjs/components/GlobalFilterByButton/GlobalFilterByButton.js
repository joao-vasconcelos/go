/* * */

import { IconListSearch } from '@tabler/icons-react';
import styles from './GlobalFilterByButton.module.css';

/* * */

export default function GlobalFilterByButton({ icon, label, active = false }) {
  return (
    <div className={`${styles.container} ${active && styles.active}`}>
      {icon || <IconListSearch size={14} />}
      <p className={styles.label}>{label}</p>
    </div>
  );
}
