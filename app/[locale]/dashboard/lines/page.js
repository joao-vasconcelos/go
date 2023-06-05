import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useTranslations } from 'next-intl';

export default function Page() {
  //

  const t = useTranslations('lines');

  return <NoDataLabel fill text={t('list.no_selection')} />;
}
