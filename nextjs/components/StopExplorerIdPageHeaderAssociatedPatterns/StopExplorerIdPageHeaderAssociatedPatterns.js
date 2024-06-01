'use client';

/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import PatternsExplorerPattern from '@/components/PatternsExplorerPattern/PatternsExplorerPattern';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import { ActionIcon, Modal, Tooltip } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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
			<Modal onClose={() => setIsModalOpen(!isModalOpen)} opened={isModalOpen} title={t('title')}>
				{stopsExplorerContext.page.associated_patterns.length > 0 ? stopsExplorerContext.page.associated_patterns.map(item => <PatternsExplorerPattern key={item._id} patternId={item._id} openInNewTab />) : <NoDataLabel text={t('no_data')} />}
			</Modal>
			<Tooltip label={t('label')} position="bottom" withArrow>
				<ActionIcon color="blue" loading={stopsExplorerContext.page.is_loading} onClick={() => setIsModalOpen(!isModalOpen)} size="lg" variant="subtle">
					<IconEye size={20} />
				</ActionIcon>
			</Tooltip>
		</>
	);

	//
}
