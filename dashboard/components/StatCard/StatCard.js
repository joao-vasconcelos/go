import styles from './StatCard.module.css';
import Loader from '../Loader/Loader';
import Text from '../Text/Text';
import { CopyButton } from '@mantine/core';
import { Link } from '@/translations/navigation';
import { IconChevronRight } from '@tabler/icons-react';

/* */

export default function StatCard({ title, value, link, type = 'copy' }) {
  //

  let isLoading = true;

  if (!value && value != 0) {
    return <Loader visible />;
  }

  const CopyCard = () => (
    <CopyButton value={value}>
      {({ copied, copy }) => (
        <div className={styles.container} onClick={copy}>
          <div className={styles.wrapper}>
            <Text size="h4">{copied ? 'Value Copied' : title}</Text>
            <div className={styles.value}>{value}</div>
          </div>
        </div>
      )}
    </CopyButton>
  );

  const LinkCard = () => (
    <Link href={link} target="_blank">
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Text size="h4">{title}</Text>
          <div className={styles.value}>{value}</div>
        </div>
        <IconChevronRight className={styles.chevron} />
      </div>
    </Link>
  );

  switch (type) {
    default:
    case 'copy':
      return <CopyCard />;
    case 'link':
      return <LinkCard />;
  }

  //
}
