/* * */

import { useTranslations } from 'next-intl';
import { Section } from '@/components/Layouts/Layouts';
import Text from '@/components/Text/Text';

/* * */

export default function ReportsExplorerRevenueFormSummary() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerRevenueFormSummary');

  //
  // B. Render components

  return (
    <Section>
      <Text size="h4" color="muted">
        {t('text')}
      </Text>
    </Section>
  );

  //
}
