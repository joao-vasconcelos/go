/* * */

import { useTranslations } from 'next-intl';
import Text from '@/components/Text/Text';
import ListHeader from '@/components/ListHeader/ListHeader';
import AppButtonBack from '@/components/AppButtonBack/AppButtonBack';

/* * */

export default function ReportsExplorerRealtimeFormHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerRealtimeFormHeader');

  //
  // B. Render components

  return (
    <ListHeader>
      <AppButtonBack href={'/reports'} />
      <Text size="h1" full>
        {t('title')}
      </Text>
    </ListHeader>
  );

  //
}
