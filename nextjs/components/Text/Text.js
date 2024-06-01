import styles from './Text.module.css';

export default function Text({ children, color = 'default', full, size = 'md', style = 'regular', ...props }) {
	return (
		<p className={`${styles.text} ${styles[size]} ${styles[style]} ${styles[color]} ${full && styles.fullWidth}`} {...props}>
			{children}
		</p>
	);
}
