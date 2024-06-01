'use client';

/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import PatternsExplorerPattern from '@/components/PatternsExplorerPattern/PatternsExplorerPattern';
import { ActionIcon, Modal, Tooltip } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

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
			<Modal onClose={() => setIsModalOpen(!isModalOpen)} opened={isModalOpen} title={t('title')}>
				{allCalendarAssociatedPatternsDataSorted.length > 0 ? allCalendarAssociatedPatternsDataSorted.map(item => <PatternsExplorerPattern key={item._id} patternId={item._id} openInNewTab />) : <NoDataLabel text="No Patterns Found" />}
			</Modal>
			<Tooltip label={t('label')} position="bottom" withArrow>
				<ActionIcon color="blue" loading={allCalendarAssociatedPatternsLoading} onClick={() => setIsModalOpen(!isModalOpen)} size="lg" variant="subtle">
					<IconEye size={20} />
				</ActionIcon>
			</Tooltip>
		</>
	);

	//
}
