import styles from './BaseListItem.module.css';
import { TbChevronRight } from 'react-icons/tb';

export default function BaseListItem({ children, onClick, isSelected, withChevron }) {
  return (
    <div className={styles.container} onClick={onClick} selected={isSelected}>
      <div className={styles.wrapper}>{children}</div>
      {withChevron && <TbChevronRight size={'20px'} opacity={0.25} />}
    </div>
  );
}
