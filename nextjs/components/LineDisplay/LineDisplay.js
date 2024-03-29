import styles from './LineDisplay.module.css';

export function LineBadge({ short_name, color, text_color }) {
  return (
    <div className={styles.badge} style={{ backgroundColor: color, color: text_color }}>
      {short_name || '• • •'}
    </div>
  );
}

export function LineName({ name }) {
  return <div className={styles.name}>{name}</div>;
}

export default function LineDisplay({ short_name, name, color, text_color }) {
  return (
    <div className={styles.container}>
      <LineBadge short_name={short_name} color={color} text_color={text_color} />
      <LineName name={name} />
    </div>
  );
}
