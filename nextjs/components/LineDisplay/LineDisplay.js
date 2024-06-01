import styles from './LineDisplay.module.css';

export function LineBadge({ color, short_name, text_color }) {
	return (
		<div className={styles.badge} style={{ backgroundColor: color, color: text_color }}>
			{short_name || '• • •'}
		</div>
	);
}

export function LineName({ name }) {
	return <div className={styles.name}>{name}</div>;
}

export default function LineDisplay({ color, name, short_name, text_color }) {
	return (
		<div className={styles.container}>
			<LineBadge color={color} short_name={short_name} text_color={text_color} />
			<LineName name={name} />
		</div>
	);
}
