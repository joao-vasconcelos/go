'use client';

/* * */

import useSWR from 'swr';
import Text from '@/components/Text/Text';
import { useTranslations } from 'next-intl';
import { IconCloudDownload } from '@tabler/icons-react';
import { Divider } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import { Section } from '@/components/Layouts/Layouts';
import NoDataLabel from '../NoDataLabel/NoDataLabel';
import ExportsExplorerQueueItem from '@/components/ExportsExplorerQueueItem/ExportsExplorerQueueItem';
import ListHeader from '../ListHeader/ListHeader';

/* * */

export default function ExportsExplorerQueue() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ExportsExplorerQueue');

  //
  // B. Fetch data

  const { data: allExportsData, isLoading: allExportsLoading } = useSWR('/api/exports', { refreshInterval: 250 });

  //
  // C. Render components

  return (
    <Pannel
      loading={allExportsLoading}
      header={
        <ListHeader>
          <IconCloudDownload size={22} />
          <Text size="h2" full>
            {t('title')}
          </Text>
        </ListHeader>
      }
    >
      <Section>
        <Text size="h4" color="muted">
          {t('description')}
        </Text>
      </Section>
      <Divider />
      {allExportsData && allExportsData.length > 0 ? (
        <Section>
          {allExportsData.map((item) => (
            <ExportsExplorerQueueItem key={item._id} item={item} />
          ))}
        </Section>
      ) : (
        <NoDataLabel text={t('no_data')} />
      )}
    </Pannel>
  );

  //
}
