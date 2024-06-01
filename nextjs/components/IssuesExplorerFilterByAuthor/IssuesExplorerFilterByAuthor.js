'use client';

/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { Box, Combobox, useCombobox } from '@mantine/core';
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';
import { useMemo } from 'react';

import GlobalFilterButton from '../GlobalFilterByButton/GlobalFilterByButton';
import UsersExplorerUser from '../UsersExplorerUser/UsersExplorerUser';
import styles from './IssuesExplorerFilterByAuthor.module.css';

/* * */

export default function IssuesExplorerFilterByAuthor({ onChange, options, value }) {
	//

	//
	// A. Setup variables

	const combobox = useCombobox();

	//
	// B. Transform data

	const allOptionsFormatted = useMemo(() => {
		// Exit if no data is available
		if (!options) return [];
		// For each status check if it associated with the current issue or not
		return options.map(item => ({ is_selected: value === item, value: item }));
		//
	}, [options, value]);

	//
	// C. Render components

	const handleOptionSubmit = (chosenValue) => {
		onChange(chosenValue);
		// combobox.closeDropdown();
	};

	//
	// D. Render components

	return (
		<Combobox onOptionSubmit={handleOptionSubmit} position="bottom-start" shadow="md" store={combobox} withinPortal={false} withArrow>
			<Combobox.Target>
				<Box className={styles.target} onClick={combobox.toggleDropdown}>
					<GlobalFilterButton label="Author" active />
				</Box>
			</Combobox.Target>
			<Combobox.Dropdown className={styles.dropdown}>
				{allOptionsFormatted.length > 0
					? allOptionsFormatted.map(itemData => (
						<Combobox.Option key={itemData.value} className={styles.option} value={itemData.value}>
							{itemData.is_selected ? <IconCircleCheckFilled size={18} /> : <IconCircle size={18} />}
							<UsersExplorerUser type="full" userId={itemData.value} withHoverCard={false} />
						</Combobox.Option>
					))
					: <NoDataLabel fill />}
			</Combobox.Dropdown>
		</Combobox>
	);
}
