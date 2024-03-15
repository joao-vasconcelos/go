'use client';

/* * */

import { ActionIcon, Modal, Tooltip } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AssociatedPatternsViewRow from '@/components/AssociatedPatternsViewRow/AssociatedPatternsViewRow';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';

/* * */

export default function StopExplorerIdPageHeaderAssociatedPatterns() {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopExplorerIdPageHeaderAssociatedPatterns');
  const stopsExplorerContext = useStopsExplorerContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  //
  // B. Render components

  return (
    <>
      <Modal opened={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)} title={t('title')}>
        {stopsExplorerContext.page.associated_patterns.length > 0 ? stopsExplorerContext.page.associated_patterns.map((item) => <AssociatedPatternsViewRow key={item._id} patternData={item} />) : <NoDataLabel text={t('no_data')} />}
      </Modal>
      <Tooltip label={t('label')} position="bottom" withArrow>
        <ActionIcon color="blue" variant="subtle" size="lg" onClick={() => setIsModalOpen(!isModalOpen)} loading={stopsExplorerContext.page.is_loading}>
          <IconEye size={20} />
        </ActionIcon>
      </Tooltip>
    </>
  );

  //
}
