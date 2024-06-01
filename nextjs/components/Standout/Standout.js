'use client';

/* * */

import { IconCaretDownFilled, IconCaretLeftFilled } from '@tabler/icons-react';
import { useState } from 'react';

import styles from './Standout.module.css';

/* * */

export default function Standout({ children, collapsible = false, defaultOpen = true, description = '', icon, title = '' }) {
	//

	//
	// A. Setup variables

	const [isOpen, setIsOpen] = useState(collapsible ? defaultOpen : true);

	//
	// B. Handle actions

	const handleToggle = () => {
		if (collapsible) setIsOpen(prev => !prev);
	};

	//
	// C. Render components

	return (
		<div className={`${styles.container} ${collapsible && styles.collapsible} ${isOpen && styles.isOpen}`}>
			{(icon || title || collapsible)
			&& (
				<div className={styles.header} onClick={handleToggle}>
					<div className={styles.leftSection}>
						{icon && icon}
						{title && <h4 className={styles.title}>{title}</h4>}
					</div>
					<div className={styles.rightSection}>{collapsible && <div className={styles.toggleIcon}>{isOpen ? <IconCaretDownFilled size={18} /> : <IconCaretLeftFilled size={18} />}</div>}</div>
				</div>
			)}
			{(description || children) && isOpen
			&& (
				<div className={styles.content}>
					{description && <p className={styles.description}>{description}</p>}
					{children && <div className={styles.children}>{children}</div>}
				</div>
			)}
		</div>
	);

	//
}
