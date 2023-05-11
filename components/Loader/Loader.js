import styles from './Loader.module.css';

export default function Loader({ visible, full, size = 30 }) {
  //

  if (!visible) return <div />;

  // Setup spinner
  const Spinner = () => <div className={styles.spinner} style={{ width: size, height: size, borderWidth: size / 7 }} />;

  // If
  if (full) {
    return (
      <div className={styles.overlay}>
        <Spinner />
      </div>
    );
  }

  return <Spinner />;

  //
}
