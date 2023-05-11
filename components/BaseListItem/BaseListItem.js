import styles from './BaseListItem.module.css';
import { IconChevronRight } from '@tabler/icons-react';

export default function BaseListItem({ children, onClick, isSelected, withChevron }) {
  return (
    <div className={`${styles.container} ${isSelected && styles.isSelected}`} onClick={onClick} selected={isSelected}>
      <div className={styles.wrapper}>{children}</div>
      {withChevron && <IconChevronRight size={'20px'} opacity={0.25} />}
    </div>
  );
}
