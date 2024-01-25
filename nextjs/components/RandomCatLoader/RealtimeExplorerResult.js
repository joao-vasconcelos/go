'use client';

/* * */

import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { ActionIcon, Divider } from '@mantine/core';
import { Section } from '@/components/Layouts/Layouts';
import { useTranslations } from 'next-intl';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import RealtimeExplorerResultOverviewMetrics from '../RealtimeExplorerResultOverviewMetrics/RealtimeExplorerResultOverviewMetrics';
import RealtimeExplorerResultOverviewTable from '../RealtimeExplorerResultOverviewTable/RealtimeExplorerResultOverviewTable';
import { IconX } from '@tabler/icons-react';
import RealtimeExplorerResultHeader from '../RealtimeExplorerResultOverviewHeader/RealtimeExplorerResultOverviewHeader';
import RealtimeExplorerResultSummary from '../RealtimeExplorerResultOverviewSummary/RealtimeExplorerResultOverviewSummary';
import Image from 'next/image';

/* * */

export default function RealtimeExplorerResult() {
  //

  //
  // A. Setup variables

  const t = useTranslations('RealtimeExplorerResult');
  const realtimeExplorerContext = useRealtimeExplorerContext();

  //
  // B. Render components

  return realtimeExplorerContext.form.raw_events ? (
    <Pannel header={<RealtimeExplorerResultHeader />}>
      <RealtimeExplorerResultSummary />
      <Divider />
      <RealtimeExplorerResultOverviewMetrics />
      <Divider />
      <RealtimeExplorerResultOverviewTable />
    </Pannel>
  ) : realtimeExplorerContext.form.is_loading || realtimeExplorerContext.form.is_processing ? (
    <div>
      {/* <img
        src={'https://cataas.com/cat'}
        alt="Picture of the author"
        // sizes="500px"
        // fill
        // style={{
        //   objectFit: 'contain',
        // }}
      /> */}
    </div>
  ) : (
    <Pannel>
      <Image
        src={`https://cataas.com/cat/gif?r=${new Date().getMilliseconds()}`}
        alt="Picture of the author"
        sizes="500px"
        priority
        fill
        style={{
          objectFit: 'fill',
        }}
      />
      <NoDataLabel text={t('no_data')} fill />
    </Pannel>
  );

  //
}
