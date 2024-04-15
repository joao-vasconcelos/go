'use client';

/* * */

import Text from '@/components/Text/Text';
import { useTranslations } from 'next-intl';
import ListHeader from '@/components/ListHeader/ListHeader';
import AppButtonBack from '@/components/AppButtonBack/AppButtonBack';

/* * */

export default function ReportsExplorerSalesHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerSalesHeader');

  //
  // B. Handle actions

  //
  // C. Render components

  return (
    <ListHeader>
      <AppButtonBack href={'/reports'} />
      <Text size="h1" style={'untitled'} full>
        {t('untitled')}
      </Text>
    </ListHeader>
  );
}
