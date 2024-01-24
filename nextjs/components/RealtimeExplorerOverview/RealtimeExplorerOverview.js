/* * */

import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { useTranslations } from 'next-intl';
import { IconCloudPlus } from '@tabler/icons-react';
import { Divider } from '@mantine/core';
import { Section } from '@/components/Layouts/Layouts';
import RealtimeExplorerOverviewForm from '@/components/RealtimeExplorerOverviewForm/RealtimeExplorerOverviewForm';
import RealtimeExplorerOverviewList from '@/components/RealtimeExplorerOverviewList/RealtimeExplorerOverviewList';

/* * */

export default function RealtimeExplorerOverview() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerOverview');

  //
  // E. Render components

  return (
    <Pannel
      header={
        <>
          <IconCloudPlus size={22} />
          <Text size="h2" full>
            {t('title')}
          </Text>
        </>
      }
    >
      <Section>
        <Text size="h4" color="muted">
          {t('description')}
        </Text>
      </Section>
      <Divider />
      <RealtimeExplorerOverviewForm />
      <Divider />
      <RealtimeExplorerOverviewList />
    </Pannel>
  );
}
