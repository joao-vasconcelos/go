'use client';

/* * */

import IssuesExplorerAttributeStatus from '@/components/IssuesExplorerAttributeStatus/IssuesExplorerAttributeStatus';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { IssueOptions } from '@/schemas/Issue/options';
import { Box, Combobox, useCombobox } from '@mantine/core';
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';
import { useMemo } from 'react';

import GlobalFilterButton from '../GlobalFilterByButton/GlobalFilterByButton';
import styles from './IssuesExplorerFilterByAssignedTo.module.css';

/* * */

export default function IssuesExplorerFilterByAssignedTo({ onChange, value }) {
	//

	//
	// A. Setup variables

	const combobox = useCombobox();

	//
	// B. Transform data

	const allStatusDataFormatted = useMemo(() => {
		// Exit if no data is available
		if (!IssueOptions.status) return [];
		// For each status check if it associated with the current issue or not
		return IssueOptions.status.map(item => ({ is_selected: value === item, value: item }));
		//
	}, [value]);

	//
	// C. Render components

	const handleOptionSubmit = (chosenValue) => {
		onChange(chosenValue);
		combobox.closeDropdown();
	};

	//
	// D. Render components

	return (
		<Combobox onOptionSubmit={handleOptionSubmit} position="bottom-start" shadow="md" store={combobox} withinPortal={false} withArrow>
			<Combobox.Target>
				<Box className={styles.target} onClick={combobox.toggleDropdown}>
					<GlobalFilterButton label="Assigned To" />
				</Box>
			</Combobox.Target>
			<Combobox.Dropdown className={styles.dropdown}>
				{allStatusDataFormatted.length > 0
					? allStatusDataFormatted.map(itemData => (
						<Combobox.Option key={itemData.value} className={styles.option} value={itemData.value}>
							{itemData.is_selected ? <IconCircleCheckFilled size={18} /> : <IconCircle size={18} />}
							<IssuesExplorerAttributeStatus status={itemData.value} />
						</Combobox.Option>
					))
					: <NoDataLabel fill />}
			</Combobox.Dropdown>
		</Combobox>
	);

	//
}
