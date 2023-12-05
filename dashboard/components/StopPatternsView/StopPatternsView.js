'use client';

/* * */

import useSWR from 'swr';
import { ActionIcon, Modal, Tooltip } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import AssociatedPatternsViewRow from '@/components/AssociatedPatternsViewRow/AssociatedPatternsViewRow';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function StopPatternsView({ stop_id }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopPatternsView');

  const [isModalOpen, setIsModalOpen] = useState(false);

  //
  // B. Fetch data

  const { data: allStopAssociatedPatternsData, isLoading: allStopAssociatedPatternsLoading } = useSWR(stop_id && `/api/stops/${stop_id}/associatedPatterns`);

  //
  // C. Render components

  const allStopAssociatedPatternsDataSorted = useMemo(() => {
    if (!allStopAssociatedPatternsData || allStopAssociatedPatternsData.length === 0) return [];
    const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
    return allStopAssociatedPatternsData.sort((a, b) => collator.compare(a.code, b.code));
  }, [allStopAssociatedPatternsData]);

  //
  // C. Render components

  return (
    <>
      <Modal opened={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)} title={t('title')}>
        {allStopAssociatedPatternsDataSorted.length > 0 ? allStopAssociatedPatternsDataSorted.map((item) => <AssociatedPatternsViewRow key={item._id} patternData={item} />) : <NoDataLabel text="No Patterns Found" />}
      </Modal>
      <Tooltip label={t('label')} position="bottom" withArrow>
        <ActionIcon color="blue" variant="subtle" size="lg" onClick={() => setIsModalOpen(!isModalOpen)} loading={allStopAssociatedPatternsLoading}>
          <IconEye size={20} />
        </ActionIcon>
      </Tooltip>
    </>
  );

  //
}
