import styles from './UserActivityBadge.module.css';
import { useTranslations, useFormatter, useNow } from 'next-intl';
import Text from '../Text/Text';

export default function UserActivityBadge({ last_active }) {
	//

	const t = useTranslations('UserActivityBadge');
	const format = useFormatter();
	const now = useNow({ updateInterval: 1000 });

	return <Text color="muted">{last_active ? t('was_active', { value: format.relativeTime(new Date(last_active), now) }) : t('was_never_active')}</Text>;
	//   return <div className={styles.container}>{last_active ? t('was_active', { value: format.relativeTime(new Date(last_active), now) }) : t('was_never_active')}</div>;
}