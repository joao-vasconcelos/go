'use client';

/* * */

import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';
import { Select } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

import styles from './PatternsExplorerIdPageConfigs.module.css';

/* * */

export default function PatternsExplorerIdPageConfigs() {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPageConfigs');
	const patternsExplorerContext = usePatternsExplorerContext();

	//
	// B. Fetch data

	const { data: allLinesData } = useSWR('/api/lines');

	//
	// C. Transform data

	const allLinesDataFormatted = useMemo(() => {
		if (!allLinesData) return [];
		return allLinesData.map(item => ({ label: `[${item.code}] ${item.name}`, value: item._id }));
	}, [allLinesData]);

	//
	// D. Render components

	return (
		<div className={styles.container}>
			<Select description={t('parent_line.description')} label={t('parent_line.label')} nothingFoundMessage={t('parent_line.nothingFound')} placeholder={t('parent_line.placeholder')} {...patternsExplorerContext.form.getInputProps('parent_line')} data={allLinesDataFormatted} searchable />
		</div>
	);

	//
}
