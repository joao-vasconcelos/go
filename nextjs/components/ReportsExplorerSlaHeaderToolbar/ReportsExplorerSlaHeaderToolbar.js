'use client';

/* * */

import { useTranslations } from 'next-intl';
import { ActionIcon, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useReportsExplorerSlaContext } from '@/contexts/ReportsExplorerSlaContext';

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
			placeholder={t('search.placeholder')}
			leftSection={<IconSearch size={20} />}
			size="xl"
			w="100%"
			styles={{ input: { border: 0 } }}
			value={reportsExplorerSlaContext.form.table_search_query}
			onChange={handleTableSearchQueryChange}
			rightSection={
				reportsExplorerSlaContext.form.table_search_query.length > 0 &&
              <ActionIcon onClick={handleClearSearchChange} variant="subtle" color="gray">
              	<IconX size={20} />
              </ActionIcon>

			}
		/>
	);

	//
}