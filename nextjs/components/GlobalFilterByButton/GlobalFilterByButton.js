/* * */

import { IconListSearch } from '@tabler/icons-react';

import styles from './GlobalFilterByButton.module.css';

/* * */

export default function GlobalFilterByButton({ active = false, icon, label }) {
	return (
		<div className={`${styles.container} ${active && styles.active}`}>
			{icon || <IconListSearch size={14} />}
			<p className={styles.label}>{label}</p>
		</div>
	);
}
