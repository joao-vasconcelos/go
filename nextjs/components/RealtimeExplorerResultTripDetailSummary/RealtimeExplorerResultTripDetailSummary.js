'use client';

/* * */

import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import { useTranslations } from 'next-intl';

/* * */

export default function RealtimeExplorerResultTripDetailSummary() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerResultTripDetailSummary');

  //
  // B. Render components

  return (
    <Section>
      <Text size="h4" color="muted">
        {t('summary')}
      </Text>
    </Section>
  );

  //
}
