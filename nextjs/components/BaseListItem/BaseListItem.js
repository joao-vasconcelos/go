import { IconChevronRight } from '@tabler/icons-react';

import styles from './BaseListItem.module.css';

export default function BaseListItem({ children, isSelected, onClick, style, withChevron }) {
	return (
		<div className={`${styles.container} ${isSelected && styles.isSelected}`} onClick={onClick} selected={isSelected} style={style}>
			<div className={styles.wrapper}>{children}</div>
			{withChevron && <IconChevronRight className={styles.chevron} />}
		</div>
	);
}
