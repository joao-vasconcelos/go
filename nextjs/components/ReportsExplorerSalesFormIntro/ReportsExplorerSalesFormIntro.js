/* * */

import { useTranslations } from 'next-intl';
import { Section } from '@/components/Layouts/Layouts';
import Text from '@/components/Text/Text';

/* * */

export default function ReportsExplorerSalesFormSummary() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ReportsExplorerSalesFormSummary');

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
