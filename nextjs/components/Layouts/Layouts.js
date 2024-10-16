import styles from './Layouts.module.css';

//
// ONE FULL COLUMN
export function OneFullColumn({ first }) {
	return <div className={`${styles.baseLayout} ${styles.oneFullColumn}`}>{first && <div className={styles.innerWrapper}>{first}</div>}</div>;
}

//
// TWO UNEVEN COLUMNS
export function TwoUnevenColumns({ first, second }) {
	return (
		<div className={`${styles.baseLayout} ${styles.twoUnevenColumns}`}>
			<div className={styles.innerWrapper}>{first}</div>
			<div className={styles.innerWrapper}>{second}</div>
		</div>
	);
}

//
// TWO UNEVEN COLUMNS REVERSED
export function TwoUnevenColumnsReversed({ first, second }) {
	return (
		<div className={`${styles.baseLayout} ${styles.twoUnevenColumnsReversed}`}>
			<div className={styles.innerWrapper}>{first}</div>
			<div className={styles.innerWrapper}>{second}</div>
		</div>
	);
}

//
// TWO EVEN COLUMNS
export function TwoEvenColumns({ first, second }) {
	return (
		<div className={`${styles.baseLayout} ${styles.twoEvenColumns}`}>
			<div className={styles.innerWrapper}>{first}</div>
			<div className={styles.innerWrapper}>{second}</div>
		</div>
	);
}

//
// THREE EVEN COLUMNS
export function ThreeEvenColumns({ first, second, third }) {
	return (
		<div className={`${styles.baseLayout} ${styles.threeEvenColumns}`}>
			<div className={styles.innerWrapper}>{first && first}</div>
			<div className={styles.innerWrapper}>{second && second}</div>
			<div className={styles.innerWrapper}>{third && third}</div>
		</div>
	);
}

//
// SECTION
export function Section({ children, description, title }) {
	return (
		<div className={styles.section}>
			{/* replace section with AppLayoutSection */}
			{title && <div className={styles.title}>{title}</div>}
			{description && <div className={styles.description}>{description}</div>}
			{children}
		</div>
	);
}
