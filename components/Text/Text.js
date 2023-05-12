import styles from './Text.module.css';

export default function Text({ size = 'md', style = 'regular', full, children }) {
  return <div className={`${styles.text} ${styles[size]} ${styles[style]} ${full && styles.fullWidth}`}>{children}</div>;
}
