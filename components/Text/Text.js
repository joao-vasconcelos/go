import styles from './Text.module.css';

export default function Text({ size = 'md', style = 'regular', children }) {
  return <div className={`${styles.text} ${styles[size]} ${styles[style]}`}>{children}</div>;
}
