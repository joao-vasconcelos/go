'use client';

/* * */

import { useReportsExplorerSlaContext } from '@/contexts/ReportsExplorerSlaContext';
import { ActionIcon, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

/* * */

export default function ReportsExplorerSlaHeaderToolbar() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerSlaHeaderToolbar');
	const reportsExplorerSlaContext = useReportsExplorerSlaContext();

	//
	// C. Handle actions

	const handleTableSearchQueryChange = ({ currentTarget }) => {
		// reportsExplorerSlaContext.updateTableSearchQuery(currentTarget.value);
	};

	const handleClearSearchChange = ({ currentTarget }) => {
		// reportsExplorerSlaContext.updateTableSearchQuery(currentTarget.value);
	};

	//
	// B. Render components

	return (
		<TextInput
			leftSection={<IconSearch size={20} />}
			onChange={handleTableSearchQueryChange}
			placeholder={t('search.placeholder')}
			size="xl"
			styles={{ input: { border: 0 } }}
			value={reportsExplorerSlaContext.form.table_search_query}
			w="100%"
			rightSection={
				reportsExplorerSlaContext.form.table_search_query.length > 0
				&& (
					<ActionIcon color="gray" onClick={handleClearSearchChange} variant="subtle">
						<IconX size={20} />
					</ActionIcon>
				)

			}
		/>
	);

	//
}
