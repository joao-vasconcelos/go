'use client';

/* * */

import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import { ActionIcon, Button, Select } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { LinesExplorerLine } from '../LinesExplorerLine/LinesExplorerLine';
import styles from './IssuesExplorerIdPageItemLines.module.css';

/* * */

export default function IssuesExplorerIdPageItemLines() {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerIdPageItemLines');
	const issuesExplorerContext = useIssuesExplorerContext();

	const [selectedLineId, setSelectedLineId] = useState(null);

	//
	// B. Fetch data

	const { data: allLinesData } = useSWR('/api/lines');

	//
	// C. Transform data

	const allLinesDataFormatted = useMemo(() => {
		// Exit if no data is available
		if (!allLinesData) return [];
		// For each line check if it related with the current issue or not
		return allLinesData.map(line => ({ label: `[${line.short_name}] ${line.name}`, value: line._id }));
		//
	}, [allLinesData]);

	//
	// D. Handle actions

	const handleAddRelatedLine = () => {
		issuesExplorerContext.toggleRelatedLine(selectedLineId);
		setSelectedLineId(null);
	};

	const handleRemoveRelatedLine = (lineId) => {
		issuesExplorerContext.toggleRelatedLine(lineId);
	};

	//
	// E. Render components

	return (
		<div className={styles.container}>
			<div className={styles.list}>
				{issuesExplorerContext.form.values.related_lines.length > 0
				&& issuesExplorerContext.form.values.related_lines.map(lineId => (
					<div key={lineId} className={styles.itemWrapper}>
						<LinesExplorerLine lineId={lineId} />
						{!issuesExplorerContext.page.is_read_only
						&& (
							<ActionIcon color="red" onClick={() => handleRemoveRelatedLine(lineId)} variant="light">
								<IconTrash size={20} />
							</ActionIcon>
						)}
					</div>
				))}
			</div>
			{!issuesExplorerContext.page.is_read_only
			&& (
				<>
					<Select
						data={allLinesDataFormatted}
						label={t('related_lines.label')}
						limit={100}
						nothingFoundMessage={t('related_lines.nothingFound')}
						onChange={setSelectedLineId}
						placeholder={t('related_lines.placeholder')}
						readOnly={issuesExplorerContext.page.is_read_only}
						value={selectedLineId}
						w="100%"
						searchable
					/>
					<Button disabled={!selectedLineId || issuesExplorerContext.page.is_read_only} onClick={handleAddRelatedLine}>
						Add Related Line
					</Button>
				</>
			)}
		</div>
	);
}
