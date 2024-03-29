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

export default function CalendarPatternsView({ calendar_id }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('CalendarPatternsView');

  const [isModalOpen, setIsModalOpen] = useState(false);

  //
  // B. Fetch data

  const { data: allCalendarAssociatedPatternsData, isLoading: allCalendarAssociatedPatternsLoading } = useSWR(calendar_id && `/api/calendars/${calendar_id}/associatedPatterns`);

  //
  // C. Render components

  const allCalendarAssociatedPatternsDataSorted = useMemo(() => {
    if (!allCalendarAssociatedPatternsData || allCalendarAssociatedPatternsData.length === 0) return [];
    const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
    return allCalendarAssociatedPatternsData.sort((a, b) => collator.compare(a.code, b.code));
  }, [allCalendarAssociatedPatternsData]);

  //
  // C. Render components

  return (
    <>
      <Modal opened={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)} title={t('title')}>
        {allCalendarAssociatedPatternsDataSorted.length > 0 ? allCalendarAssociatedPatternsDataSorted.map((item) => <AssociatedPatternsViewRow key={item._id} patternData={item} />) : <NoDataLabel text="No Patterns Found" />}
      </Modal>
      <Tooltip label={t('label')} position="bottom" withArrow>
        <ActionIcon color="blue" variant="subtle" size="lg" onClick={() => setIsModalOpen(!isModalOpen)} loading={allCalendarAssociatedPatternsLoading}>
          <IconEye size={20} />
        </ActionIcon>
      </Tooltip>
    </>
  );

  //
}
