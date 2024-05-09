/* * */

import styles from './AppLayoutSection.module.css';

/* * */

export function AppLayoutSection({ children, title, description, withoutPadding = false }) {
	return (
		<div className={`${styles.container} ${withoutPadding && styles.withoutPadding}`}>
			{(title || description) &&
        <div className={styles.titleDescriptionWrapper}>
        	{title && <h3 className={styles.title}>{title}</h3>}
        	{description && <p className={styles.description}>{description}</p>}
        </div>
			}
			{children && <div className={styles.childrenWrapper}>{children}</div>}
		</div>
	);
}