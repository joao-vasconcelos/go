'use client';

/* * */

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import styles from './PatternsExplorerIdPageConfigs.module.css';
import { Select } from '@mantine/core';
import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';
import { useMemo } from 'react';

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
		return allLinesData.map((item) => ({ value: item._id, label: `[${item.code}] ${item.name}` }));
	}, [allLinesData]);

	//
	// D. Render components

	return (
		<div className={styles.container}>
			<Select label={t('parent_line.label')} description={t('parent_line.description')} placeholder={t('parent_line.placeholder')} nothingFoundMessage={t('parent_line.nothingFound')} {...patternsExplorerContext.form.getInputProps('parent_line')} data={allLinesDataFormatted} searchable />
		</div>
	);

	//
}