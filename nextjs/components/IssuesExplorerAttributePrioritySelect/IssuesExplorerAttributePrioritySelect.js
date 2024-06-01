'use client';

/* * */

import IssuesExplorerAttributePriority from '@/components/IssuesExplorerAttributePriority/IssuesExplorerAttributePriority';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { IssueOptions } from '@/schemas/Issue/options';
import { Box, Combobox, useCombobox } from '@mantine/core';
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';
import { useMemo } from 'react';

import styles from './IssuesExplorerAttributePrioritySelect.module.css';

/* * */

export default function IssuesExplorerAttributePrioritySelect({ onChange, value }) {
	//

	//
	// A. Setup variables

	const combobox = useCombobox();

	//
	// B. Transform data

	const allStatusDataFormatted = useMemo(() => {
		// Exit if no data is available
		if (!IssueOptions.priority) return [];
		// For each priority check if it associated with the current issue or not
		return IssueOptions.priority.map(item => ({ is_selected: value === item, value: item }));
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
					<IssuesExplorerAttributePriority value={value} />
				</Box>
			</Combobox.Target>
			<Combobox.Dropdown className={styles.dropdown}>
				{allStatusDataFormatted.length > 0
					? allStatusDataFormatted.map(itemData => (
						<Combobox.Option key={itemData.value} className={styles.option} value={itemData.value}>
							{itemData.is_selected ? <IconCircleCheckFilled size={18} /> : <IconCircle size={18} />}
							<IssuesExplorerAttributePriority value={itemData.value} />
						</Combobox.Option>
					))
					: <NoDataLabel fill />}
			</Combobox.Dropdown>
		</Combobox>
	);
}
