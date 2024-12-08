'use client';

/* * */

import styles from './styles.module.css';

/* * */

export function PlansListItemFilesWrapper({ children, title }) {
	return (
		<div className={styles.container}>
			<p className={styles.title}>{title}</p>
			{children}
		</div>
	);
}
