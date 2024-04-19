/* * */

import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import { useTranslations } from 'next-intl';

/* * */

export default function ReportsExplorerRevenueResultSummaryDescription() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerRevenueResultSummaryDescription');

  //
  // B. Render components

  return (
    <Section>
      <Text size="h4" color="muted">
        {t('description')}
      </Text>
    </Section>
  );

  //
}
