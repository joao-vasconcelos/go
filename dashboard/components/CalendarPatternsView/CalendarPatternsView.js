'use client';

import useSWR from 'swr';
import styles from './CalendarPatternsView.module.css';
import { ActionIcon, Modal, Tooltip } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Loader from '../Loader/Loader';
import CalendarPatternsViewAsLine from '../CalendarPatternsViewAsLine/CalendarPatternsViewAsLine';

export default function CalendarPatternsView({ calendar_id }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('CalendarPatternsView');

  const [isModalOpen, setIsModalOpen] = useState(false);

  //
  // B. Fetch data

  const { data: allCalendarAssociatedPatternsData } = useSWR(calendar_id && `/api/calendars/${calendar_id}/associatedPatterns`);

  //
  // C. Render components

  return (
    <>
      <Modal opened={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)} title={t('title')}>
        <div>{allCalendarAssociatedPatternsData?.length > 0 ? allCalendarAssociatedPatternsData.map((item) => <CalendarPatternsViewAsLine key={item._id} patternData={item} />) : <Loader />}</div>
      </Modal>
      <Tooltip label={t('label')} position="bottom" withArrow>
        <ActionIcon color="blue" variant="subtle" size="lg" onClick={() => setIsModalOpen(!isModalOpen)}>
          <IconEye size={20} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
