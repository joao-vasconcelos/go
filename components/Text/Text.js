import styles from './Text.module.css';

export default function Text({ size = 'md', style = 'regular', color = 'default', full, children }) {
  return <div className={`${styles.text} ${styles[size]} ${styles[style]} ${styles[color]} ${full && styles.fullWidth}`}>{children}</div>;
}
