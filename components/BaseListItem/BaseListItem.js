import styles from './BaseListItem.module.css';
import { IconChevronRight } from '@tabler/icons-react';

export default function BaseListItem({ children, onClick, isSelected, withChevron, style }) {
  return (
    <div className={`${styles.container} ${isSelected && styles.isSelected}`} onClick={onClick} selected={isSelected} style={style}>
      <div className={styles.wrapper}>{children}</div>
      {withChevron && <IconChevronRight className={styles.chevron} />}
    </div>
  );
}
