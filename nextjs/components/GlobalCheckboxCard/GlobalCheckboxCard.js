/* * */

import { Checkbox } from '@mantine/core';

import styles from './GlobalCheckboxCard.module.css';

/* * */

export default function GlobalCheckboxCard({ children, description = '', disabled = false, label = '', onChange = () => null, readOnly = false, value = false }) {
	//

	//
	// A. Handle actions

	const handleToggle = () => {
		if (readOnly || disabled) return;
		onChange(!value);
	};

	//
	// B. Render components

	return (
		<div>
			<div className={`${styles.container} ${value && styles.checked} ${readOnly && styles.readOnly} ${disabled && styles.disabled}`} onClick={handleToggle}>
				<Checkbox checked={value} disabled={disabled} onChange={() => null} readOnly={readOnly} size="md" />
				<div className={styles.innerWrapper}>
					<p className={styles.label}>{label}</p>
					{description && <p className={styles.description}>{description}</p>}
					{children
					&& (
						<div className={styles.childrenWrapper} onClick={e => e.stopPropagation()}>
							{children}
						</div>
					)}
				</div>
			</div>
		</div>
	);

	//
}
